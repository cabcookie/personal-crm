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
import { sanitizeSonicText } from "@/helpers/sonic/sanitize-text";
import {
  mutateSonicDetections,
  emptyDetections,
  type PersistedDetections,
} from "@/helpers/sonic/detections-store";
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
import { normalize } from "@/helpers/functional";

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
 * How many candidates the per-name voice search returns. Higher than the ~3
 * we display, so that for an ambiguous heard name ("Mark") the actually-meant
 * person is still somewhere in the candidate field and can be corroborated by
 * a second mention ("the online boss at ALDI") — see the merge logic in
 * onToolUse. The server over-fetches anyway, so a larger topK is cheap.
 */
export const PERSON_SEARCH_TOP_K = 8;

/**
 * Looser COSINE threshold (vs KNOWN_MATCH_THRESHOLD) for MERGING two detected
 * names into one person: if a candidate person appears in BOTH detections'
 * candidate lists at/below this score, the two heard names are very likely the
 * same person, so we merge rather than list twice — and the corroboration
 * boosts that person's rank. Kept above the preselect threshold because a
 * single detection at 0.4-0.5 isn't confident on its own, but agreement across
 * two independent mentions is.
 */
export const MERGE_SCORE_THRESHOLD = 0.5;

/**
 * A person detected during the session. Normally one entry per heard name,
 * but when two different heard names corroborate the SAME candidate person
 * (see MERGE_SCORE_THRESHOLD) they're merged into one entry: `heardName` keeps
 * the first, `alsoHeardAs` collects the others. `matches` are the ranked
 * candidates (merged + re-ranked across mentions); `selectedPersonId` is the
 * currently chosen one (defaults to the best match); `confirmed` locks it in
 * so the later AI summary may use it.
 */
