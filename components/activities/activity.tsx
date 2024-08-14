import useActivity from "@/api/useActivity";
import useMeeting from "@/api/useMeeting";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import MeetingAccordionItem from "../meetings/MeetingAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import ProjectNotesForm from "../ui-elements/project-notes-form/project-notes-form";
import SavedState from "../ui-elements/project-notes-form/saved-state";
import DateSelector from "../ui-elements/selectors/date-selector";
import ProjectSelector from "../ui-elements/selectors/project-selector";
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
  const {
    activity,
    updateDate,
    addProjectToActivity,
    isLoadingActivity,
    errorActivity,
  } = useActivity(activityId);
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

  return (
    <div className="pb-8 space-y-6">
      <ApiLoadingError title="Loading activity failed" error={errorActivity} />

      {showDates && (
        <div className="flex flex-row gap-2">
          <DateSelector
            date={date}
            setDate={handleDateUpdate}
            selectHours
            bold
          />

          {!notesNotInAccordion && (
            <>
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
            </>
          )}
        </div>
      )}

      {!notesNotInAccordion ? (
        <Accordion type="single" collapsible>
          <ActivityProjectList
            projectIds={activity?.projectIds}
            addProjectToActivity={
              !allowAddingProjects ? undefined : addProjectToActivity
            }
            showProjects={showProjects}
          />

          <ActivityMeetingList meeting={meeting} showMeeting={showMeeting} />

          <ActivityNotes activity={activity} readOnly={readOnly} />
        </Accordion>
      ) : (
        <>
          {showMeeting && activity?.meetingId && (
            <div className="space-y-0">
              <h3 className="font-semibold">From meeting:</h3>
              <Accordion type="single" collapsible>
                {isLoadingActivity ||
                  (!meeting && (
                    <LoadingAccordionItem
                      value="loading-meeting"
                      sizeTitle="3xl"
                      sizeSubtitle="xl"
                    />
                  ))}
                {meeting && <MeetingAccordionItem meeting={meeting} />}
              </Accordion>
            </div>
          )}

          <div className="space-y-0">
            {showMeeting && <h3 className="font-semibold">Projects:</h3>}
            {allowAddingProjects && (
              <ProjectSelector
                value=""
                onChange={addProjectToActivity}
                allowCreateProjects
                placeholder="Add project…"
              />
            )}
            <ProjectNotesForm
              activityId={activityId}
              deleteActivity={() => deleteMeetingActivity(activityId)}
              readOnly={readOnly}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityComponent;
