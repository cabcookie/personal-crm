import { FC, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  X,
  FolderPlus,
  Plus,
  UserPlus,
} from "lucide-react";
import type {
  DetectedPerson,
  SuggestedProject,
} from "@/api/useSonicTranscription";
import type { PersonMatch } from "@/helpers/sonic/client";
import { searchPeopleWithContext } from "@/helpers/sonic/people-search";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import CreateDetectedPersonDialog, {
  type CreatedPerson,
} from "./create-detected-person-dialog";

const roleLine = (company: string | null, role: string | null): string =>
  [role, company].filter(Boolean).join(" · ");

const SEARCH_DEBOUNCE_MS = 250;
const MAX_CANDIDATES = 5;
const CREATE_VALUE = "__create__";

/**
 * Candidate list + search for resolving a person. The search input sits at
 * the BOTTOM and is focused on open; the best candidate is right above it and
 * pre-selected, so Enter takes it and ↑/↓ moves through the others. Typing
 * replaces the candidates with search results that combine the typed text
 * (weighted higher) with the words Sonic heard (see searchPeopleWithContext).
 */
const PersonSearchCommand: FC<{
  candidates: PersonMatch[];
  heardTerms: string[];
  selectedPersonId: string | null;
  onPick: (match: PersonMatch) => void;
  onCreate: (typed: string) => void;
}> = ({ candidates, heardTerms, selectedPersonId, onPick, onCreate }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  const handleQuery = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = value.trim();
    if (!q) {
      requestRef.current += 1; // drop any in-flight response
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const request = ++requestRef.current;
      const found = await searchPeopleWithContext(q, heardTerms);
      if (request !== requestRef.current) return; // a newer query won
      setResults(found);
      setLoading(false);
    }, SEARCH_DEBOUNCE_MS);
  };

  // Best first, then shown bottom-up so the best sits right above the input.
  const ranked = query.trim()
    ? (results ?? [])
    : [...candidates]
        .sort((a, b) => a.score - b.score)
        .slice(0, MAX_CANDIDATES);
  const shown = [...ranked].reverse();
  const bestId = ranked[0]?.personId ?? CREATE_VALUE;
  // Keep the user's highlighted item while it's still listed; otherwise fall
  // back to the best one (e.g. after new results arrive).
  const current =
    active &&
    (active === CREATE_VALUE || ranked.some((m) => m.personId === active))
      ? active
      : bestId;

  return (
    <Command
      shouldFilter={false}
      loop
      value={current}
      onValueChange={setActive}
    >
      <CommandList className="max-h-72">
        <CommandGroup>
          <CommandItem
            value={CREATE_VALUE}
            onSelect={() => onCreate(query.trim())}
          >
            <UserPlus className="mr-2 h-4 w-4 shrink-0 text-blue-600" />
            <span className="truncate">
              {query.trim()
                ? `Create “${query.trim()}”…`
                : "Create new person…"}
            </span>
          </CommandItem>
        </CommandGroup>
        {loading && (
          <p className="px-3 py-2 text-xs text-muted-foreground">Searching…</p>
        )}
        {!loading && query.trim() && results?.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            No person found.
          </p>
        )}
        {!query.trim() && !candidates.length && (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Type to search…
          </p>
        )}
        {shown.length > 0 && (
          <CommandGroup
            heading={query.trim() ? "Search results" : "Candidates"}
          >
            {shown.map((m) => {
              const sub = roleLine(m.company, m.role);
              const isSel = m.personId === selectedPersonId;
              return (
                <CommandItem
                  key={m.personId}
                  value={m.personId}
                  onSelect={() => onPick(m)}
                  className="items-start"
                >
                  <Check
                    className={cn(
                      "mr-2 mt-0.5 h-4 w-4 shrink-0",
                      isSel ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm">{m.name}</span>
                    {sub && (
                      <span className="truncate text-xs text-muted-foreground">
                        {sub}
                      </span>
                    )}
                  </span>
                  <span className="ml-auto pl-2 text-[10px] text-muted-foreground/70">
                    {m.score.toFixed(2)}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
      <CommandInput
        autoFocus
        placeholder="Search person…"
        value={query}
        onValueChange={handleQuery}
        className="border-t"
      />
    </Command>
  );
};

/**
 * One person pill. Shows the selected/assigned person or the heard name.
 * Opening it shows the candidates and the search (see PersonSearchCommand);
 * picking one assigns + confirms the mention. A confirmed pill is green, an
 * unassigned one amber. The X rejects/removes the detection.
 */
const PersonPill: FC<{
  person: DetectedPerson;
  onSelectMatch: (id: string, personId: string) => void;
  onAssign: (id: string, person: CreatedPerson) => void;
  onToggleConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onCreateNew: (id: string, name: string) => void;
}> = ({
  person,
  onSelectMatch,
  onAssign,
  onToggleConfirm,
  onReject,
  onCreateNew,
}) => {
  const [open, setOpen] = useState(false);
  const selected =
    person.matches.find((m) => m.personId === person.selectedPersonId) ?? null;
  const sub = selected ? roleLine(selected.company, selected.role) : null;
  const heardTerms = [person.heardName, ...(person.alsoHeardAs ?? [])];

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
                {selected ? selected.name : `“${person.heardName}”`}
                {person.alsoHeardAs?.length ? (
                  <span
                    className="ml-1 rounded-full bg-muted px-1.5 text-[10px] font-normal text-muted-foreground align-middle"
                    title={`Also heard as: ${person.alsoHeardAs.join(", ")}`}
                  >
                    {person.alsoHeardAs.length + 1}×
                  </span>
                ) : null}
              </span>
              {selected && sub && (
                <span className="text-[11px] text-muted-foreground">{sub}</span>
              )}
              {!selected && (
                <span className="text-[11px] text-amber-600">
                  {person.matches.length ? "Assign…" : "No match"}
                </span>
              )}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-0">
          <p className="truncate border-b px-3 py-1.5 text-xs text-muted-foreground">
            Heard: {heardTerms.map((t) => `“${t}”`).join(", ")}
          </p>
          <PersonSearchCommand
            candidates={person.matches}
            heardTerms={heardTerms}
            selectedPersonId={person.selectedPersonId}
            onPick={(m) => {
              // A listed candidate is selected in place; a search result is
              // added to the candidates first.
              if (person.matches.some((c) => c.personId === m.personId)) {
                onSelectMatch(person.id, m.personId);
              } else {
                onAssign(person.id, {
                  personId: m.personId,
                  name: m.name,
                  company: m.company,
                  role: m.role,
                });
              }
              setOpen(false);
            }}
            onCreate={(typed) => {
              setOpen(false);
              onCreateNew(person.id, typed || person.heardName);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Confirm toggle (only once a person is assigned). */}
      {selected && (
        <button
          type="button"
          onClick={() => onToggleConfirm(person.id)}
          aria-label={person.confirmed ? "Unconfirm" : "Confirm"}
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
        aria-label="Dismiss detection"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/** Empty pill at the end of the list to add a mentioned person by hand. */
const AddPersonPill: FC<{
  onAdd: (person: CreatedPerson) => void;
  onCreateNew: (name: string) => void;
}> = ({ onAdd, onCreateNew }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
          Add person
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <PersonSearchCommand
          candidates={[]}
          heardTerms={[]}
          selectedPersonId={null}
          onPick={(m) => {
            onAdd({
              personId: m.personId,
              name: m.name,
              company: m.company,
              role: m.role,
            });
            setOpen(false);
          }}
          onCreate={(typed) => {
            setOpen(false);
            onCreateNew(typed);
          }}
        />
      </PopoverContent>
    </Popover>
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
    <span className="flex flex-col items-start leading-tight">
      <span className="font-medium">{suggestion.name ?? "Project"}</span>
      {suggestion.company && (
        <span className="text-[11px] text-muted-foreground">
          {suggestion.company}
        </span>
      )}
    </span>
    <button
      type="button"
      onClick={() => onToggleConfirm(suggestion.projectId)}
      aria-label={suggestion.confirmed ? "Unconfirm" : "Confirm"}
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
      aria-label="Dismiss suggestion"
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
  /** Add a mentioned person by hand; shows the "+ Add person" pill. */
  onAddPerson?: (person: CreatedPerson) => void;
  /** Hide the suggested-projects section (e.g. the summary dialog only
   * reviews people — projects are added as topics separately). */
  hideProjects?: boolean;
};

/**
 * Persistent detection pills for the meeting page: every detected person and
 * suggested project stays visible during the recording (unlike the discreet
 * header marker). People and projects are shown as pills the user can assign,
 * confirm, reject, or (for people) create anew — plus an empty pill to add a
 * mentioned person who wasn't detected.
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
  onAddPerson,
  hideProjects,
}) => {
  // detectedId null = creating a person for the "+ Add person" pill.
  const [createFor, setCreateFor] = useState<{
    detectedId: string | null;
    name: string;
  } | null>(null);

  const showPeople = people.length > 0 || !!onAddPerson;
  const showProjects = !hideProjects && suggestedProjects.length > 0;
  if (!showPeople && !showProjects) return null;

  return (
    <div className="rounded-md border border-dashed p-2 mx-2 md:mx-4 space-y-2">
      {showPeople && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Mentioned people
          </span>
          <div className="flex flex-wrap gap-2">
            {people.map((p) => (
              <PersonPill
                key={p.id}
                person={p}
                onSelectMatch={onSelectMatch}
                onAssign={onAssignCreatedPerson}
                onToggleConfirm={onToggleConfirm}
                onReject={onRejectPerson}
                onCreateNew={(detectedId, name) =>
                  setCreateFor({ detectedId, name })
                }
              />
            ))}
            {onAddPerson && (
              <AddPersonPill
                onAdd={onAddPerson}
                onCreateNew={(name) => setCreateFor({ detectedId: null, name })}
              />
            )}
          </div>
        </div>
      )}

      {showProjects && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Suggested projects
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
        initialName={createFor?.name}
        onCreated={(person) => {
          if (createFor?.detectedId) {
            onAssignCreatedPerson(createFor.detectedId, person);
          } else {
            onAddPerson?.(person);
          }
          setCreateFor(null);
        }}
      />
    </div>
  );
};

export default MeetingDetectionPills;
