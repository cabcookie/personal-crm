import useMeeting from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import useMeetingTodos from "@/api/useMeetingTodos";
import { Context } from "@/contexts/ContextContext";
import { debouncedUpdateMeeting } from "@/helpers/meetings";
import { format } from "date-fns";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { contexts } from "../navigation-menu/ContextSwitcher";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import ContextWarning from "../ui-elements/context-warning/context-warning";
import DateSelector from "../ui-elements/selectors/date-selector";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import MeetingActivityList from "./meeting-activity-list";
import MeetingNextActions from "./meeting-next-actions";
import MeetingParticipants from "./meeting-participants";
import MeetingProjectRecommender from "./meeting-project-recommender";

type MeetingRecordProps = {
  meeting?: Meeting;
  addParticipants?: boolean;
  showContext?: boolean;
  showMeetingDate?: boolean;
  addProjects?: boolean;
};

const MeetingRecord: FC<MeetingRecordProps> = ({
  meeting,
  addParticipants,
  showContext,
  showMeetingDate,
  addProjects,
}) => {
  const [meetingContext, setMeetingContext] = useState(meeting?.context);
  const [immediateTasksDone, setImmediateTasksDone] = useState(
    !!meeting?.immediateTasksDone
  );
  const {
    createMeetingActivity,
    removeMeetingParticipant,
    updateMeetingContext,
    updateMeeting,
    createMeetingParticipant,
    updateImmediateTasksDoneStatus,
  } = useMeeting(meeting?.id);
  const [savingStatus, setSavingStatus] = useState(false);
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingOn || new Date()
  );
  const { meetingTodos, mutate } = useMeetingTodos(meeting?.id);

  useEffect(() => {
    if (!meeting) return;
    setMeetingDate(meeting.meetingOn);
    setMeetingContext(meeting.context);
  }, [meeting]);

  const addParticipant = (personId: string | null) => {
    if (!personId) return;
    createMeetingParticipant(personId);
  };

  const updateContext = (context: Context) => {
    if (!meeting) return;
    setMeetingContext(context);
    updateMeetingContext(context);
  };

  const handleDateChange = (date: Date) => {
    if (!meeting) return;
    debouncedUpdateMeeting(
      meeting,
      updateMeeting
    )({
      meetingOn: date,
    });
  };

  const handleUpdateImmediateTasksDone = async () => {
    const newStatus = !meeting?.immediateTasksDone;
    setSavingStatus(true);
    const result = await updateImmediateTasksDoneStatus(newStatus);
    if (result) {
      setImmediateTasksDone(newStatus);
      setSavingStatus(false);
    }
  };

  const handleSelectProject = (projectId: string | null) =>
    projectId && createMeetingActivity(projectId);

  useEffect(() => {
    setImmediateTasksDone(!!meeting?.immediateTasksDone);
  }, [meeting?.immediateTasksDone]);

  return (
    <div className="space-y-2">
      <Button
        onClick={handleUpdateImmediateTasksDone}
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={savingStatus}
      >
        {savingStatus ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving…
          </>
        ) : immediateTasksDone ? (
          <>
            <Circle className="w-4 h-4" />
            Set meeting open
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Confirm meeting done
          </>
        )}
      </Button>

      {showContext && (
        <div className="space-y-2">
          <h3 className="mx-2 md:mx-4 font-semibold tracking-tight">Context</h3>
          <ButtonGroup
            values={contexts}
            selectedValue={!meeting ? "" : meetingContext || "family"}
            onSelect={(val: string) => {
              if (!contexts.includes(val as Context)) return;
              updateContext(val as Context);
            }}
            disabled={!meeting}
          />
          {meeting && (
            <ContextWarning
              recordContext={meetingContext}
              className="mx-2 md:mx-4"
            />
          )}
        </div>
      )}

      {addParticipants && (
        <PeopleSelector
          placeholder="Add participant…"
          value=""
          onChange={addParticipant}
          allowNewPerson
          disabled={!meeting}
        />
      )}

      {addProjects && (
        <ProjectSelector
          value=""
          onChange={handleSelectProject}
          allowCreateProjects
          placeholder="Add a project…"
          disabled={!meeting}
        />
      )}

      {addProjects && (
        <MeetingProjectRecommender
          meeting={meeting}
          addProjectToMeeting={handleSelectProject}
        />
      )}

      <Accordion type="single" collapsible>
        {showMeetingDate &&
          (!meeting ? (
            <LoadingAccordionItem
              value="loading-date"
              sizeTitle="base"
              sizeSubtitle="xs"
            />
          ) : (
            <DefaultAccordionItem
              value="meeting-date"
              triggerTitle="Meeting on"
              triggerSubTitle={meeting && format(meeting.meetingOn, "PPp")}
            >
              <DateSelector
                date={meetingDate}
                setDate={handleDateChange}
                selectHours
              />
            </DefaultAccordionItem>
          ))}

        {meeting && (
          <>
            <MeetingParticipants
              participantIds={meeting.participantIds}
              addParticipant={!addParticipants ? undefined : addParticipant}
              removeParticipant={removeMeetingParticipant}
            />

            <MeetingNextActions todos={meetingTodos} mutate={mutate} />

            <MeetingActivityList meeting={meeting} />
          </>
        )}
      </Accordion>
    </div>
  );
};

export default MeetingRecord;
