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

Melde eine Person NUR, wenn im Gespräch tatsächlich über eine konkrete, benannte Person gesprochen wird, die für das Meeting relevant ist (z. B. ein neuer Kontakt, eine erwähnte Ansprechperson). Rufe dann das Tool "report_detected_person" auf. Sei zurückhaltend: Melde NICHT die Teilnehmer dieses Meetings (sie sind dir als Kontext bereits bekannt), keine beiläufig genannten Namen ohne Bezug, keine allgemeinen Anreden und keine Personen, die nur grüßen oder sich vorstellen, ohne dass es um sie geht. Rufe das Tool nicht mehrfach für dieselbe Person im selben Gespräch auf. Im Zweifel: nicht melden.

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

/**
 * Nova 2 Sonic closes every bidirectional stream after a hard 8-minute
 * connection limit. To keep a meeting recording running longer we renew the
 * connection before that limit: open a fresh stream, prime it with the same
 * system prompt + context, switch audio frames over to it, then close the old
 * one — seamless for the user. Renew a minute early to leave headroom.
 */
const SESSION_RENEW_MS = 7 * 60 * 1000;

/** One bidirectional stream to Sonic. A SonicClient owns a chain of these. */
type Session = {
  id: number;
  promptName: string;
  audioContentName: string;
  queue: EventQueue;
  client: BedrockRuntimeClient;
  audioStarted: boolean;
  /** Set once we've torn this session down (renewal or stop) so its consumer
   * loop ending doesn't fire onClose. */
  superseded: boolean;
  /** Latest cumulative usage reported by THIS session (resets per stream). */
  lastUsage: SonicTokenTotals;
};

const zeroTotals: SonicTokenTotals = {
  inputSpeechTokens: 0,
  inputTextTokens: 0,
  outputSpeechTokens: 0,
  outputTextTokens: 0,
};

const addTotals = (
  a: SonicTokenTotals,
  b: SonicTokenTotals
): SonicTokenTotals => ({
  inputSpeechTokens: a.inputSpeechTokens + b.inputSpeechTokens,
  inputTextTokens: a.inputTextTokens + b.inputTextTokens,
  outputSpeechTokens: a.outputSpeechTokens + b.outputSpeechTokens,
  outputTextTokens: a.outputTextTokens + b.outputTextTokens,
});

export class SonicClient {
  private readonly cbs: SonicCallbacks;
  private credentials:
    Awaited<ReturnType<typeof fetchAuthSession>>["credentials"] | null = null;
  // The stream currently receiving audio. Replaced on renewal.
  private current: Session | null = null;
  private running = false;
  private sessionSeq = 0;
  private renewTimer: ReturnType<typeof setTimeout> | null = null;
  // Summed usage from sessions that have been superseded (renewal). The live
  // total reported to onUsage is this baseline + the current session's usage,
  // because each stream reports usage that resets from zero.
  private finalizedUsage: SonicTokenTotals = zeroTotals;
  // De-dupe repeated detections of the same name — kept on the CLIENT (not the
  // session) so renewal doesn't re-surface everything already detected.
  private reportedNames = new Set<string>();
  // De-dupe repeated project suggestions across the whole recording.
  private suggestedProjects = new Set<string>();
  // De-dupe repeated project searches by heard query.
  private searchedProjectQueries = new Set<string>();

  constructor(cbs: SonicCallbacks) {
    this.cbs = cbs;
  }

  async start(): Promise<void> {
    const { credentials } = await fetchAuthSession();
    if (!credentials) throw new Error("Keine Cognito-Credentials verfügbar.");
    this.credentials = credentials;
    this.running = true;
    this.current = this.openSession();
    this.scheduleRenewal();
  }

  /** Open + prime a new bidirectional stream and start consuming its output. */
  private openSession(): Session {
    const session: Session = {
      id: ++this.sessionSeq,
      promptName: uuid(),
      audioContentName: uuid(),
      queue: new EventQueue(),
      client: new BedrockRuntimeClient({
        region: SONIC_REGION,
        credentials: this.credentials!,
      }),
      audioStarted: false,
      superseded: false,
      lastUsage: zeroTotals,
    };

    // Prime the session before opening the stream so the first events are ready.
    session.queue.push(sessionStartEvent());
    session.queue.push(promptStartEvent(session.promptName, TOOLS));
    const sysContent = uuid();
    const systemPrompt = this.cbs.contextPrompt?.trim()
      ? `${BASE_SYSTEM_PROMPT}\n\n--- Hintergrund zum Nutzer und Kontext dieses Meetings ---\n${this.cbs.contextPrompt.trim()}`
      : BASE_SYSTEM_PROMPT;
    session.queue.push(
      textContentStartEvent(session.promptName, sysContent, "SYSTEM")
    );
    session.queue.push(
      textInputEvent(session.promptName, sysContent, systemPrompt)
    );
    session.queue.push(contentEndEvent(session.promptName, sysContent));

    // Startup context (participants + open projects) as a USER text turn — sent
    // on every (re)new session so a renewed stream keeps the same grounding.
    if (this.cbs.startupContext?.trim()) {
      this.pushContext(session, this.cbs.startupContext.trim());
    }

    session.queue.push(
      audioContentStartEvent(session.promptName, session.audioContentName)
    );
    session.audioStarted = true;

    const command = new InvokeModelWithBidirectionalStreamCommand({
      modelId: SONIC_MODEL_ID,
      body: session.queue.iterator(),
    });

    void session.client
      .send(command)
      .then(async (response) => {
        for await (const item of response.body ?? []) {
          if (!this.running) break;
          if (item.chunk?.bytes) {
            this.handleOutput(session, decoder.decode(item.chunk.bytes));
          }
        }
        // Only the still-current, non-superseded session ending means the
        // whole recording ended. A superseded session (renewal) is expected.
        if (!session.superseded && this.running) this.cbs.onClose();
      })
      .catch((err) => {
        // A superseded session erroring out mid-teardown is not user-facing.
        if (session.superseded) return;
        this.running = false;
        this.cbs.onError(err);
      });

    return session;
  }

