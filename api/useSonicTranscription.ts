import { useCallback, useEffect, useRef, useState } from "react";
import { client } from "@/lib/amplify";
import { toast } from "@/components/ui/use-toast";
import {
  AudioCapture,
  listMicrophones,
  type MicDevice,
} from "@/helpers/sonic/audio-capture";
import {
  SonicClient,
  type PersonMatch,
  type ProjectMatch,
  type ToolUseInfo,
  type ProjectSuggestion,
} from "@/helpers/sonic/client";
import {
  estimateSonicCostUsd,
  type SonicTokenTotals,
} from "@/helpers/sonic/constants";
import type {
  SonicProject,
  SonicParticipant,
} from "@/helpers/sonic/context-prompt";
import {
  buildProjectListContext,
  buildParticipantContext,
  buildProjectAddedContext,
} from "@/helpers/sonic/context-prompt";

/**
 * Orchestrates a live Nova Sonic transcription session for one meeting:
 * audio capture (mic + system) -> Sonic stream -> transcript + tool + usage
 * state, and persists the usage totals onto the Meeting when the session ends.
 *
 * The `report_detected_person` tool is executed server-side via the
 * `searchPeopleByVoice` query (owner enforced in the Lambda) — never a direct
 * browser vector search.
 */

export type TranscriptLine = { id: string; text: string; at: number };

/** Score at/below which the best match is treated as a confident hit. */
export const KNOWN_MATCH_THRESHOLD = 0.35;

/**
 * A person detected during the session. One entry per heard name (deduped).
 * `matches` are the ranked candidates; `selectedPersonId` is the currently
 * chosen one (defaults to the best match); `confirmed` locks it in so the
 * later AI summary may use it.
 */
export type DetectedPerson = {
  id: string;
  heardName: string;
  matches: PersonMatch[];
  selectedPersonId: string | null;
  confirmed: boolean;
  at: number;
};

const emptyTotals: SonicTokenTotals = {
  inputSpeechTokens: 0,
  inputTextTokens: 0,
  outputSpeechTokens: 0,
  outputTextTokens: 0,
};

const safeParse = (s: string): unknown => {
  try {
    return JSON.parse(s);
  } catch {
    return { raw: s };
  }
};

export type SuggestedProject = {
  projectId: string;
  name?: string;
  reason?: string;
  score?: number;
  /** Whether the user has confirmed this project suggestion (gate). */
  confirmed?: boolean;
  at: number;
};

export type MeetingSummary = unknown; // free-form JSON from Sonnet

export type SonicOptions = {
  contextPrompt?: string;
  /** Topic of the bound meeting (for the header link/label). */
  meetingTopic?: string;
  /** Build the open-project list (filtered/sorted) at start/summary time. */
  getOpenProjects?: () => SonicProject[];
  /** Resolve a person id to {name, company, role} for participant context. */
  resolveParticipant?: (personId: string) => SonicParticipant | undefined;
  /** Current participant person ids at start. */
  participantIds?: string[];
};

/**
 * The engine is instantiated ONCE, in the global RecordingProvider, so a
 * recording survives page navigation. The active meeting is not fixed at mount
 * — the meeting page calls `bindMeeting` to attach its id/topic/options, and
 * `activeMeetingId` tracks which meeting the (single) session belongs to.
 */
