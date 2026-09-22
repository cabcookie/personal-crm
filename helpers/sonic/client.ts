import {
  BedrockRuntimeClient,
  InvokeModelWithBidirectionalStreamCommand,
  type InvokeModelWithBidirectionalStreamInput,
} from "@aws-sdk/client-bedrock-runtime";
import { fetchAuthSession } from "aws-amplify/auth";
import { v4 as uuid } from "uuid";
import {
  SONIC_MODEL_ID,
  SONIC_REGION,
  type SonicTokenTotals,
} from "./constants";
import {
  audioContentStartEvent,
  audioInputEvent,
  contentEndEvent,
  promptEndEvent,
  promptStartEvent,
  sessionEndEvent,
  sessionStartEvent,
  textContentStartEvent,
  textInputEvent,
  toolContentStartEvent,
  toolResultEvent,
  type ToolSpec,
} from "./events";

/**
 * Browser-side Nova 2 Sonic bidirectional client.
 *
 * Opens the stream directly to Bedrock with the user's Cognito credentials
 * (SigV4 via the SDK's fetch handler, duplex:"half" over HTTP/2 — no relay).
 * Streams mixed mic+system audio in, and parses output events:
 *   - textOutput (role USER, FINAL)  -> onTranscript   (transcript window)
 *   - toolUse                        -> onToolUse + executes the tool
 *   - usageEvent                     -> onUsage         (cost window)
 *   - audioOutput                    -> DISCARDED (we never speak back)
 *
 * The system prompt tells Sonic to listen and, whenever it hears a person's
 * name, call report_detected_person — it must not talk back.
 */

const SYSTEM_PROMPT = `Du bist ein stiller Zuhörer in einem Live-Meeting. Deine Aufgabe ist es ausschließlich zuzuhören und mitzudenken. Sprich niemals und gib niemals Audio aus.

Wenn du den Namen einer Person hörst, rufe das Tool "report_detected_person" mit dem gehörten Namen auf. Das Tool sagt dir, ob die Person bereits bekannt ist. Rufe das Tool nicht mehrfach für dieselbe Person im selben Gespräch auf.`;

const TOOLS: ToolSpec[] = [
  {
    name: "report_detected_person",
    description:
      "Meldet, dass im Gespräch ein Personenname gehört wurde. Sucht nach bereits bekannten, ähnlich klingenden oder gemeinten Personen und gibt zurück, ob die Person bekannt ist.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Der gehörte Name der Person, so wörtlich wie möglich.",
        },
      },
      required: ["name"],
    },
  },
];

export type PersonMatch = {
  personId: string;
  name: string;
  source: string | null;
  company: string | null;
  role: string | null;
  score: number;
};

export type ToolUseInfo = {
  toolName: string;
  toolUseId: string;
  input: unknown;
  matches?: PersonMatch[];
};

