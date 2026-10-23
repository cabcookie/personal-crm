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
  /** Add a mentioned person by hand before summarizing. */
  onAddPerson?: (person: CreatedPerson) => void;
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
  onAddPerson,
  onConfirm,
}) => {
  // With the "+ Add person" pill the list is useful even with no detections.
  const hasReviewables = people.length > 0 || !!onAddPerson;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>Create summary?</DialogTitle>
          <DialogDescription>
            The summary attributes every point only to the topics (projects)
            already added to this meeting, and can only consider people
            confirmed as participants or assigned as mentioned. Quick check: are
            all mentioned people below assigned correctly?
          </DialogDescription>
        </DialogHeader>

        {hasReviewables && (
          <div className="-mx-2 flex-1 overflow-y-auto px-2">
            <MeetingDetectionPills
              people={people}
              suggestedProjects={suggestedProjects}
              onSelectMatch={onSelectMatch}
              onToggleConfirm={onToggleConfirm}
              onRejectPerson={onRejectPerson}
              onAssignCreatedPerson={onAssignCreatedPerson}
              onToggleConfirmProject={onToggleConfirmProject}
              onDismissProject={onDismissProject}
              onAddPerson={onAddPerson}
              hideProjects
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Create summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingSummaryConfirmDialog;
