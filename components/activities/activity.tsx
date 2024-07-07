import useActivity from "@/api/useActivity";
import useMeeting from "@/api/useMeeting";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
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
  autoFocus?: boolean;
  allowAddingProjects?: boolean;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activityId,
  showDates,
  showMeeting,
  showProjects,
  allowAddingProjects,
}) => {
  const { activity, updateNotes, updateDate, addProjectToActivity } =
    useActivity(activityId);
  const { meeting } = useMeeting(activity?.meetingId);
  const [dateSaved, setDateSaved] = useState(true);
  const [date, setDate] = useState(activity?.finishedOn || new Date());
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );
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

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        <ActivityProjectList
          projectIds={activity?.projectIds}
          addProjectToActivity={
            !allowAddingProjects ? undefined : addProjectToActivity
          }
          accordionSelectedValue={accordionValue}
          showProjects={showProjects}
        />

        <ActivityMeetingList
          meeting={meeting}
          accordionSelectedValue={accordionValue}
          showMeeting={showMeeting}
        />

        <ActivityNotes
          activity={activity}
          accordionSelectedValue={accordionValue}
          updateNotes={updateNotes}
        />
      </Accordion>
    </div>
  );
};

export default ActivityComponent;
