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

/** COSINE score at/below which a project vector match is treated as confident. */
const KNOWN_PROJECT_THRESHOLD = 0.5;

const BASE_SYSTEM_PROMPT = `Du bist ein stiller Zuhörer in einem Live-Meeting. Deine Aufgabe ist es ausschließlich zuzuhören und mitzudenken. Sprich niemals und gib niemals Audio aus.

Wenn du den Namen einer Person hörst, rufe das Tool "report_detected_person" auf. Das Tool sucht semantisch nach bereits bekannten Personen und sagt dir, ob die Person bekannt ist. Rufe das Tool nicht mehrfach für dieselbe Person im selben Gespräch auf.

Wichtig für die Suche: Übergib nicht nur den blanken Namen, sondern reichere die Suchanfrage mit Rolle und/oder Unternehmen an, WENN sich diese aus dem Gesprächskontext ergeben. Beispiel: Wird gesagt „Nächste Woche treffen wir den Managing Director von ALDI. … Er heißt Markus.", dann suche nach „Markus ALDI Managing Director". Ergibt sich kein Kontext, übergib nur den Namen.

Wenn das Gespräch klar um ein bestimmtes Projekt oder Vorhaben geht (z. B. ein konkretes Kundenprojekt, ein Deal, eine Initiative), rufe das Tool "suggest_project" auf. Übergib als "query" worum es geht — Projektname, Kunde/Partner, Ziel oder Thema, so wie es sich aus dem Gespräch ergibt. Das Tool sucht serverseitig nach dem gemeinten Projekt. Rufe es nicht mehrfach für dasselbe Projekt im selben Gespräch auf. Die verfügbaren offenen Projekte sind dir als Kontext genannt; nutze sie zur Formulierung der Suchanfrage, aber die Zuordnung übernimmt der Server.`;

const TOOLS: ToolSpec[] = [
  {
    name: "report_detected_person",
    description:
      "Meldet, dass im Gespräch ein Personenname gehört wurde, und sucht semantisch nach bereits bekannten oder gemeinten Personen. Gibt zurück, ob die Person bekannt ist.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Suchanfrage fuer die Person: der gehoerte Name, angereichert mit Rolle und/oder Unternehmen, sofern sich diese aus dem Gespraechskontext ergeben (z. B. 'Markus ALDI Managing Director'). Sonst nur der Name.",
        },
        name: {
          type: "string",
          description:
            "Der reine gehörte Name der Person (ohne Rolle/Unternehmen), so wörtlich wie möglich — für die Anzeige.",
        },
      },
      required: ["query", "name"],
    },
  },
  {
    name: "suggest_project",
    description:
      "Meldet, dass das Gespräch klar um ein bestimmtes Projekt/Vorhaben geht, und sucht semantisch nach dem gemeinten Projekt. Das Tool durchsucht serverseitig die Projekte des Nutzers und gibt die besten Treffer zurück. Rufe es auf, sobald ein Projektbezug erkennbar ist; nicht mehrfach für dasselbe Projekt im selben Gespräch.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Suchanfrage für das Projekt: worum es im Gespräch geht — Projektname, Kunde/Partner, Ziel oder Thema, so wie es sich aus dem Kontext ergibt (z. B. 'Marketplace Deal mit ALDI' oder 'EBC Organisation ALDI').",
        },
        name: {
          type: "string",
          description:
            "Kurzer, sprechender Titel des gemeinten Projekts für die Anzeige (falls im Gespräch genannt), sonst weglassen.",
        },
      },
      required: ["query"],
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

export type ProjectMatch = {
  projectId: string;
  name: string;
  summarySnippet: string | null;
  score: number;
};

export type ProjectSuggestion = {
  projectId: string;
  name?: string;
  reason?: string;
  score?: number;
};