const useSonicTranscription = () => {
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<string | undefined>(
    undefined
  );
  const [activeMeetingTopic, setActiveMeetingTopic] = useState<
    string | undefined
  >(undefined);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [detectedPeople, setDetectedPeople] = useState<DetectedPerson[]>([]);
  const [suggestedProjects, setSuggestedProjects] = useState<
    SuggestedProject[]
  >([]);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  // The name of the most recently detected person, shown briefly as a discreet
  // transient hint at the marker; self-clears a few seconds after detection.
  const [recentDetectionName, setRecentDetectionName] = useState<string | null>(
    null
  );
  const [totals, setTotals] = useState<SonicTokenTotals>(emptyTotals);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [systemAudioNote, setSystemAudioNote] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mics, setMics] = useState<MicDevice[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string | undefined>(
    undefined
  );

  const captureRef = useRef<AudioCapture | null>(null);
  const clientRef = useRef<SonicClient | null>(null);
  const startedAtRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Clears the transient "name detected" hint a few seconds after it appears.
  const detectionHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const totalsRef = useRef<SonicTokenTotals>(emptyTotals);
  // The meeting the CURRENT session is bound to. Set by `start`; used by all
  // persistence so a page navigation (which rebinds options) can't misroute a
  // running session's writes.
  const recordingMeetingIdRef = useRef<string | undefined>(undefined);
  // Latest transcript + detected people for building the summary payload at
  // stop time (avoids stale closures).
  const transcriptRef = useRef<TranscriptLine[]>([]);
  const detectedRef = useRef<DetectedPerson[]>([]);
  // Latest options + bound meeting id/topic. Updated via `bindMeeting`, NOT a
  // hook argument, because this hook is a single global instance.
  const optionsRef = useRef<SonicOptions>({});
  const boundMeetingIdRef = useRef<string | undefined>(undefined);
  // Keep transcript/detected refs in sync outside of render (lint: no ref
  // writes during render). These feed the summary payload + notifications.
  useEffect(() => {
    transcriptRef.current = transcript;
    detectedRef.current = detectedPeople;
  });

  const searchPeople = useCallback(
    async (query: string): Promise<PersonMatch[]> => {
      const { data, errors } = await client.queries.searchPeopleByVoice({
        query,
        topK: 3,
      });
      if (errors) {
        console.error("searchPeopleByVoice", errors);
        return [];
      }
      return (data ?? []).flatMap((m): PersonMatch[] =>
        m && m.personId && m.name
          ? [
              {
                personId: m.personId,
                name: m.name,
                source: m.source ?? null,
                company: m.company ?? null,
                role: m.role ?? null,
                score: m.score ?? 0,
              },
            ]
          : []
      );
    },
    []
  );

  const searchProjects = useCallback(
    async (query: string): Promise<ProjectMatch[]> => {
      const { data, errors } = await client.queries.suggestProjectByVoice({
        query,
        topK: 3,
      });
      if (errors) {
        console.error("suggestProjectByVoice", errors);
        return [];
      }
      return (data ?? []).flatMap((m): ProjectMatch[] =>
        m && m.projectId && m.name
          ? [
              {
                projectId: m.projectId,
                name: m.name,
                summarySnippet: m.summarySnippet ?? null,
                score: m.score ?? 0,
              },
            ]
          : []
      );
    },
    []
  );

  // Briefly surface a just-detected name at the marker, then self-clear.
  const DETECTION_HINT_MS = 4000;
  const flashDetection = useCallback((name: string) => {
    setRecentDetectionName(name);
    if (detectionHintTimerRef.current)
      clearTimeout(detectionHintTimerRef.current);
    detectionHintTimerRef.current = setTimeout(
      () => setRecentDetectionName(null),
      DETECTION_HINT_MS
    );
  }, []);

  const persistUsage = useCallback(async () => {
    const meetingId = recordingMeetingIdRef.current;
    if (!meetingId) return;
    const t = totalsRef.current;
    const durationSeconds = Math.round(
      (Date.now() - startedAtRef.current) / 1000
    );
    const { errors } = await client.models.Meeting.update({
      id: meetingId,
      sonicSessionCount: 1,
      sonicDurationSeconds: durationSeconds,
      sonicInputSpeechTokens: t.inputSpeechTokens,
      sonicInputTextTokens: t.inputTextTokens,
      sonicOutputSpeechTokens: t.outputSpeechTokens,
      sonicOutputTextTokens: t.outputTextTokens,
      sonicEstimatedCostUsd: estimateSonicCostUsd(t),
      sonicUsageUpdatedAt: new Date().toISOString(),
    });
    if (errors) console.error("persistUsage", errors);
  }, []);

  /**
   * Provisionally persist the live transcript onto the Meeting so it survives
   * navigation / reload and can be re-displayed on return. Stored as the JSON
   * array of transcript lines. Best-effort; failures are logged, not surfaced.
   */
  const persistTranscript = useCallback(async () => {
    const meetingId = recordingMeetingIdRef.current;
    if (!meetingId) return;
    const lines = transcriptRef.current;
    const { errors } = await client.models.Meeting.update({
      id: meetingId,
      sonicTranscript: lines,
      sonicTranscriptUpdatedAt: new Date().toISOString(),
    });
    if (errors) console.error("persistTranscript", errors);
  }, []);

  /** Provisionally persist the generated summary onto the Meeting. */
  const persistSummary = useCallback(async (parsed: MeetingSummary) => {
    const meetingId = recordingMeetingIdRef.current;
    if (!meetingId || parsed == null) return;
    const { errors } = await client.models.Meeting.update({
      id: meetingId,
      sonicSummary: parsed,
    });
    if (errors) console.error("persistSummary", errors);
  }, []);

  /**
   * Build the summary payload from the current transcript + confirmed people +
   * the open-project context, then ask the server-side summarizer (Sonnet).
   */
  const runSummary = useCallback(async () => {
    const lines = transcriptRef.current;
    if (!lines.length) return;
    const transcriptText = lines.map((l) => l.text).join("\n");
    const opts = optionsRef.current;
    const projects = opts.getOpenProjects?.() ?? [];

    // Confirmed detected people → mentioned people {id, name, company, role}.
    const mentioned = detectedRef.current
      .filter((p) => p.confirmed && p.selectedPersonId)
      .map((p) => {
        const m = p.matches.find((mm) => mm.personId === p.selectedPersonId);
        return m
          ? {
              id: m.personId,
              name: m.name,
              company: m.company,
              role: m.role,
            }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => !!x);

    // Participants → {id, name, company, role} via the resolver.
    const participants = (opts.participantIds ?? [])
      .map((id) => opts.resolveParticipant?.(id))
      .filter((x): x is SonicParticipant => !!x)
      .map((p) => ({
        id: p.id,
        name: p.name,
        company: p.company,
        role: p.role,
      }));

    const payload = {
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        company: p.company,
        partner: p.partner,
        summary: p.summary,
      })),
      participants,
      mentionedPeople: mentioned,
      transcript: transcriptText,
    };

    setSummarizing(true);
    try {
      const { data, errors } = await client.queries.summarizeMeeting({
        payload: JSON.stringify(payload),
      });
      if (errors) {
        console.error("summarizeMeeting", errors);
        return;
      }
      // data is AWSJSON — may arrive as string or parsed object.
      const parsed =
        typeof data === "string" ? safeParse(data) : (data ?? null);
      setSummary(parsed);
      // Provisionally persist so it survives navigation/reload.
      void persistSummary(parsed);
    } catch (err) {
      console.error("summarizeMeeting failed", err);
    } finally {
      setSummarizing(false);
    }
  }, [persistSummary]);

  const stop = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    await captureRef.current?.stop().catch(() => undefined);
    await clientRef.current?.stop().catch(() => undefined);
    captureRef.current = null;
    clientRef.current = null;
    setRecording(false);
    setAudioLevel(0);
    await persistUsage();
    // Provisionally persist the transcript, then generate + persist the summary.
    await persistTranscript();
    void runSummary();
  }, [persistUsage, persistTranscript, runSummary]);

  const start = useCallback(async () => {
    if (recording || starting) return;
    const meetingId = boundMeetingIdRef.current;
    if (!meetingId) {
      console.warn("Sonic start called without a bound meeting");
      return;
    }
    setStarting(true);
    // Bind this session to the currently-bound meeting so all persistence
    // routes correctly even if the user navigates and rebinds another meeting.
    recordingMeetingIdRef.current = meetingId;
    setActiveMeetingId(meetingId);
    setActiveMeetingTopic(optionsRef.current.meetingTopic);
    setTranscript([]);
    setDetectedPeople([]);
    setSuggestedProjects([]);
    setSummary(null);
    setRecentDetectionName(null);
    setTotals(emptyTotals);
    totalsRef.current = emptyTotals;
    setElapsedSeconds(0);
    setSystemAudioNote(null);

    // Build the startup context: participants (name/company/role) + the open
    // project list (name/company/partner/goal).
    const opts = optionsRef.current;
    const startupParts: string[] = [];
    const startupParticipants = (opts.participantIds ?? [])
      .map((id) => opts.resolveParticipant?.(id))
      .filter((x): x is SonicParticipant => !!x);
    for (const p of startupParticipants) {
      startupParts.push(buildParticipantContext(p));
    }
    const startupProjects = opts.getOpenProjects?.() ?? [];
    if (startupProjects.length) {
      startupParts.push(buildProjectListContext(startupProjects));
    }
    const startupContext = startupParts.join("\n\n");

    try {
      const sonic = new SonicClient({
        onTranscript: (text) =>
          setTranscript((prev) => [
            ...prev,
            { id: crypto.randomUUID(), text, at: Date.now() },
          ]),
        onToolUse: (info: ToolUseInfo) => {
          const heardName = (
            (info.input as { name?: string })?.name ?? ""
          ).trim();
          if (!heardName) return;
          const matches = info.matches ?? [];
          const best = matches[0];
          // Pre-select the best match ONLY when it's a confident hit; otherwise
          // leave the choice to the user. Either way the name is listed.
          const preselected =
            best && best.score <= KNOWN_MATCH_THRESHOLD ? best.personId : null;

          setDetectedPeople((prev) => {
            // Dedupe by heard name (case-insensitive); don't clobber a person
            // the user already confirmed or already picked a match for.
            const key = heardName.toLowerCase();
            const existing = prev.find(
              (p) => p.heardName.toLowerCase() === key
            );
            if (existing) {
              // Already confirmed → nothing to draw attention to.
              if (existing.confirmed) return prev;
              // Refreshed an unconfirmed detection: flash discreetly again.
              flashDetection(heardName);
              return prev.map((p) =>
                p === existing
                  ? {
                      ...p,
                      matches,
                      // Keep a user's manual pick; otherwise refresh preselect.
                      selectedPersonId: p.selectedPersonId ?? preselected,
                    }
                  : p
              );
            }
            // Brand-new detection → flash the discreet hint.
            flashDetection(heardName);
            return [
              ...prev,
              {
                id: crypto.randomUUID(),
                heardName,
                matches,
                selectedPersonId: preselected,
                confirmed: false,
                at: Date.now(),
              },
            ];
          });
        },
        onUsage: (t) => {
          totalsRef.current = t;
          setTotals(t);
        },
        onError: (err) => {
          console.error("Sonic stream error", err);
          toast({
            title: "Transkription unterbrochen",
            description:
              err instanceof Error ? err.message : "Unbekannter Fehler.",
          });
          void stop();
        },
        onClose: () => setRecording(false),
        searchPeople,
        searchProjects,
        contextPrompt: optionsRef.current.contextPrompt,
        startupContext,
        onProjectSuggested: (s: ProjectSuggestion) => {
          flashDetection(s.name ?? "Projekt");
          setSuggestedProjects((prev) =>
            prev.some((x) => x.projectId === s.projectId)
              ? prev
              : [
                  ...prev,
                  {
                    projectId: s.projectId,
                    name: s.name,
                    reason: s.reason,
                    score: s.score,
                    confirmed: false,
                    at: Date.now(),
                  },
                ]
          );
        },
      });

      const capture = new AudioCapture({
        onFrame: (frame) => sonic.sendAudioFrame(frame),
        onSystemAudioUnavailable: (reason) => setSystemAudioNote(reason),
        onLevel: (level) => setAudioLevel(level),
      });

      await sonic.start();
      await capture.start(selectedMicId);
      // Labels become available after permission is granted — refresh the list.
      void listMicrophones().then(setMics);

      clientRef.current = sonic;
      captureRef.current = capture;
      startedAtRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const secs = Math.round((Date.now() - startedAtRef.current) / 1000);
        setElapsedSeconds(secs);
        // Periodically persist the transcript so a crash / reload / accidental
        // navigation away doesn't lose the running session's transcript.
        if (secs > 0 && secs % 15 === 0) void persistTranscript();
      }, 1000);
      setRecording(true);
    } catch (err) {
      console.error("Failed to start Sonic transcription", err);
      toast({
        title: "Start fehlgeschlagen",
        description:
          err instanceof Error
            ? err.message
            : "Mikrofon-/Audiozugriff nicht möglich.",
      });
      await captureRef.current?.stop().catch(() => undefined);
      await clientRef.current?.stop().catch(() => undefined);
      captureRef.current = null;
      clientRef.current = null;
    } finally {
      setStarting(false);
    }
  }, [
    recording,
    starting,
    searchPeople,
    searchProjects,
    stop,
    selectedMicId,
    flashDetection,
  ]);

  /** Notify Sonic (cross-modal) that a participant was added mid-recording. */
  const notifyParticipantAdded = useCallback((personId: string) => {
    const p = optionsRef.current.resolveParticipant?.(personId);
    if (p && clientRef.current) {
      clientRef.current.sendContext(buildParticipantContext(p));
    }
  }, []);

  /** Notify Sonic (cross-modal) that a project was added, with the rest of its
   * summary. */
  const notifyProjectAdded = useCallback((projectId: string) => {
    const proj = optionsRef.current
      .getOpenProjects?.()
      .find((p) => p.id === projectId);
    if (proj && clientRef.current) {
      clientRef.current.sendContext(buildProjectAddedContext(proj));
    }
  }, []);

  /** Remove a project suggestion (after the user accepts or dismisses it). */
  const dismissSuggestedProject = useCallback((projectId: string) => {
    setSuggestedProjects((prev) =>
      prev.filter((p) => p.projectId !== projectId)
    );
  }, []);

  /** Load available microphones (for the settings popover). */
  const loadMics = useCallback(async () => {
    try {
      setMics(await listMicrophones());
    } catch (err) {
      console.error("listMicrophones", err);
    }
  }, []);

  /** Toggle the lock-in for a detected person. */
  const toggleConfirm = useCallback((detectedId: string) => {
    setDetectedPeople((prev) =>
      prev.map((p) =>
        p.id === detectedId ? { ...p, confirmed: !p.confirmed } : p
      )
    );
  }, []);

  /** Pick a different candidate for a detected person (from the alternatives). */
  const selectMatch = useCallback((detectedId: string, personId: string) => {
    setDetectedPeople((prev) =>
      prev.map((p) =>
        p.id === detectedId ? { ...p, selectedPersonId: personId } : p
      )
    );
  }, []);

  /**
   * Attach a meeting to the (single, global) engine. Called by the meeting
   * page on mount / when its data changes. Always refreshes the live options
   * (context prompt, project/participant resolvers) so a running session picks
   * up newer data. When NOT recording, it also rehydrates the transcript +
   * summary from the meeting record so returning to the page shows the last
   * session's results.
   */
  const bindMeeting = useCallback(
    (
      meetingId: string,
      options: SonicOptions,
      persisted?: {
        transcript?: TranscriptLine[];
        summary?: MeetingSummary;
      }
    ) => {
      boundMeetingIdRef.current = meetingId;
      optionsRef.current = options;
      // Don't disturb a live session; only rehydrate when idle.
      if (recording || starting) return;
      // If this meeting is the one we already have results for in memory, keep
      // them; otherwise load whatever was persisted (possibly nothing).
      if (activeMeetingId !== meetingId) {
        setActiveMeetingId(meetingId);
        setActiveMeetingTopic(options.meetingTopic);
        setTranscript(persisted?.transcript ?? []);
        setSummary(persisted?.summary ?? null);
        setDetectedPeople([]);
        setSuggestedProjects([]);
        setRecentDetectionName(null);
      }
    },
    [recording, starting, activeMeetingId]
  );

  // Stop the streams if the whole app unmounts (provider teardown). This is the
  // safety net that was missing when the engine lived in the page component.
  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (detectionHintTimerRef.current)
        clearTimeout(detectionHintTimerRef.current);
      void captureRef.current?.stop().catch(() => undefined);
      void clientRef.current?.stop().catch(() => undefined);
    },
    []
  );

  const unconfirmedCount = detectedPeople.filter((p) => !p.confirmed).length;

  return {
    recording,
    starting,
    activeMeetingId,
    activeMeetingTopic,
    transcript,
    detectedPeople,
    unconfirmedCount,
    recentDetectionName,
    suggestedProjects,
    summary,
    summarizing,
    totals,
    estimatedCostUsd: estimateSonicCostUsd(totals),
    elapsedSeconds,
    systemAudioNote,
    audioLevel,
    mics,
    selectedMicId,
    setSelectedMicId,
    loadMics,
    toggleConfirm,
    selectMatch,
    notifyParticipantAdded,
    notifyProjectAdded,
    dismissSuggestedProject,
    bindMeeting,
    start,
    stop,
  };
};

export default useSonicTranscription;
