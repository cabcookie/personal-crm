import useMeeting from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import { Context } from "@/contexts/ContextContext";
import { debouncedUpdateMeeting } from "@/helpers/meetings";
import { format } from "date-fns";
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
  const {
    createMeetingActivity,
    removeMeetingParticipant,
    updateMeetingContext,
    updateMeeting,
    createMeetingParticipant,
  } = useMeeting(meeting?.id);
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingOn || new Date()
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

            <MeetingNextActions meeting={meeting} />

            <MeetingActivityList meeting={meeting} />
          </>
        )}
      </Accordion>
    </div>
  );
};

export default MeetingRecord;
