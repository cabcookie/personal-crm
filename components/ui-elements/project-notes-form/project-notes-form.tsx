import { FC, useState } from "react";
import ProjectName from "../tokens/project-name";
import ProjectSelector from "../project-selector";
import NotesWriter from "../notes-writer/NotesWriter";
import SavedState from "./saved-state";
import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../notes-writer/notes-writer-helpers";
import ActivityMetaData from "../activity-meta-data";
import { debouncedUpdateNotes } from "../activity-helper";
import { Activity } from "@/components/activities/activity";

type ProjectNotesFormProps = {
  className?: string;
  activity: Activity;
  createActivity?: (notes?: string) => Promise<string | undefined>;
  updateActivityNotes: (
    notes: string,
    activityId: string
  ) => Promise<string | undefined>;
  addProjectToActivity: (projectId: string, activityId: string) => void;
};

const ProjectNotesForm: FC<ProjectNotesFormProps> = ({
  activity,
  className,
  createActivity,
  updateActivityNotes,
  addProjectToActivity,
}) => {
  const [notesSaved, setNotesSaved] = useState(true);

  const handleSelectProject = async (projectId: string) => {
    if (!projectId) return;
    if (createActivity) {
      const newId = await createActivity();
      if (!newId) return;
      await addProjectToActivity(projectId, newId);
      return;
    }
    await addProjectToActivity(projectId, activity.id);
  };

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
    <div className={className}>
      {activity.projectIds?.map((projectId) => (
        <ProjectName projectId={projectId} key={projectId} />
      ))}
      <ProjectSelector allowCreateProjects onChange={handleSelectProject} />
      <NotesWriter
        notes={activity?.notes || ""}
        saveNotes={handleNotesUpdate}
        unsaved={!notesSaved}
      />
      <div style={{ padding: "0.3rem 1rem" }}>
        <ActivityMetaData activity={activity} />
        <SavedState saved={notesSaved} />
      </div>
    </div>
  );
};

export default ProjectNotesForm;