export type DetectedPerson = {
  id: string;
  heardName: string;
  /** Other heard names merged into this entry because they matched the same
   * person (optional; absent/empty when the entry wasn't merged). */
  alsoHeardAs?: string[];
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

export type SuggestedProject = {
  projectId: string;
  name?: string;
  company?: string | null;
  reason?: string;
  score?: number;
  /** Whether the user has confirmed this project suggestion (gate). */
  confirmed?: boolean;
  at: number;
};

export type MeetingSummary = unknown; // free-form JSON from Sonnet

/**
 * Merge a newly-arrived candidate list into an existing person entry's
 * candidates, combining by personId: keep the best (lowest) COSINE score seen
 * for each person, and apply a small corroboration bonus to any person that
 * appears in BOTH lists (an agreement across two mentions is stronger evidence
 * than either single score). Returns the candidates re-ranked by effective
 * score (best first).
 */
const CORROBORATION_BONUS = 0.1;

const mergeMatchLists = (
  existing: PersonMatch[],
  incoming: PersonMatch[]
): PersonMatch[] => {
  const byId = new Map<string, PersonMatch>();
  for (const m of existing) byId.set(m.personId, { ...m });
  for (const m of incoming) {
    const prev = byId.get(m.personId);
    if (!prev) {
      byId.set(m.personId, { ...m });
    } else {
      // Seen in both → keep the better score AND subtract a corroboration
      // bonus (clamped at 0) so a person both mentions point at ranks first.
      const better = Math.min(prev.score, m.score);
      byId.set(m.personId, {
        ...prev,
        score: Math.max(0, better - CORROBORATION_BONUS),
        // Prefer whichever record carries company/role info.
        company: prev.company ?? m.company,
        role: prev.role ?? m.role,
      });
    }
  }
  return [...byId.values()].sort((a, b) => a.score - b.score);
};

/**
 * The best (lowest) candidate score for a detected person, used to sort the
 * list so the most confident detections surface first. Entries with no
 * candidates sort last.
 */
const bestScore = (p: DetectedPerson): number =>
  p.matches.length ? Math.min(...p.matches.map((m) => m.score)) : Infinity;

/**
 * Sort detected people by confidence: most confident (lowest best candidate
 * score) first, unmatched entries last. Confirmed entries are kept pinned to
 * the top so a resolved person doesn't jump around as new detections arrive.
 */
const sortPeople = (people: DetectedPerson[]): DetectedPerson[] =>
  [...people].sort((a, b) => {
    if (a.confirmed !== b.confirmed) return a.confirmed ? -1 : 1;
    return bestScore(a) - bestScore(b);
  });

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
  const suggestedProjectsRef = useRef<SuggestedProject[]>([]);
  // Latest options + bound meeting id/topic. Updated via `bindMeeting`, NOT a
  // hook argument, because this hook is a single global instance.
  const optionsRef = useRef<SonicOptions>({});
  const boundMeetingIdRef = useRef<string | undefined>(undefined);
  // Keep transcript/detected refs in sync outside of render (lint: no ref
  // writes during render). These feed the summary payload + notifications.
  useEffect(() => {
    suggestedProjectsRef.current = suggestedProjects;
    transcriptRef.current = transcript;
    detectedRef.current = detectedPeople;
  });

  /**
   * The single mutation point for detectedPeople/suggestedProjects. Every
   * caller — a Sonic tool-call result, or a user action (confirm, reject,
   * select a match, dismiss) — goes through here instead of calling
   * setDetectedPeople/setSuggestedProjects directly, so every change is also
   * queued onto Meeting.sonicDetections (see helpers/sonic/detections-store),
   * which serializes concurrent writes with a read-modify-write and survives
   * reload/tab-close. React state is then set from the WRITE'S OWN authoritative
   * result (not from the locally-computed `next`), so two racing updates can
   * never leave local state and the server disagreeing about the outcome.
   */
  const mutateDetections = useCallback(
    (updater: (current: PersistedDetections) => PersistedDetections): void => {
      const meetingId =
        recordingMeetingIdRef.current ?? boundMeetingIdRef.current;
      if (!meetingId) {
        // No bound meeting yet (shouldn't normally happen — bindMeeting runs
        // before start) — still apply locally so the UI doesn't silently drop
        // the update, just without persistence.
        const next = updater({
          people: detectedRef.current,
          projects: suggestedProjectsRef.current,
        });
        setDetectedPeople(next.people);
        setSuggestedProjects(next.projects);
        return;
      }
      void mutateSonicDetections(meetingId, updater).then((written) => {
        // Only apply if this meeting is still the one bound/active — a rebind
        // to a different meeting in the meantime shouldn't apply a stale
        // write's result onto the new meeting's state.
        if (
          recordingMeetingIdRef.current !== meetingId &&
          boundMeetingIdRef.current !== meetingId
        ) {
          return;
        }
        setDetectedPeople(written.people);
        setSuggestedProjects(written.projects);
      });
    },
    []
  );

  const searchPeople = useCallback(
    async (query: string): Promise<PersonMatch[]> => {
      const { data, errors } = await client.queries.searchPeopleByVoice({
        query,
        topK: PERSON_SEARCH_TOP_K,
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
                company: m.company ?? null,
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
    // Defence in depth: sanitize again right before sending, in case a lone
    // surrogate slipped in some other way (see sanitizeSonicText for why this
    // matters — an ill-formed string here makes AppSync reject the whole
    // mutation as "Variable 'sonicTranscript' has an invalid value").
    const lines = transcriptRef.current.map((l) => ({
      ...l,
      text: sanitizeSonicText(l.text),
    }));
    const { errors } = await client.models.Meeting.update({
      id: meetingId,
      // a.json() must be sent as a JSON *string* (see requestSummary comment);
      // mapMeeting/parseJson and the Lambda both read back either form.
      sonicTranscript: JSON.stringify(lines),
      sonicTranscriptUpdatedAt: new Date().toISOString(),
    });
    if (errors) console.error("persistTranscript", errors);
  }, []);

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
    // Provisionally persist the transcript now. The summary is NOT triggered
    // here — it's a separate, explicit action (see requestSummary) so the
    // user can first assign/confirm detected people and add project topics
    // at their own pace.
    await persistTranscript();
  }, [persistUsage, persistTranscript]);

  /**
   * Explicitly request a summary run for the given meeting: sets
   * `sonicSummaryStatus` to "PENDING" (plus the confirmed detected people not
   * already formal participants, as `sonicMentionedPersonIds`), which a
   * DynamoDB stream on the Meeting table picks up to invoke the server-side
   * `summarize-meeting` Lambda. The Lambda resolves topics/participants
   * itself (direct DynamoDB reads) and writes the result back — this hook
   * never sees the summary payload or result directly; the caller is
   * notified via the Meeting subscription (see
   * contexts/MeetingSummaryContext.tsx).
   */
  const requestSummary = useCallback(async (meetingId: string) => {
    const mentionedPersonIds = detectedRef.current
      .filter((p) => p.confirmed && p.selectedPersonId)
      .map((p) => p.selectedPersonId as string);
    const { errors } = await client.models.Meeting.update({
      id: meetingId,
      sonicSummaryStatus: "PENDING",
      sonicSummaryError: undefined,
      // a.json() fields must be sent as a JSON *string*, not a raw JS value:
      // the Amplify client declares the GraphQL variable as `String` (AWSJSON)
      // but does NOT stringify the value itself, so handing it a raw array
      // makes AppSync reject the whole mutation ("Variable
      // 'sonicMentionedPersonIds' has an invalid value"). Omit the field
      // entirely when there's nothing to send rather than sending "[]".
      ...(mentionedPersonIds.length
        ? { sonicMentionedPersonIds: JSON.stringify(mentionedPersonIds) }
        : {}),
    });
    if (errors) console.error("requestSummary", errors);
  }, []);

  /**
   * True when the heard name matches a CURRENT meeting participant — those
   * people are already in the meeting, so Sonic reporting them as freshly
   * "detected" is just noise and should be suppressed. Matches token-wise and
   * normalized (case/diacritics/punctuation-insensitive): a heard first name
   * ("Matt") matches a participant "Matthias Müller", and vice versa.
   */
  const isCurrentParticipantName = useCallback((heardName: string): boolean => {
    const heard = normalize(heardName);
    if (!heard) return false;
    const opts = optionsRef.current;
    const names = (opts.participantIds ?? [])
      .map((id) => opts.resolveParticipant?.(id)?.name)
      .filter((n): n is string => !!n);
    for (const full of names) {
      const tokens = full
        .split(/\s+/)
        .map((t) => normalize(t))
        .filter((t) => t.length >= 3);
      // Match on the full normalized name or any significant name token.
      if (normalize(full) === heard) return true;
      if (tokens.some((t) => t === heard)) return true;
    }
    return false;
  }, []);

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
    setSummary(null);
    setRecentDetectionName(null);
    setTotals(emptyTotals);
    totalsRef.current = emptyTotals;
    setElapsedSeconds(0);
    setSystemAudioNote(null);
    // Clear any detections carried over from a PREVIOUS recording of this
    // meeting, both locally and on the server, so a fresh recording starts
    // clean. (If this is the meeting's first recording, this is a no-op —
    // the field is already empty.)
    mutateDetections(() => emptyDetections);

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
            {
              id: crypto.randomUUID(),
              text: sanitizeSonicText(text),
              at: Date.now(),
            },
          ]),
        onToolUse: (info: ToolUseInfo) => {
          // onToolUse fires for BOTH tools; project suggestions are handled by
          // onProjectSuggested. Only person detections build the people list.
          if (info.toolName !== "report_detected_person") return;
          const heardName = (
            (info.input as { name?: string })?.name ?? ""
          ).trim();
          if (!heardName) return;
          // Skip people already in the meeting: the current participants are
          // known, so reporting them as freshly "detected" is just noise.
          if (isCurrentParticipantName(heardName)) return;
          const matches = info.matches ?? [];
          const best = matches[0];
          // Pre-select the best match ONLY when it's a confident hit; otherwise
          // leave the choice to the user. Either way the name is listed.
          const preselected =
            best && best.score <= KNOWN_MATCH_THRESHOLD ? best.personId : null;

          mutateDetections((current) => {
            const key = heardName.toLowerCase();

            // 1) Same heard name again → refresh that entry (don't clobber a
            //    confirmed one or the user's manual pick).
            const sameName = current.people.find(
              (p) => p.heardName.toLowerCase() === key
            );
            if (sameName) {
              if (sameName.confirmed) return current;
              flashDetection(heardName);
              return {
                ...current,
                people: sortPeople(
                  current.people.map((p) =>
                    p === sameName
                      ? {
                          ...p,
                          matches: mergeMatchLists(p.matches, matches),
                          selectedPersonId: p.selectedPersonId ?? preselected,
                        }
                      : p
                  )
                ),
              };
            }

            // 2) Different heard name, but it corroborates the SAME person as
            //    an existing (unconfirmed) detection: a candidate shared by
            //    both lists at/below MERGE_SCORE_THRESHOLD. Merge rather than
            //    list twice — "Mark" + "the online boss at ALDI" become one
            //    entry whose shared candidate is boosted up the ranking.
            const incomingClose = new Set(
              matches
                .filter((m) => m.score <= MERGE_SCORE_THRESHOLD)
                .map((m) => m.personId)
            );
            const mergeTarget = current.people.find(
              (p) =>
                !p.confirmed &&
                p.matches.some(
                  (m) =>
                    m.score <= MERGE_SCORE_THRESHOLD &&
                    incomingClose.has(m.personId)
                )
            );
            if (mergeTarget) {
              flashDetection(heardName);
              const mergedMatches = mergeMatchLists(
                mergeTarget.matches,
                matches
              );
              return {
                ...current,
                people: sortPeople(
                  current.people.map((p) =>
                    p === mergeTarget
                      ? {
                          ...p,
                          alsoHeardAs: [...(p.alsoHeardAs ?? []), heardName],
                          matches: mergedMatches,
                          // If the user hadn't picked yet, preselect the new
                          // top (corroborated) candidate when it's confident.
                          selectedPersonId:
                            p.selectedPersonId ??
                            (mergedMatches[0] &&
                            mergedMatches[0].score <= KNOWN_MATCH_THRESHOLD
                              ? mergedMatches[0].personId
                              : null),
                        }
                      : p
                  )
                ),
              };
            }

            // 3) Brand-new detection.
            flashDetection(heardName);
            return {
              ...current,
              people: sortPeople([
                ...current.people,
                {
                  id: crypto.randomUUID(),
                  heardName,
                  matches,
                  selectedPersonId: preselected,
                  confirmed: false,
                  at: Date.now(),
                },
              ]),
            };
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
          mutateDetections((current) =>
            current.projects.some((x) => x.projectId === s.projectId)
              ? current
              : {
                  ...current,
                  projects: [
                    ...current.projects,
                    {
                      projectId: s.projectId,
                      name: s.name,
                      company: s.company,
                      reason: s.reason,
                      score: s.score,
                      confirmed: false,
                      at: Date.now(),
                    },
                  ],
                }
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
    persistTranscript,
    isCurrentParticipantName,
    mutateDetections,
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
  const dismissSuggestedProject = useCallback(
    (projectId: string) => {
      mutateDetections((current) => ({
        ...current,
        projects: current.projects.filter((p) => p.projectId !== projectId),
      }));
    },
    [mutateDetections]
  );

  /** Load available microphones (for the settings popover). */
  const loadMics = useCallback(async () => {
    try {
      setMics(await listMicrophones());
    } catch (err) {
      console.error("listMicrophones", err);
    }
  }, []);

  /** Toggle the lock-in for a detected person. */
  const toggleConfirm = useCallback(
    (detectedId: string) => {
      mutateDetections((current) => ({
        ...current,
        people: current.people.map((p) =>
          p.id === detectedId ? { ...p, confirmed: !p.confirmed } : p
        ),
      }));
    },
    [mutateDetections]
  );

  /**
   * Pick a candidate for a detected person. Selecting a match ALSO confirms the
   * mention (the user's explicit choice is the acknowledgement — no extra
   * click needed).
   */
  const selectMatch = useCallback(
    (detectedId: string, personId: string) => {
      mutateDetections((current) => ({
        ...current,
        people: current.people.map((p) =>
          p.id === detectedId
            ? { ...p, selectedPersonId: personId, confirmed: true }
            : p
        ),
      }));
    },
    [mutateDetections]
  );

  /** Reject/remove a detected person (from the confirmation gate). */
  const rejectDetectedPerson = useCallback(
    (detectedId: string) => {
      mutateDetections((current) => ({
        ...current,
        people: current.people.filter((p) => p.id !== detectedId),
      }));
    },
    [mutateDetections]
  );

  /**
   * Assign a freshly created person to a detection and confirm it. Used by the
   * "create new person" flow: the caller creates the Person (+ PersonAccount)
   * and passes the new id + display fields; we inject it as a match, select it,
   * and mark the detection confirmed.
   */
  const assignCreatedPerson = useCallback(
    (
      detectedId: string,
      person: {
        personId: string;
        name: string;
        company: string | null;
        role: string | null;
      }
    ) => {
      mutateDetections((current) => ({
        ...current,
        people: current.people.map((p) =>
          p.id === detectedId
            ? {
                ...p,
                matches: [
                  {
                    personId: person.personId,
                    name: person.name,
                    source: null,
                    company: person.company,
                    role: person.role,
                    score: 0,
                  },
                  ...p.matches,
                ],
                selectedPersonId: person.personId,
                confirmed: true,
              }
            : p
        ),
      }));
    },
    [mutateDetections]
  );

  /** Toggle acceptance of a suggested project (from the gate / pills). */
  const toggleConfirmProject = useCallback(
    (projectId: string) => {
      mutateDetections((current) => ({
        ...current,
        projects: current.projects.map((p) =>
          p.projectId === projectId ? { ...p, confirmed: !p.confirmed } : p
        ),
      }));
    },
    [mutateDetections]
  );

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
        detections?: PersistedDetections;
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
        setDetectedPeople(persisted?.detections?.people ?? []);
        setSuggestedProjects(persisted?.detections?.projects ?? []);
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
    rejectDetectedPerson,
    assignCreatedPerson,
    toggleConfirmProject,
    notifyParticipantAdded,
    notifyProjectAdded,
    dismissSuggestedProject,
    bindMeeting,
    start,
    stop,
    requestSummary,
  };
};

export default useSonicTranscription;
