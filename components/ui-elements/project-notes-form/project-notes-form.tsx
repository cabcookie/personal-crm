import useActivity from "@/api/useActivity";
import { FC, useState } from "react";
import { debouncedUpdateNotes } from "../activity-helper";
import ActivityMetaData from "../activity-meta-data";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "../notes-writer/NotesWriter";
import ProjectDetails from "../project-details/project-details";
import ProjectSelector from "../project-selector";
import RecordDetails from "../record-details/record-details";
import ProjectName from "../tokens/project-name";
import SavedState from "./saved-state";

type ProjectNotesFormProps = {
  className?: string;
  activityId: string;
  createActivity?: (notes?: EditorJsonContent) => Promise<string | undefined>;
};

const ProjectNotesForm: FC<ProjectNotesFormProps> = ({
  activityId,
  className,
  createActivity,
}) => {
  const { activity, updateNotes, addProjectToActivity } =
    useActivity(activityId);
  const [notesSaved, setNotesSaved] = useState(true);

  const handleSelectProject = async (projectId: string | null) => {
    if (!projectId) return;
    if (createActivity) {
      const newId = await createActivity();
      if (!newId) return;
      await addProjectToActivity(projectId, newId);
      return;
    }
    if (!activity) return;
    await addProjectToActivity(projectId, activity.id);
  };

  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    if (!updateNotes) return;
    setNotesSaved(false);
    debouncedUpdateNotes({
      serializer,
      setSaveStatus: setNotesSaved,
      updateNotes,
      createActivity,
    });
  };

  return (
    <div className={className}>
      <RecordDetails title="For projects">
        {activity?.projectIds.map((id) => (
          <div key={id}>
            <ProjectName projectId={id} />
            <ProjectDetails projectId={id} />
          </div>
        ))}
        <ProjectSelector onChange={handleSelectProject} allowCreateProjects />
      </RecordDetails>

      <RecordDetails title="Notes">
        <NotesWriter
          notes={activity?.notes || {}}
          saveNotes={handleNotesUpdate}
          unsaved={!notesSaved}
        />
      </RecordDetails>

      <div style={{ padding: "0.3rem 1rem" }}>
        <ActivityMetaData activity={activity} />
        <SavedState saved={notesSaved} />
      </div>
    </div>
  );
};

export default ProjectNotesForm;
