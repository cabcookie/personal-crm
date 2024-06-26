import useMeeting from "@/api/useMeeting";
import MainLayout from "@/components/layouts/MainLayout";
import { contexts } from "@/components/navigation-menu/ContextSwitcher";
import ButtonGroup from "@/components/ui-elements/btn-group/btn-group";
import ContextWarning from "@/components/ui-elements/context-warning/context-warning";
import ProjectNotesForm from "@/components/ui-elements/project-notes-form/project-notes-form";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import RecordDetails from "@/components/ui-elements/record-details/record-details";
import DateSelector from "@/components/ui-elements/selectors/date-selector";
import PeopleSelector from "@/components/ui-elements/selectors/people-selector";
import ProjectSelector from "@/components/ui-elements/selectors/project-selector";
import PersonName from "@/components/ui-elements/tokens/person-name";
import { Context } from "@/contexts/ContextContext";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const MeetingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const meetingId: string | undefined = Array.isArray(id) ? id[0] : id;
  const {
    meeting,
    updateMeeting,
    createMeetingParticipant,
    createMeetingActivity,
    updateMeetingContext,
  } = useMeeting(meetingId);
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingOn || new Date()
  );
  const [meetingContext, setMeetingContext] = useState(meeting?.context);
  const [dateTitleSaved, setDateTitleSaved] = useState(true);
  const [participantsSaved, setParticipantsSaved] = useState(true);
  const [contextSaved, setContextSaved] = useState(true);
  const [allSaved, setAllSaved] = useState(true);

  useEffect(() => {
    setAllSaved(dateTitleSaved && participantsSaved && contextSaved);
  }, [dateTitleSaved, participantsSaved, contextSaved]);

  useEffect(() => {
    if (!meeting) return;
    setMeetingDate(meeting.meetingOn);
    setMeetingContext(meeting.context);
  }, [meeting]);

  const debouncedUpdateMeeting = useMemo(
    () =>
      debounce(
        async ({ meetingOn, title }: { meetingOn?: Date; title?: string }) => {
          if (!meeting) return;
          const data = await updateMeeting({
            title: title || meeting.topic,
            meetingOn: meetingOn || meeting.meetingOn,
          });
          if (data) setDateTitleSaved(true);
        },
        1500
      ),
    [updateMeeting, meeting]
  );

  const handleDateChange = (date: Date) => {
    if (!meeting) return;
    setDateTitleSaved(false);
    setMeetingDate(date);
    debouncedUpdateMeeting({
      meetingOn: date,
    });
  };

  const addParticipant = async (personId: string | null) => {
    if (!personId) return;
    setParticipantsSaved(false);
    const data = await createMeetingParticipant(personId);
    if (data) setParticipantsSaved(true);
  };

  const handleBackBtnClick = () => {
    router.push("/meetings");
  };

  const saveMeetingTitle = (newTitle: string) => {
    if (!meeting) return;
    if (newTitle.trim() === meeting.topic.trim()) return;
    setDateTitleSaved(false);
    debouncedUpdateMeeting({ title: newTitle });
  };

  const updateContext = async (context: Context) => {
    if (!meeting) return;
    setContextSaved(false);
    setMeetingContext(context);
    const data = await updateMeetingContext(context);
    if (data) setContextSaved(true);
  };

  const handleSelectProject = (projectId: string | null) =>
    projectId && createMeetingActivity(projectId);

  return (
    <MainLayout
      title={meeting?.topic || "Loading..."}
      recordName={meeting?.topic}
      sectionName="Meetings"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setDateTitleSaved(false)}
      saveTitle={saveMeetingTitle}
    >
      {!meeting ? (
        "Load meeting..."
      ) : (
        <div>
          <SavedState saved={allSaved} />

          <RecordDetails title="Context">
            <ButtonGroup
              values={contexts}
              selectedValue={meeting.context || "family"}
              onSelect={(val: string) => {
                if (!contexts.includes(val as Context)) return;
                updateContext(val as Context);
              }}
            />
            <ContextWarning recordContext={meetingContext} />
          </RecordDetails>

          <RecordDetails title="Meeting on">
            <DateSelector
              date={meetingDate}
              setDate={handleDateChange}
              selectHours
            />
          </RecordDetails>

          <RecordDetails title="Participants">
            {meeting.participantIds.map((id) => (
              <PersonName key={id} personId={id} />
            ))}
            <SavedState saved={participantsSaved} />
            <PeopleSelector value="" onChange={addParticipant} allowNewPerson />
          </RecordDetails>

          {meeting.activityIds.map((id) => (
            <ProjectNotesForm key={id} activityId={id} className="mt-12" />
          ))}

          <strong>Add notes for an additional project</strong>
          <ProjectSelector
            value=""
            onChange={handleSelectProject}
            allowCreateProjects
            placeholder="Add a project…"
          />
          <div className="mb-8" />
        </div>
      )}
    </MainLayout>
  );
};

export default MeetingDetailPage;
