import { FC, useEffect, useState } from "react";
import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../ui-elements/notes-writer/notes-writer-helpers";
import { debouncedUpdateNotes } from "../ui-elements/activity-helper";
import useActivity from "@/api/useActivity";
import ProjectName from "../ui-elements/tokens/project-name";
import MeetingName from "../ui-elements/tokens/meeting-name";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import ActivityMetaData from "../ui-elements/activity-meta-data";
import DateSelector from "../ui-elements/date-selector";
import SavedState from "../ui-elements/project-notes-form/saved-state";

type ActivityComponentProps = {
  activityId: string;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  autoFocus?: boolean;
  createActivity?: (notes?: string) => Promise<string | undefined>;
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
  const [notesSaved, setNotesSaved] = useState(true);
  const [dateSaved, setDateSaved] = useState(true);
  const [date, setDate] = useState(activity?.finishedOn || new Date());

  useEffect(() => {
    setDate(activity?.finishedOn || new Date());
  }, [activity]);
  const handleNotesUpdate = (
    notes: Descendant[],
    transformerFn: TransformNotesToMdFunction
  ) => {
    setNotesSaved(false);
    debouncedUpdateNotes({
      notes,
      transformerFn,
      setSaveStatus: setNotesSaved,
      updateNotes,
      createActivity,
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
      <NotesWriter
        notes={activity?.notes || ""}
        saveNotes={handleNotesUpdate}
        unsaved={!notesSaved}
        autoFocus={autoFocus}
        key={activityId}
      />
      <div style={{ padding: "0.3rem 1rem" }}>
        <ActivityMetaData activity={activity} />
      </div>
    </div>
  );
};

export default ActivityComponent;
