import useActivity from "@/api/useActivity";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import SavedState from "../ui-elements/project-notes-form/saved-state";
import DateSelector from "../ui-elements/selectors/date-selector";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import MeetingName from "../ui-elements/tokens/meeting-name";
import ProjectName from "../ui-elements/tokens/project-name";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { debouncedUpdateNotes, debounedUpdateDate } from "./activity-helper";
import ActivityMetaData from "./activity-meta-data";

type ActivityComponentProps = {
  activityId: string;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  autoFocus?: boolean;
  allowAddingProjects?: boolean;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activityId,
  showDates,
  showMeeting,
  showProjects,
  autoFocus,
  allowAddingProjects,
}) => {
  const { activity, updateNotes, updateDate, addProjectToActivity } =
    useActivity(activityId);
  const [dateSaved, setDateSaved] = useState(true);
  const [date, setDate] = useState(activity?.finishedOn || new Date());
  const { toast } = useToast();

  useEffect(() => {
    setDate(activity?.finishedOn || new Date());
  }, [activity]);

  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    debouncedUpdateNotes({
      updateNotes,
      serializer,
    });
  };

  const handleDateUpdate = async (date: Date) => {
    setDateSaved(false);
    setDate(date);
    debounedUpdateDate({
      updateDate: () => updateDate(date),
      setSaveStatus: setDateSaved,
    });
  };

  const handleCopyToClipBoard = async () => {
    if (!activity) return;
    try {
      const domain = window.location.origin;
      const activityLink = `${domain}/activities/${activity.id}`;

      await navigator.clipboard.writeText(activityLink);
      toast({ title: "Activity link copied to clipboard" });
    } catch (error) {
      toast({
        title: "Error copying Activity link to clipboard",
        variant: "destructive",
        description: JSON.stringify(error),
      });
    }
  };

  return (
    <div className="pb-8 space-y-4">
      {showDates && (
        <div className="flex flex-row gap-2">
          <DateSelector
            date={date}
            setDate={handleDateUpdate}
            selectHours
            bold
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <LinkIcon
                  className="mt-2 text-muted-foreground hover:text-primary"
                  onClick={handleCopyToClipBoard}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy link of the note to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href={`/activities/${activityId}`}>
            <ExternalLink className="mt-2 text-muted-foreground hover:text-primary" />
          </Link>

          <SavedState saved={dateSaved} />
        </div>
      )}

      {showProjects && (
        <div>
          <strong>On:</strong>
          {activity?.projectIds.map((id) => (
            <ProjectName key={id} projectId={id} />
          ))}
          {allowAddingProjects && (
            <ProjectSelector
              value=""
              onChange={addProjectToActivity}
              placeholder="Add project to activity…"
            />
          )}
        </div>
      )}

      {showMeeting && activity?.meetingId && (
        <div>
          <strong>At:</strong>
          <MeetingName meetingId={activity.meetingId} />
        </div>
      )}

      <div>
        <NotesWriter
          notes={activity?.notes}
          saveNotes={handleNotesUpdate}
          autoFocus={autoFocus}
          key={activityId}
        />
      </div>

      <ActivityMetaData activity={activity} />
    </div>
  );
};

export default ActivityComponent;
