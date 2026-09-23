import { FC } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type {
  DetectedPerson,
  SuggestedProject,
} from "@/api/useSonicTranscription";
import { Button } from "../ui/button";
import MeetingDetectionPills from "./meeting-detection-pills";
import type { CreatedPerson } from "./create-detected-person-dialog";

type Props = {
  people: DetectedPerson[];
  suggestedProjects: SuggestedProject[];
  summarizing: boolean;
  onSelectMatch: (detectedId: string, personId: string) => void;
  onToggleConfirm: (detectedId: string) => void;
  onRejectPerson: (detectedId: string) => void;
  onAssignCreatedPerson: (detectedId: string, person: CreatedPerson) => void;
  onToggleConfirmProject: (projectId: string) => void;
  onDismissProject: (projectId: string) => void;
  onConfirm: () => void;
};

/**
 * Confirmation gate shown after the recording stops and BEFORE the summary is
 * written. The user reviews every detected person and suggested project once —
 * assigning, confirming, rejecting, or creating people — then presses
 * "Zusammenfassung erstellen". Only confirmed people / accepted projects feed
 * the summary. Reuses the same pills as the live meeting view.
 */
const MeetingConfirmationGate: FC<Props> = ({
  people,
  suggestedProjects,
  summarizing,
  onSelectMatch,
  onToggleConfirm,
  onRejectPerson,
  onAssignCreatedPerson,
  onToggleConfirmProject,
  onDismissProject,
  onConfirm,
}) => {
  const unconfirmedPeople = people.filter((p) => !p.confirmed).length;
  const unconfirmedProjects = suggestedProjects.filter(
    (p) => !p.confirmed
  ).length;
  const openCount = unconfirmedPeople + unconfirmedProjects;

  return (
    <div className="rounded-md border border-[--context-color] bg-[--context-color-bg] p-3 mx-2 md:mx-4 space-y-3 animate-in fade-in">
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 mt-0.5 text-[--context-color] shrink-0" />
        <div className="text-sm">
          <p className="font-medium">Erkennungen bestätigen</p>
          <p className="text-xs text-muted-foreground">
            Prüfe die erkannten Personen und Projekte, bevor die Zusammenfassung
            erstellt wird. Nur bestätigte fließen in die Zusammenfassung ein.
          </p>
        </div>
      </div>

      <MeetingDetectionPills
        people={people}
        suggestedProjects={suggestedProjects}
        onSelectMatch={onSelectMatch}
        onToggleConfirm={onToggleConfirm}
        onRejectPerson={onRejectPerson}
        onAssignCreatedPerson={onAssignCreatedPerson}
        onToggleConfirmProject={onToggleConfirmProject}
        onDismissProject={onDismissProject}
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {openCount > 0 ? `${openCount} offen` : "Alles bestätigt"}
        </span>
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={summarizing}
          className="gap-1"
        >
          {summarizing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Zusammenfassung erstellen
        </Button>
      </div>
    </div>
  );
};

export default MeetingConfirmationGate;
