import { FC, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { DetectedPerson } from "@/api/useSonicTranscription";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

const roleLine = (company: string | null, role: string | null): string => {
  const parts = [role, company].filter(Boolean) as string[];
  return parts.join(" · ");
};

/**
 * One detected-person chip. EVERY heard name is shown. If the best match was
 * confident (score <= threshold) a candidate is pre-selected; otherwise none
 * is, and the chip shows the heard name and prompts the user to assign one.
 * The candidate list (alternatives) is ALWAYS available via the popover.
 *
 * Extracted from the former always-on MeetingDetectedPeopleBar so it can be
 * reused inside the discreet detection popover on both the meeting page and the
 * app header.
 */
export const DetectedPersonChip: FC<{
  person: DetectedPerson;
  onToggleConfirm: (id: string) => void;
  onSelectMatch: (id: string, personId: string) => void;
}> = ({ person, onToggleConfirm, onSelectMatch }) => {
  const [open, setOpen] = useState(false);
  const selected =
    person.matches.find((m) => m.personId === person.selectedPersonId) ?? null;

  const hasCandidates = person.matches.length > 0;
  const sub = selected ? roleLine(selected.company, selected.role) : null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-2 py-1 text-sm bg-background transition-colors",
        person.confirmed && "border-green-500/60 bg-green-50",
        !selected && "border-amber-300"
      )}
    >
      {/* Confirm only makes sense once a person is assigned. */}
      <Checkbox
        checked={person.confirmed}
        disabled={!selected}
        onCheckedChange={() => selected && onToggleConfirm(person.id)}
        aria-label={
          selected ? `Bestätige ${selected.name}` : "Erst Person zuordnen"
        }
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex flex-col items-start text-left leading-tight"
            onMouseEnter={() => setOpen(true)}
          >
            {selected ? (
              <>
                <span className="font-medium flex items-center gap-1">
                  {selected.name}
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </span>
                {sub && (
                  <span className="text-xs text-muted-foreground">{sub}</span>
                )}
              </>
            ) : (
              <>
                <span className="font-medium flex items-center gap-1">
                  „{person.heardName}“
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </span>
                <span className="text-xs text-amber-600">
                  {hasCandidates ? "Zuordnen…" : "Kein Treffer"}
                </span>
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-64 p-1"
          onMouseLeave={() => setOpen(false)}
        >
          <p className="px-2 py-1 text-xs text-muted-foreground">
            Gehört: „{person.heardName}“
            {hasCandidates ? " — Person wählen:" : " — keine Kandidaten."}
          </p>
          {person.matches.map((m) => {
            const isSel = m.personId === person.selectedPersonId;
            const msub = roleLine(m.company, m.role);
            return (
              <button
                key={m.personId}
                type="button"
                onClick={() => {
                  onSelectMatch(person.id, m.personId);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-start gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                  isSel && "bg-accent/50"
                )}
              >
                <Check
                  className={cn(
                    "w-4 h-4 mt-0.5 shrink-0",
                    isSel ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm">{m.name}</span>
                  {msub && (
                    <span className="text-xs text-muted-foreground">
                      {msub}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground/70">
                    Ähnlichkeit {m.score.toFixed(2)}
                  </span>
                </span>
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
};

/**
 * The list of detected-person chips shown inside the discreet detection
 * popover. Reused by both the meeting-page marker and the header marker.
 */
const DetectedPeoplePopoverContent: FC<{
  people: DetectedPerson[];
  onToggleConfirm: (detectedId: string) => void;
  onSelectMatch: (detectedId: string, personId: string) => void;
}> = ({ people, onToggleConfirm, onSelectMatch }) => (
  <div className="space-y-2">
    <p className="text-xs font-medium text-muted-foreground">
      Erkannte Personen
    </p>
    {people.length === 0 ? (
      <p className="text-xs text-muted-foreground">
        Warte auf erwähnte Personen…
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        {people.map((p) => (
          <DetectedPersonChip
            key={p.id}
            person={p}
            onToggleConfirm={onToggleConfirm}
            onSelectMatch={onSelectMatch}
          />
        ))}
      </div>
    )}
  </div>
);

export default DetectedPeoplePopoverContent;
