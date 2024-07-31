import { useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import useMeeting from "@/api/useMeeting";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectNotesForm from "../ui-elements/project-notes-form/project-notes-form";
import SavedState from "../ui-elements/project-notes-form/saved-state";
import DateSelector from "../ui-elements/selectors/date-selector";
import { Accordion } from "../ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { debounedUpdateDate } from "./activity-helper";
import ActivityMeetingList from "./activity-meeting-list";
import ActivityNotes from "./activity-notes";
import ActivityProjectList from "./activity-project-list";

type ActivityComponentProps = {
  activityId: string;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  allowAddingProjects?: boolean;
  notesNotInAccordion?: boolean;
  readOnly?: boolean;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activityId,
  showDates,
  showMeeting,
  showProjects,
  allowAddingProjects,
  notesNotInAccordion,
  readOnly,
}) => {
  const { activity, updateNotes, updateDate, addProjectToActivity } =
    useActivity(activityId);
  const { getProjectNamesByIds } = useProjectsContext();
  const { meeting, deleteMeetingActivity } = useMeeting(activity?.meetingId);
  const [dateSaved, setDateSaved] = useState(true);
  const [date, setDate] = useState(activity?.finishedOn || new Date());
  const { toast } = useToast();

  useEffect(() => {
    setDate(activity?.finishedOn || new Date());
  }, [activity]);

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

  return !notesNotInAccordion ? (
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

      <Accordion type="single" collapsible>
        <ActivityProjectList
          projectIds={activity?.projectIds}
          addProjectToActivity={
            !allowAddingProjects ? undefined : addProjectToActivity
          }
          showProjects={showProjects}
        />

        <ActivityMeetingList meeting={meeting} showMeeting={showMeeting} />

        <ActivityNotes
          activity={activity}
          updateNotes={updateNotes}
          readOnly={readOnly}
        />
      </Accordion>
    </div>
  ) : (
    <DefaultAccordionItem
      value={activityId}
      triggerTitle="Meeting notes"
      badge={
        <TaskBadge
          hasOpenTasks={activity?.hasOpenTasks}
          hasClosedTasks={!!activity?.closedTasks?.length}
        />
      }
      triggerSubTitle={`Projects: ${getProjectNamesByIds(
        activity?.projectIds
      )}`}
    >
      <ProjectNotesForm
        activityId={activityId}
        deleteActivity={() => deleteMeetingActivity(activityId)}
        readOnly={readOnly}
      />
    </DefaultAccordionItem>
  );
};

export default ActivityComponent;
