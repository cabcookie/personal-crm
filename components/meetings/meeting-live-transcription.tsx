import { FC } from "react";
import { Info, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import type { TranscriptLine } from "@/api/useSonicTranscription";
import MeetingSummaryView from "./meeting-summary-view";

const fmtDuration = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const fmtCost = (usd: number): string => `$${usd.toFixed(4)}`;

type Props = {
  recording: boolean;
  transcript: TranscriptLine[];
  estimatedCostUsd: number;
  elapsedSeconds: number;
  systemAudioNote: string | null;
  summary?: unknown;
  summarizing?: boolean;
};

const MeetingLiveTranscription: FC<Props> = ({
  recording,
  transcript,
  estimatedCostUsd,
  elapsedSeconds,
  systemAudioNote,
  summary,
  summarizing,
}) => {
  return (
    <div className="space-y-3 px-2 md:px-4 pt-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-semibold tracking-tight">Transkript</h3>
        {recording && (
          <span className="text-sm text-muted-foreground">
            {fmtDuration(elapsedSeconds)} · ~{fmtCost(estimatedCostUsd)}
          </span>
        )}
      </div>

      {systemAudioNote && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{systemAudioNote}</span>
        </div>
      )}

      <Card className="p-3">
        <ScrollArea className="h-64 pr-2">
          {transcript.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {recording
                ? "Warte auf gesprochene Inhalte…"
                : "Noch keine Transkription."}
            </p>
          ) : (
            <div className="space-y-1">
              {transcript.map((line) => (
                <p key={line.id} className="text-sm leading-snug">
                  {line.text}
                </p>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      {summarizing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Zusammenfassung wird erstellt…
        </div>
      )}

      {!!summary && <MeetingSummaryView summary={summary} />}
    </div>
  );
};

export default MeetingLiveTranscription;
