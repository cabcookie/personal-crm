import { FC } from "react";
import Link from "next/link";
import { Square } from "lucide-react";
import { useRecording } from "@/contexts/RecordingContext";
import AudioPulse from "../meetings/audio-pulse";
import DetectedPeopleMarker from "../meetings/detected-people-marker";
import { Button } from "../ui/button";

const fmtDuration = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/**
 * Global recording indicator shown in the app header whenever a meeting is
 * being recorded — regardless of which page the user is on. Shows a live audio
 * pulse + elapsed time, a discreet detected-people marker (transient hint +
 * count badge + knocking popover), a link back to the meeting being recorded,
 * and a stop control so the session can be ended from anywhere.
 */
const RecordingIndicator: FC = () => {
  const sonic = useRecording();

  if (!sonic.recording || !sonic.activeMeetingId) return null;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/meetings/${sonic.activeMeetingId}`}
        className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/5 px-2 py-0.5 text-destructive hover:bg-destructive/10 transition-colors max-w-[10rem] md:max-w-[16rem]"
        title={
          sonic.activeMeetingTopic
            ? `Aufnahme läuft: ${sonic.activeMeetingTopic}`
            : "Aufnahme läuft"
        }
      >
        <span className="text-destructive">
          <AudioPulse level={sonic.audioLevel} />
        </span>
        <span className="text-xs font-medium tabular-nums">
          {fmtDuration(sonic.elapsedSeconds)}
        </span>
        {sonic.activeMeetingTopic && (
          <span className="hidden md:inline text-xs truncate text-muted-foreground">
            {sonic.activeMeetingTopic}
          </span>
        )}
      </Link>

      <DetectedPeopleMarker
        compact
        people={sonic.detectedPeople}
        unconfirmedCount={sonic.unconfirmedCount}
        recentDetectionName={sonic.recentDetectionName}
        onToggleConfirm={sonic.toggleConfirm}
        onSelectMatch={sonic.selectMatch}
      />

      <Button
        onClick={sonic.stop}
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
        aria-label="Aufnahme stoppen"
        title="Aufnahme stoppen"
      >
        <Square className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RecordingIndicator;