  /** Arm the renewal timer for the current session. */
  private scheduleRenewal(): void {
    if (this.renewTimer) clearTimeout(this.renewTimer);
    this.renewTimer = setTimeout(() => void this.renew(), SESSION_RENEW_MS);
  }

  /**
   * Renew the connection before Sonic's 8-min limit: open a new stream, switch
   * audio to it, then gracefully end the old one. Detection/suggestion de-dupe
   * state lives on the client, so nothing is re-emitted after the swap.
   */
  private async renew(): Promise<void> {
    if (!this.running) return;
    const old = this.current;
    const next = this.openSession();
    this.current = next; // audio frames now flow to the new stream
    this.scheduleRenewal();
    // Gracefully close the previous stream (it may still flush a little output;
    // handleOutput dedupes, so that's harmless).
    if (old) {
      old.superseded = true;
      // Fold the old stream's usage into the baseline so the running total
      // carries across the swap (each stream's usageEvent resets from zero).
      this.finalizedUsage = addTotals(this.finalizedUsage, old.lastUsage);
      this.endSession(old);
    }
  }

  /** Push the closing event sequence + close the queue for one session. */
  private endSession(session: Session): void {
    if (session.audioStarted) {
      session.queue.push(
        contentEndEvent(session.promptName, session.audioContentName)
      );
    }
    session.queue.push(promptEndEvent(session.promptName));
    session.queue.push(sessionEndEvent());
    session.queue.close();
  }

  /** Push a cross-modal USER text turn onto a specific session. */
  private pushContext(session: Session, text: string): void {
    const contentName = uuid();
    session.queue.push(
      textContentStartEvent(session.promptName, contentName, "USER", true)
    );
    session.queue.push(textInputEvent(session.promptName, contentName, text));
    session.queue.push(contentEndEvent(session.promptName, contentName));
  }

  /** Push a base64 16 kHz PCM frame into the current audio stream. */
  sendAudioFrame(base64Pcm: string): void {
    const s = this.current;
    if (!this.running || !s || !s.audioStarted) return;
    s.queue.push(audioInputEvent(s.promptName, s.audioContentName, base64Pcm));
  }

  /**
   * Send a cross-modal USER text turn to the running model (e.g. "participant
   * added", "project added"). Targets the current session.
   */
  sendContext(text: string): void {
    if (!text.trim() || !this.current) return;
    this.pushContext(this.current, text.trim());
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;
    if (this.renewTimer) {
      clearTimeout(this.renewTimer);
      this.renewTimer = null;
    }
    if (this.current) {
      this.endSession(this.current);
      this.current = null;
    }
  }

  private handleOutput(session: Session, raw: string): void {
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
      void this.handleToolUse(session, event.toolUse);
      return;
    }

    if (event.usageEvent) {
      const total = event.usageEvent.details?.total;
      if (total) {
        session.lastUsage = {
          inputSpeechTokens: total.input?.speechTokens ?? 0,
          inputTextTokens: total.input?.textTokens ?? 0,
          outputSpeechTokens: total.output?.speechTokens ?? 0,
          outputTextTokens: total.output?.textTokens ?? 0,
        };
        // Report the running total across all sessions of this recording.
        this.cbs.onUsage(addTotals(this.finalizedUsage, session.lastUsage));
      }
      return;
    }
    // audioOutput and everything else: discarded.
  }

  private async handleToolUse(
    session: Session,
    toolUse: {
      toolName?: string;
      toolUseId?: string;
      content?: string;
    }
  ): Promise<void> {
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

    // Always answer a toolUse, or Sonic stalls — on the SAME session that
    // issued it (a renewal may have swapped `current` while we awaited the
    // search). If that session's queue is already closed (superseded + torn
    // down), the push is a no-op.
    const toolContent = uuid();
    session.queue.push(
      toolContentStartEvent(session.promptName, toolContent, toolUseId)
    );
    session.queue.push(
      toolResultEvent(session.promptName, toolContent, result)
    );
    session.queue.push(contentEndEvent(session.promptName, toolContent));

    this.cbs.onToolUse({ toolName, toolUseId, input, matches });
  }
}
