import useActivity from "@/api/useActivity";
import { FC, useEffect, useState } from "react";
import { debouncedUpdateNotes } from "../ui-elements/activity-helper";
import ActivityMetaData from "../ui-elements/activity-meta-data";
import DateSelector from "../ui-elements/date-selector";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import SavedState from "../ui-elements/project-notes-form/saved-state";
import RecordDetails from "../ui-elements/record-details/record-details";
import MeetingName from "../ui-elements/tokens/meeting-name";
import ProjectName from "../ui-elements/tokens/project-name";

type ActivityComponentProps = {
  activityId: string;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  autoFocus?: boolean;
  createActivity?: (notes?: EditorJsonContent) => Promise<string | undefined>;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activityId,
  showDates,
  showMeeting,
  showProjects,
  autoFocus,
  createActivity,
}) => {
  const { activity, updateNotes, updateDate } = useActivity(activityId);
  const [dateSaved, setDateSaved] = useState(true);
  const [date, setDate] = useState(activity?.finishedOn || new Date());

  useEffect(() => {
    setDate(activity?.finishedOn || new Date());
  }, [activity]);

  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    debouncedUpdateNotes({
      updateNotes,
      createActivity,
      serializer,
    });
  };

  const handleDateUpdate = async (date: Date) => {
    setDateSaved(false);
    setDate(date);
    const data = await updateDate(date);
    if (data) setDateSaved(true);
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {showDates && (
        <h2>
          <DateSelector date={date} setDate={handleDateUpdate} selectHours />
          <SavedState saved={dateSaved} />
        </h2>
      )}
      {showProjects &&
        activity?.projectIds.map((id) => (
          <ProjectName key={id} projectId={id} />
        ))}
      {showMeeting && activity?.meetingId && (
        <MeetingName meetingId={activity.meetingId} />
      )}

      <RecordDetails title="Notes">
        <NotesWriter
          notes={activity?.notes}
          saveNotes={handleNotesUpdate}
          autoFocus={autoFocus}
          key={activityId}
        />
      </RecordDetails>

      <div style={{ padding: "0.3rem 1rem" }}>
        <ActivityMetaData activity={activity} />
      </div>
    </div>
  );
};

export default ActivityComponent;
