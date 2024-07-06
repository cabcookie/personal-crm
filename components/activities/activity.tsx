import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import useMeeting from "@/api/useMeeting";
import usePeople from "@/api/usePeople";
import { Person } from "@/api/usePerson";
import { format } from "date-fns";
import { filter, flow, map } from "lodash/fp";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
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
import { debouncedUpdateNotes, debounedUpdateDate } from "./activity-helper";
import ActivityMeetingList from "./activity-meeting-list";
import ActivityMetaData from "./activity-meta-data";
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
  const { projects } = useProjectsContext();
  const { people } = usePeople();
  const { getAccountNamesByIds } = useAccountsContext();
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

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        <DefaultAccordionItem
          value="projects"
          triggerTitle="For projects"
          triggerSubTitle={flow(
            filter((p: Project) => !!activity?.projectIds.includes(p.id)),
            map(
              (p) =>
                `${p.project}${
                  !p.accountIds
                    ? ""
                    : ` (${getAccountNamesByIds(p.accountIds)})`
                }`
            )
          )(projects)}
          className="tracking-tight"
          accordionSelectedValue={accordionValue}
          isVisible={showProjects}
        >
          <ActivityProjectList
            projectIds={activity?.projectIds}
            addProjectToActivity={
              !allowAddingProjects ? undefined : addProjectToActivity
            }
          />
        </DefaultAccordionItem>

        <DefaultAccordionItem
          value="meetings"
          triggerTitle="For meeting"
          triggerSubTitle={[
            meeting?.topic,
            meeting?.meetingOn && `On: ${format(meeting?.meetingOn, "PPp")}`,
            ...flow(
              filter(
                (person: Person) =>
                  !!meeting?.participantIds.includes(person.id)
              ),
              map((p) => p.name)
            )(people),
          ]}
          className="tracking-tight"
          accordionSelectedValue={accordionValue}
          isVisible={showMeeting && !!meeting}
        >
          <ActivityMeetingList meeting={meeting} />
        </DefaultAccordionItem>
      </Accordion>

      <NotesWriter
        notes={activity?.notes}
        saveNotes={handleNotesUpdate}
        key={activityId}
      />

      <ActivityMetaData activity={activity} />
    </div>
  );
};

export default ActivityComponent;
