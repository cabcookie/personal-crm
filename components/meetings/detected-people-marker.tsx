import { FC, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import type { DetectedPerson } from "@/api/useSonicTranscription";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import DetectedPeoplePopoverContent from "./detected-people-popover";

type Props = {
  people: DetectedPerson[];
  unconfirmedCount: number;
  recentDetectionName: string | null;
  onToggleConfirm: (detectedId: string) => void;
  onSelectMatch: (detectedId: string, personId: string) => void;
  /** Compact variant for the header (icon only, tighter spacing). */
  compact?: boolean;
};

/**
 * Discreet detected-people marker: a small button carrying a badge with the
 * number of not-yet-confirmed detections. When a new name is heard, a transient
 * label ("Name erkannt: …") fades in next to it and the button "knocks" once to
 * draw the eye, then settles back to just the marker. Clicking opens the
 * popover where the user assigns/confirms people. Reused on the meeting page
 * and (compact) in the app header.
 */
const DetectedPeopleMarker: FC<Props> = ({
  people,
  unconfirmedCount,
  recentDetectionName,
  onToggleConfirm,
  onSelectMatch,
  compact,
}) => {
  const [open, setOpen] = useState(false);
  // Bump a key each time a new detection arrives to (re)play the knock anim.
  const [knockKey, setKnockKey] = useState(0);
  const lastNameRef = useRef<string | null>(null);

  useEffect(() => {
    if (recentDetectionName && recentDetectionName !== lastNameRef.current) {
      lastNameRef.current = recentDetectionName;
      setKnockKey((k) => k + 1);
    }
    if (!recentDetectionName) lastNameRef.current = null;
  }, [recentDetectionName]);

  // Nothing detected yet and no active hint → render nothing (stay discreet).
  if (people.length === 0 && !recentDetectionName) return null;

  const showBadge = unconfirmedCount > 0;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            key={knockKey}
            type="button"
            aria-label="Erkannte Personen anzeigen"
            className={cn(
              "relative inline-flex items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              compact ? "h-7 w-7" : "h-8 w-8",
              knockKey > 0 && "animate-knock"
            )}
          >
            <Users className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            {showBadge && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-[--context-color] px-1 text-[10px] font-semibold leading-none text-white",
                  compact ? "h-4 min-w-4" : "h-4 min-w-4"
                )}
              >
                {unconfirmedCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align={compact ? "end" : "start"} className="w-72">
          <DetectedPeoplePopoverContent
            people={people}
            onToggleConfirm={onToggleConfirm}
            onSelectMatch={onSelectMatch}
          />
        </PopoverContent>
      </Popover>

      {/* Transient "name detected" hint — self-clears via the engine timer. */}
      {recentDetectionName && !open && (
        <span
          key={recentDetectionName}
          className="text-xs text-muted-foreground animate-in fade-in slide-in-from-left-1 whitespace-nowrap"
        >
          Erkannt: „{recentDetectionName}“
        </span>
      )}
    </div>
  );
};

export default DetectedPeopleMarker;
