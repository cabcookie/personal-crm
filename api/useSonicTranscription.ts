import { useCallback, useRef, useState } from "react";
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
  type ToolUseInfo,
} from "@/helpers/sonic/client";
import {
  estimateSonicCostUsd,
  type SonicTokenTotals,
} from "@/helpers/sonic/constants";

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

const useSonicTranscription = (meetingId?: string) => {
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [detectedPeople, setDetectedPeople] = useState<DetectedPerson[]>([]);
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
  const totalsRef = useRef<SonicTokenTotals>(emptyTotals);

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

  const persistUsage = useCallback(async () => {
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
  }, [meetingId]);

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
  }, [persistUsage]);

  const start = useCallback(async () => {
    if (recording || starting) return;
    setStarting(true);
    setTranscript([]);
    setDetectedPeople([]);
    setTotals(emptyTotals);
    totalsRef.current = emptyTotals;
    setElapsedSeconds(0);
    setSystemAudioNote(null);

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
              if (existing.confirmed) return prev;
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
      timerRef.current = setInterval(
        () =>
          setElapsedSeconds(
            Math.round((Date.now() - startedAtRef.current) / 1000)
          ),
        1000
      );
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
  }, [recording, starting, searchPeople, stop, selectedMicId]);

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

  return {
    recording,
    starting,
    transcript,
    detectedPeople,
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
    start,
    stop,
  };
};

export default useSonicTranscription;
