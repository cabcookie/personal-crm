import { FC } from "react";
import { Sparkles } from "lucide-react";
import type {
  DetectedPerson,
  SuggestedProject,
} from "@/api/useSonicTranscription";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import MeetingDetectionPills from "./meeting-detection-pills";
import type { CreatedPerson } from "./create-detected-person-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  people: DetectedPerson[];
  suggestedProjects: SuggestedProject[];
  onSelectMatch: (detectedId: string, personId: string) => void;
  onToggleConfirm: (detectedId: string) => void;
  onRejectPerson: (detectedId: string) => void;
  onAssignCreatedPerson: (detectedId: string, person: CreatedPerson) => void;
  onToggleConfirmProject: (projectId: string) => void;
  onDismissProject: (projectId: string) => void;
  onConfirm: () => void;
};

/**
 * Shown when the user clicks "Zusammenfassung erstellen", BEFORE the request
 * is sent. A last chance to double check: have all the projects actually
 * discussed been added as topics, and all participating / mentioned people
 * assigned and confirmed? The summary can only attribute points to topics and
 * people given here — anything missed here can't show up in the result.
 *
 * Reuses the same detection pills as the live meeting view, so any remaining
 * open detections can still be resolved right here before confirming.
 */
const MeetingSummaryConfirmDialog: FC<Props> = ({
  open,
  onOpenChange,
  people,
  suggestedProjects,
  onSelectMatch,
  onToggleConfirm,
  onRejectPerson,
  onAssignCreatedPerson,
  onToggleConfirmProject,
  onDismissProject,
  onConfirm,
}) => {
  const hasReviewables = people.length > 0 || suggestedProjects.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zusammenfassung erstellen?</DialogTitle>
          <DialogDescription>
            Die Zusammenfassung ordnet jeden Punkt nur den Themen (Projekten)
            zu, die diesem Meeting bereits hinzugefügt wurden, und kann nur
            Personen berücksichtigen, die als Teilnehmer bestätigt oder als
            erwähnt zugeordnet sind. Prüfe kurz: Sind alle besprochenen Projekte
            als Themen hinzugefügt? Sind alle teilnehmenden und erwähnten
            Personen zugeordnet?
          </DialogDescription>
        </DialogHeader>

        {hasReviewables && (
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
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Zusammenfassung erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingSummaryConfirmDialog;
