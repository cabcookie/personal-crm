import { FC, useState } from "react";
import ProjectName from "../ui-elements/tokens/project-name";
import MeetingName from "../ui-elements/tokens/meeting-name";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { TransformNotesToMdFunction } from "../ui-elements/notes-writer/notes-writer-helpers";
import { Descendant } from "slate";
import { debouncedUpdateNotes } from "../ui-elements/activity-helper";
import ActivityMetaData from "../ui-elements/activity-meta-data";
import { useContextContext } from "@/contexts/ContextContext";
import useProjects from "@/api/useProjects";

type Activity = {
  id: string;
  notes: string;
  finishedOn: Date;
  updatedAt: Date;
  projectIds?: string[];
  meetingId?: string;
};

type ActivityComponentProps = {
  activity: Activity;
  updateActivityNotes: (notes: string, activityId: string) => Promise<string>;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  createActivity?: (notes?: string) => Promise<string | undefined>;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activity,
  updateActivityNotes,
  showDates,
  showMeeting,
  showProjects,
  createActivity,
}) => {
  const { context } = useContextContext();
  const { projects } = useProjects(context);
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
      updateNotes: (notes: string) => updateActivityNotes(notes, activity.id),
      createActivity,
    });
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {showDates && (
        <h2>
          {activity?.finishedOn.toLocaleString() || "Create new activity"}
        </h2>
      )}
      {showProjects &&
        activity.projectIds
          ?.map((projectId) => projects?.find((p) => p.id === projectId))
          .map(
            (project) =>
              project && <ProjectName key={project.id} project={project} />
          )}
      {showMeeting && activity.meetingId && (
        <MeetingName meetingId={activity.meetingId} />
      )}
      <NotesWriter
        notes={activity?.notes || ""}
        saveNotes={handleNotesUpdate}
        unsaved={!notesSaved}
        key={activity?.id}
      />
      <div style={{ padding: "0.3rem 1rem" }}>
        <ActivityMetaData activity={activity} />
      </div>
    </div>
  );
};

export default ActivityComponent;
