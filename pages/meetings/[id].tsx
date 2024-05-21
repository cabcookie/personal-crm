import useMeeting from "@/api/useMeeting";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import styles from "./Meetings.module.css";
import DateSelector from "@/components/ui-elements/date-selector";
import PersonName from "@/components/ui-elements/tokens/person-name";
import PeopleSelector from "@/components/ui-elements/people-selector";
import ProjectNotesForm from "@/components/ui-elements/project-notes-form/project-notes-form";
import { useEffect, useMemo, useState } from "react";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import { debounce } from "lodash";
import RecordDetails from "@/components/ui-elements/record-details/record-details";
import SelectionSlider from "@/components/ui-elements/selection-slider/selection-slider";
import { contexts } from "@/components/navigation-menu/ContextSwitcher";
import { Context } from "@/contexts/ContextContext";
import ContextWarning from "@/components/ui-elements/context-warning/context-warning";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/NotesWriter";

const MeetingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const meetingId: string | undefined = Array.isArray(id) ? id[0] : id;
  const {
    meeting,
    loadingMeeting,
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
  const [newActivityId, setNewActivityId] = useState(crypto.randomUUID());

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

  const addParticipant = async (personId: string) => {
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

  const saveNewActivity = async (notes?: EditorJsonContent) => {
    const data = await createMeetingActivity(newActivityId, notes);
    setNewActivityId(crypto.randomUUID());
    return data;
  };

  const updateContext = async (context: Context) => {
    if (!meeting) return;
    setContextSaved(false);
    setMeetingContext(context);
    const data = await updateMeetingContext(context);
    if (data) setContextSaved(true);
  };

  return (
    <MainLayout
      title={meeting?.topic || "Loading..."}
      recordName={meeting?.topic}
      sectionName="Meetings"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setDateTitleSaved(false)}
      saveTitle={saveMeetingTitle}
    >
      {loadingMeeting && "Loading meeting..."}
      {meeting && (
        <div>
          <SavedState saved={allSaved} />

          <RecordDetails title="Context">
            <SelectionSlider
              valueList={contexts}
              value={meetingContext}
              onChange={updateContext}
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
            <PeopleSelector
              onChange={addParticipant}
              clearAfterSelection
              allowNewPerson
            />
          </RecordDetails>

          {[
            ...meeting.activityIds.filter((id) => id !== newActivityId),
            newActivityId,
          ].map((id) => (
            <ProjectNotesForm
              key={id}
              activityId={id}
              className={styles.projectNote}
              createActivity={
                id === newActivityId ? saveNewActivity : undefined
              }
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default MeetingDetailPage;