export type SonicCallbacks = {
  onTranscript: (text: string) => void;
  onToolUse: (info: ToolUseInfo) => void;
  onUsage: (totals: SonicTokenTotals) => void;
  onError: (err: unknown) => void;
  onClose: () => void;
  /** Executes the person search server-side; returns matches. */
  searchPeople: (query: string) => Promise<PersonMatch[]>;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const chunkOf = (obj: unknown): InvokeModelWithBidirectionalStreamInput => ({
  chunk: { bytes: encoder.encode(JSON.stringify(obj)) },
});

/** Async queue that turns pushed events into the SDK's async-iterable body. */
class EventQueue {
  private queue: InvokeModelWithBidirectionalStreamInput[] = [];
  private resolvers: Array<
    (v: IteratorResult<InvokeModelWithBidirectionalStreamInput>) => void
  > = [];
  private closed = false;

  push(obj: unknown): void {
    if (this.closed) return;
    const value = chunkOf(obj);
    const resolve = this.resolvers.shift();
    if (resolve) resolve({ value, done: false });
    else this.queue.push(value);
  }

  close(): void {
    this.closed = true;
    let resolve = this.resolvers.shift();
    while (resolve) {
      resolve({ value: undefined as never, done: true });
      resolve = this.resolvers.shift();
    }
  }

  async *iterator(): AsyncIterable<InvokeModelWithBidirectionalStreamInput> {
    while (true) {
      if (this.queue.length) {
        yield this.queue.shift() as InvokeModelWithBidirectionalStreamInput;
        continue;
      }
      if (this.closed) return;
      const next = await new Promise<
        IteratorResult<InvokeModelWithBidirectionalStreamInput>
      >((resolve) => this.resolvers.push(resolve));
      if (next.done) return;
      yield next.value;
    }
  }
}

export class SonicClient {
  private readonly cbs: SonicCallbacks;
  private readonly promptName = uuid();
  private readonly audioContentName = uuid();
  private queue = new EventQueue();
  private client: BedrockRuntimeClient | null = null;
  private audioStarted = false;
  private running = false;
  // De-dupe repeated detections of the same name within a session.
  private reportedNames = new Set<string>();

  constructor(cbs: SonicCallbacks) {
    this.cbs = cbs;
  }

  async start(): Promise<void> {
    const { credentials } = await fetchAuthSession();
    if (!credentials) throw new Error("Keine Cognito-Credentials verfügbar.");

    this.client = new BedrockRuntimeClient({
      region: SONIC_REGION,
      credentials,
    });

    // Prime the session before opening the stream so the first events are ready.
    this.queue.push(sessionStartEvent());
    this.queue.push(promptStartEvent(this.promptName, TOOLS));
    const sysContent = uuid();
    this.queue.push(
      textContentStartEvent(this.promptName, sysContent, "SYSTEM")
    );
    this.queue.push(textInputEvent(this.promptName, sysContent, SYSTEM_PROMPT));
    this.queue.push(contentEndEvent(this.promptName, sysContent));
    this.queue.push(
      audioContentStartEvent(this.promptName, this.audioContentName)
    );
    this.audioStarted = true;
    this.running = true;

    const command = new InvokeModelWithBidirectionalStreamCommand({
      modelId: SONIC_MODEL_ID,
      body: this.queue.iterator(),
    });

    // Consume the response stream in the background.
    void this.client
      .send(command)
      .then(async (response) => {
        for await (const item of response.body ?? []) {
          if (!this.running) break;
          if (item.chunk?.bytes) {
            this.handleOutput(decoder.decode(item.chunk.bytes));
          }
        }
        this.cbs.onClose();
      })
      .catch((err) => {
        this.running = false;
        this.cbs.onError(err);
      });
  }

  /** Push a base64 16 kHz PCM frame into the audio stream. */
  sendAudioFrame(base64Pcm: string): void {
    if (!this.running || !this.audioStarted) return;
    this.queue.push(
      audioInputEvent(this.promptName, this.audioContentName, base64Pcm)
    );
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;
    if (this.audioStarted) {
      this.queue.push(contentEndEvent(this.promptName, this.audioContentName));
    }
    this.queue.push(promptEndEvent(this.promptName));
    this.queue.push(sessionEndEvent());
    this.queue.close();
  }

  private handleOutput(raw: string): void {
    let parsed: { event?: Record<string, any> };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    const event = parsed.event;
    if (!event) return;

    if (event.textOutput) {
      // Only surface the FINAL user-side ASR transcript, not the model's
      // (unspoken) planned reply.
      const role = event.textOutput.role;
      const content = event.textOutput.content ?? "";
      if (role === "USER" && content.trim()) this.cbs.onTranscript(content);
      return;
    }

    if (event.toolUse) {
      void this.handleToolUse(event.toolUse);
      return;
    }

    if (event.usageEvent) {
      const total = event.usageEvent.details?.total;
      if (total) {
        this.cbs.onUsage({
          inputSpeechTokens: total.input?.speechTokens ?? 0,
          inputTextTokens: total.input?.textTokens ?? 0,
          outputSpeechTokens: total.output?.speechTokens ?? 0,
          outputTextTokens: total.output?.textTokens ?? 0,
        });
      }
      return;
    }
    // audioOutput and everything else: discarded.
  }

  private async handleToolUse(toolUse: {
    toolName?: string;
    toolUseId?: string;
    content?: string;
  }): Promise<void> {
    const { toolName, toolUseId, content } = toolUse;
    if (!toolName || !toolUseId) return;

    let input: unknown = {};
    try {
      input = content ? JSON.parse(content) : {};
    } catch {
      /* leave input as {} */
    }

    let matches: PersonMatch[] = [];
    let result: unknown = { known: false };

    try {
      if (toolName === "report_detected_person") {
        const name = String((input as { name?: string }).name ?? "").trim();
        const key = name.toLowerCase();
        if (name && !this.reportedNames.has(key)) {
          this.reportedNames.add(key);
          matches = await this.cbs.searchPeople(name);
        }
        const best = matches[0];
        // COSINE score: lower = more similar. Treat a close match as "known".
        const known = !!best && best.score <= 0.35;
        result = known
          ? { known: true, person: best.name, similarity: best.score }
          : { known: false, heardName: name };
      }
    } catch (err) {
      result = { error: err instanceof Error ? err.message : "tool failed" };
    }

    // Always answer a toolUse, or Sonic stalls.
    const toolContent = uuid();
    this.queue.push(
      toolContentStartEvent(this.promptName, toolContent, toolUseId)
    );
    this.queue.push(toolResultEvent(this.promptName, toolContent, result));
    this.queue.push(contentEndEvent(this.promptName, toolContent));

    this.cbs.onToolUse({ toolName, toolUseId, input, matches });
  }
}
