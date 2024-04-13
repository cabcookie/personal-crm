import { FC, useState } from "react";
import ProjectName from "../tokens/project-name";
import ProjectSelector from "../project-selector";
import NotesWriter from "../notes-writer/NotesWriter";
import SavedState from "./saved-state";
import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../notes-writer/notes-writer-helpers";
import ActivityMetaData from "../activity-meta-data";
import { debouncedUpdateNotes } from "../activity-helper";
import useProjects from "@/api/useProjects";
import { useContextContext } from "@/contexts/ContextContext";

type Project = {
  id: string;
};

type Activity = {
  id: string;
  notes?: string;
  projectIds?: string[];
  finishedOn: Date;
  updatedAt: Date;
};

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
  const { context } = useContextContext();
  const { projects } = useProjects(context);
  const [notesSaved, setNotesSaved] = useState(true);

  const handleSelectProject = async (project: Project) => {
    if (!project) return;
    if (createActivity) {
      const newId = await createActivity();
      if (!newId) return;
      await addProjectToActivity(project.id, newId);
      return;
    }
    await addProjectToActivity(project.id, activity.id);
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
      {activity.projectIds
        ?.map((projectId) => projects?.find((p) => p.id === projectId))
        .map(
          (project) =>
            project && <ProjectName project={project} key={project.id} />
        )}
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
