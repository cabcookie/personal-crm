import { FC } from "react";
import { Info, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import type { TranscriptLine } from "@/api/useSonicTranscription";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

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
  summarizing?: boolean;
  summaryError?: string | null;
  /** The live stream dropped and is reconnecting (recording continues). */
  reconnecting?: boolean;
  /**
   * When true, render ONLY the transcript, collapsed inside an accordion item
   * (used once the meeting is summarized — the transcript is kept for
   * reference but tucked away like the other meeting sections). When false,
   * render as a prominent open block with the live controls/notices.
   */
  asAccordionItem?: boolean;
};

const TranscriptCard: FC<{
  recording: boolean;
  transcript: TranscriptLine[];
}> = ({ recording, transcript }) => (
  <Card className="p-3">
    <ScrollArea className="h-64 pr-2">
      {transcript.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {recording ? "Waiting for spoken content…" : "No transcript yet."}
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
);

const MeetingLiveTranscription: FC<Props> = ({
  recording,
  transcript,
  estimatedCostUsd,
  elapsedSeconds,
  systemAudioNote,
  summarizing,
  summaryError,
  reconnecting,
  asAccordionItem,
}) => {
  // Summarized meetings: the transcript is reference-only now (the summary has
  // been transferred into the topic notes), so collapse it into an accordion
  // item alongside the page's other sections. Nothing else is shown.
  if (asAccordionItem) {
    if (transcript.length === 0) return null;
    return (
      <DefaultAccordionItem
        value="meeting-transcript"
        triggerTitle="Transcript"
        triggerSubTitle={`${transcript.length} line${transcript.length === 1 ? "" : "s"}`}
      >
        <TranscriptCard recording={recording} transcript={transcript} />
      </DefaultAccordionItem>
    );
  }

  return (
    <div className="space-y-3 px-2 md:px-4 pt-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-semibold tracking-tight">Transcript</h3>
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

      {/* Quiet, non-blocking hint while a dropped connection is restored.
          Transcript and suggestions continue once it's back. */}
      {reconnecting && (
        <div
          role="status"
          className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-md p-2"
        >
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          <span>
            Connection interrupted, reconnecting… The transcript will continue
            once it&apos;s back.
          </span>
        </div>
      )}

      <TranscriptCard recording={recording} transcript={transcript} />

      {summaryError && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 rounded-md p-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Summary failed: {summaryError}</span>
        </div>
      )}

      {/* While a summary is being generated, show a clear in-place notice so
          it's obvious the run is in progress and that leaving the page is safe
          (the global notification brings the user back — see
          contexts/MeetingSummaryContext.tsx). The summary result itself is NOT
          shown here: it is transferred into the topic notes. */}
      {summarizing && (
        <Card className="p-4 border-dashed">
          <div className="flex items-start gap-3">
            <Loader2 className="w-5 h-5 shrink-0 mt-0.5 animate-spin text-primary" />
            <div className="space-y-1">
              <p className="font-medium">Creating summary…</p>
              <p className="text-sm text-muted-foreground">
                This usually takes under a minute. You can leave this page —
                we&apos;ll notify you as soon as the summary is ready and has
                been added to the topic notes.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MeetingLiveTranscription;