export type SonicCallbacks = {
  onTranscript: (text: string) => void;
  onToolUse: (info: ToolUseInfo) => void;
  onUsage: (totals: SonicTokenTotals) => void;
  onError: (err: unknown) => void;
  onClose: () => void;
  /** Executes the person search server-side; returns matches. */
  searchPeople: (query: string) => Promise<PersonMatch[]>;
  /** Executes the project search server-side; returns matches. */
  searchProjects: (query: string) => Promise<ProjectMatch[]>;
  /** Sonic suggests adding a known project to the meeting. */
  onProjectSuggested?: (suggestion: ProjectSuggestion) => void;
  /**
   * Startup context (participants + open-project list) sent as a USER text
   * turn right after the system prompt, before audio streaming begins.
   */
  startupContext?: string;
  /**
   * Optional user/context background (who the user is, what they do in this
   * meeting's context, their goals) appended to the system prompt so the model
   * has grounding for person/role detection.
   */
  contextPrompt?: string;
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
  // De-dupe repeated project suggestions within a session (by resolved id).
  private suggestedProjects = new Set<string>();
  // De-dupe repeated project searches by heard query (avoids re-searching the
  // same phrasing).
  private searchedProjectQueries = new Set<string>();

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
    const systemPrompt = this.cbs.contextPrompt?.trim()
      ? `${BASE_SYSTEM_PROMPT}\n\n--- Hintergrund zum Nutzer und Kontext dieses Meetings ---\n${this.cbs.contextPrompt.trim()}`
      : BASE_SYSTEM_PROMPT;
    this.queue.push(
      textContentStartEvent(this.promptName, sysContent, "SYSTEM")
    );
    this.queue.push(textInputEvent(this.promptName, sysContent, systemPrompt));
    this.queue.push(contentEndEvent(this.promptName, sysContent));

    // Startup context (participants + open projects) as a USER text turn.
    if (this.cbs.startupContext?.trim()) {
      this.sendContext(this.cbs.startupContext.trim());
    }

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

  /**
   * Send a cross-modal USER text turn to the running model (e.g. "participant
   * added", "project added"). Interactive text alongside the audio stream, so
   * the model gains context mid-conversation. Safe to call before audio starts
   * (startup context) and while streaming.
   */
  sendContext(text: string): void {
    if (!text.trim()) return;
    // Once the queue is closed (after stop) we can't send anything.
    const contentName = uuid();
    this.queue.push(
      textContentStartEvent(this.promptName, contentName, "USER", true)
    );
    this.queue.push(textInputEvent(this.promptName, contentName, text));
    this.queue.push(contentEndEvent(this.promptName, contentName));
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
    let result: unknown = { ok: true };

    try {
      if (toolName === "report_detected_person") {
        const typed = input as { name?: string; query?: string };
        const name = String(typed.name ?? "").trim();
        // Search with the context-enriched query when provided, else the name.
        const query = String(typed.query ?? name).trim();
        const key = name.toLowerCase();
        if (query && name && !this.reportedNames.has(key)) {
          this.reportedNames.add(key);
          matches = await this.cbs.searchPeople(query);
        }
        const best = matches[0];
        // COSINE score: lower = more similar. Treat a close match as "known".
        const known = !!best && best.score <= 0.35;
        result = known
          ? { known: true, person: best.name, similarity: best.score }
          : { known: false, heardName: name };
      } else if (toolName === "suggest_project") {
        const typed = input as { query?: string; name?: string };
        const query = String(typed.query ?? typed.name ?? "").trim();
        const key = query.toLowerCase();
        let projectMatches: ProjectMatch[] = [];
        if (query && !this.searchedProjectQueries.has(key)) {
          this.searchedProjectQueries.add(key);
          projectMatches = await this.cbs.searchProjects(query);
        }
        // COSINE score: lower = more similar. Only surface a confident hit,
        // and only once per resolved project.
        const best = projectMatches[0];
        const confident = !!best && best.score <= KNOWN_PROJECT_THRESHOLD;
        if (confident && !this.suggestedProjects.has(best.projectId)) {
          this.suggestedProjects.add(best.projectId);
          this.cbs.onProjectSuggested?.({
            projectId: best.projectId,
            name: best.name,
            reason: typed.name || query,
            score: best.score,
          });
        }
        result = best
          ? { known: confident, project: best.name, similarity: best.score }
          : { known: false, heard: query };
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
