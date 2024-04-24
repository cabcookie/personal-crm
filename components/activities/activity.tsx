import { FC, useState } from "react";
import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../ui-elements/notes-writer/notes-writer-helpers";
import { debouncedUpdateNotes } from "../ui-elements/activity-helper";
import useActivity from "@/api/useActivity";
import { toLocaleDateTimeString } from "@/helpers/functional";
import ProjectName from "../ui-elements/tokens/project-name";
import MeetingName from "../ui-elements/tokens/meeting-name";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import ActivityMetaData from "../ui-elements/activity-meta-data";

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
  const { activity, updateNotes } = useActivity(activityId);
  const [notesSaved, setNotesSaved] = useState(true);

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

  return (
    <div style={{ marginBottom: "2rem" }}>
      {showDates && (
        <h2>
          {toLocaleDateTimeString(activity?.finishedOn) ||
            "Create new activity"}
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
