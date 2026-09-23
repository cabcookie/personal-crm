import { FC, useState } from "react";
import { Check, ChevronDown, X, UserPlus, FolderPlus } from "lucide-react";
import type {
  DetectedPerson,
  SuggestedProject,
} from "@/api/useSonicTranscription";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import CreateDetectedPersonDialog, {
  type CreatedPerson,
} from "./create-detected-person-dialog";

const roleLine = (company: string | null, role: string | null): string =>
  [role, company].filter(Boolean).join(" · ");

/**
 * One person pill. Shows the selected/assigned person or the heard name. The
 * chevron opens the candidate list (choosing one confirms the mention). If no
 * candidate fits, "Neu anlegen" opens the create dialog. A confirmed pill is
 * green; an unassigned one is amber. The X rejects/removes the detection.
 */
const PersonPill: FC<{
  person: DetectedPerson;
  onSelectMatch: (id: string, personId: string) => void;
  onToggleConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onCreateNew: (id: string, heardName: string) => void;
}> = ({ person, onSelectMatch, onToggleConfirm, onReject, onCreateNew }) => {
  const [open, setOpen] = useState(false);
  const selected =
    person.matches.find((m) => m.personId === person.selectedPersonId) ?? null;
  const sub = selected ? roleLine(selected.company, selected.role) : null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border pl-2 pr-1 py-0.5 text-sm bg-background transition-colors",
        person.confirmed
          ? "border-green-500/60 bg-green-50"
          : selected
            ? "border-border"
            : "border-amber-300"
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 leading-tight"
          >
            <span className="flex flex-col items-start">
              <span className="font-medium">
                {selected ? selected.name : `„${person.heardName}“`}
              </span>
              {selected && sub && (
                <span className="text-[11px] text-muted-foreground">{sub}</span>
              )}
              {!selected && (
                <span className="text-[11px] text-amber-600">
                  {person.matches.length ? "Zuordnen…" : "Kein Treffer"}
                </span>
              )}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-1">
          <p className="px-2 py-1 text-xs text-muted-foreground">
            Gehört: „{person.heardName}“
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
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onCreateNew(person.id, person.heardName);
            }}
            className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent border-t mt-1 pt-2"
          >
            <UserPlus className="w-4 h-4 shrink-0 text-blue-600" />
            <span className="text-sm">Neue Person anlegen…</span>
          </button>
        </PopoverContent>
      </Popover>

      {/* Confirm toggle (only once a person is assigned). */}
      {selected && (
        <button
          type="button"
          onClick={() => onToggleConfirm(person.id)}
          aria-label={person.confirmed ? "Bestätigung aufheben" : "Bestätigen"}
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full",
            person.confirmed
              ? "text-green-600"
              : "text-muted-foreground hover:text-green-600"
          )}
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      <button
        type="button"
        onClick={() => onReject(person.id)}
        aria-label="Erkennung verwerfen"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/** One project pill. Confirm toggles acceptance; X dismisses the suggestion. */
const ProjectPill: FC<{
  suggestion: SuggestedProject;
  onToggleConfirm: (projectId: string) => void;
  onDismiss: (projectId: string) => void;
}> = ({ suggestion, onToggleConfirm, onDismiss }) => (
  <div
    className={cn(
      "flex items-center gap-1.5 rounded-full border pl-2 pr-1 py-0.5 text-sm bg-background transition-colors",
      suggestion.confirmed ? "border-green-500/60 bg-green-50" : "border-border"
    )}
  >
    <FolderPlus className="w-4 h-4 text-blue-600 shrink-0" />
    <span className="font-medium leading-tight">
      {suggestion.name ?? "Projekt"}
    </span>
    <button
      type="button"
      onClick={() => onToggleConfirm(suggestion.projectId)}
      aria-label={suggestion.confirmed ? "Bestätigung aufheben" : "Bestätigen"}
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-full",
        suggestion.confirmed
          ? "text-green-600"
          : "text-muted-foreground hover:text-green-600"
      )}
    >
      <Check className="w-4 h-4" />
    </button>
    <button
      type="button"
      onClick={() => onDismiss(suggestion.projectId)}
      aria-label="Vorschlag verwerfen"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

type Props = {
  people: DetectedPerson[];
  suggestedProjects: SuggestedProject[];
  onSelectMatch: (detectedId: string, personId: string) => void;
  onToggleConfirm: (detectedId: string) => void;
  onRejectPerson: (detectedId: string) => void;
  onAssignCreatedPerson: (detectedId: string, person: CreatedPerson) => void;
  onToggleConfirmProject: (projectId: string) => void;
  onDismissProject: (projectId: string) => void;
};

/**
 * Persistent detection pills for the meeting page: every detected person and
 * suggested project stays visible during the recording (unlike the discreet
 * header marker). People and projects are shown as pills the user can assign,
 * confirm, reject, or (for people) create anew.
 */
const MeetingDetectionPills: FC<Props> = ({
  people,
  suggestedProjects,
  onSelectMatch,
  onToggleConfirm,
  onRejectPerson,
  onAssignCreatedPerson,
  onToggleConfirmProject,
  onDismissProject,
}) => {
  const [createFor, setCreateFor] = useState<{
    detectedId: string;
    heardName: string;
  } | null>(null);

  if (!people.length && !suggestedProjects.length) return null;

  return (
    <div className="rounded-md border border-dashed p-2 mx-2 md:mx-4 space-y-2">
      {people.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Erkannte Personen
          </span>
          <div className="flex flex-wrap gap-2">
            {people.map((p) => (
              <PersonPill
                key={p.id}
                person={p}
                onSelectMatch={onSelectMatch}
                onToggleConfirm={onToggleConfirm}
                onReject={onRejectPerson}
                onCreateNew={(detectedId, heardName) =>
                  setCreateFor({ detectedId, heardName })
                }
              />
            ))}
          </div>
        </div>
      )}

      {suggestedProjects.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Vorgeschlagene Projekte
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedProjects.map((s) => (
              <ProjectPill
                key={s.projectId}
                suggestion={s}
                onToggleConfirm={onToggleConfirmProject}
                onDismiss={onDismissProject}
              />
            ))}
          </div>
        </div>
      )}

      <CreateDetectedPersonDialog
        open={!!createFor}
        onOpenChange={(o) => !o && setCreateFor(null)}
        initialName={createFor?.heardName}
        onCreated={(person) => {
          if (createFor) onAssignCreatedPerson(createFor.detectedId, person);
          setCreateFor(null);
        }}
      />
    </div>
  );
};

export default MeetingDetectionPills;
