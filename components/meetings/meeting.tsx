import { Meeting } from "@/api/useMeetings";
import { FC, useEffect, useState } from "react";
import { Accordion } from "../ui/accordion";
import MeetingActivityList from "./meeting-activity-list";
import MeetingParticipants from "./meeting-participants";
import useMeeting from "@/api/useMeeting";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import { Context } from "@/contexts/ContextContext";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import { contexts } from "../navigation-menu/ContextSwitcher";
import ContextWarning from "../ui-elements/context-warning/context-warning";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { format } from "date-fns";
import DateSelector from "../ui-elements/selectors/date-selector";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import { debouncedUpdateMeeting } from "@/helpers/meetings";

type MeetingRecordProps = {
  meeting: Meeting;
  addParticipants?: boolean;
  showContext?: boolean;
  showMeetingDate?: boolean;
  addProjects?: boolean;
  hideNotes?: boolean;
};

const MeetingRecord: FC<MeetingRecordProps> = ({
  meeting,
  addParticipants,
  showContext,
  showMeetingDate,
  addProjects,
  hideNotes,
}) => {
  const [meetingContext, setMeetingContext] = useState(meeting?.context);
  const {
    createMeetingActivity,
    updateMeetingContext,
    updateMeeting,
    createMeetingParticipant,
  } = useMeeting(meeting.id);
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingOn || new Date()
  );
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

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

  const handleSelectProject = (projectId: string | null) =>
    projectId && createMeetingActivity(projectId);

  return (
    <div className="space-y-2">
      {showContext && (
        <div className="space-y-2">
          <h3 className="mx-2 md:mx-4 font-semibold tracking-tight">Context</h3>
          <ButtonGroup
            values={contexts}
            selectedValue={meetingContext || "family"}
            onSelect={(val: string) => {
              if (!contexts.includes(val as Context)) return;
              updateContext(val as Context);
            }}
          />
          <ContextWarning
            recordContext={meetingContext}
            className="mx-2 md:mx-4"
          />
        </div>
      )}

      {addParticipants && (
        <PeopleSelector
          placeholder="Add participant…"
          value=""
          onChange={addParticipant}
          allowNewPerson
        />
      )}

      {addProjects && (
        <ProjectSelector
          value=""
          onChange={handleSelectProject}
          allowCreateProjects
          placeholder="Add a project…"
        />
      )}

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {showMeetingDate && (
          <DefaultAccordionItem
            value="meeting-date"
            triggerTitle="Meeting on"
            triggerSubTitle={format(meeting.meetingOn, "PPp")}
          >
            <DateSelector
              date={meetingDate}
              setDate={handleDateChange}
              selectHours
            />
          </DefaultAccordionItem>
        )}

        <MeetingParticipants
          participantIds={meeting.participantIds}
          accordionSelectedValue={accordionValue}
          addParticipant={!addParticipants ? undefined : addParticipant}
        />

        {!hideNotes && (
          <MeetingActivityList
            meeting={meeting}
            accordionSelectedValue={accordionValue}
          />
        )}
      </Accordion>
    </div>
  );
};

export default MeetingRecord;
