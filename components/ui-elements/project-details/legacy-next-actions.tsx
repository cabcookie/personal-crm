import { useProjectsContext } from "@/api/ContextProjects";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";
import NotesWriter from "../notes-writer/NotesWriter";
import { EditorJsonContent } from "../notes-writer/useExtensions";
import DeleteWarning from "../project-notes-form/DeleteWarning";
import RecordDetails from "../record-details/record-details";

type LegacyNextActionsHelperProps = {
  title: string;
  content?: EditorJsonContent;
};

const LegacyNextActionsHelper: FC<LegacyNextActionsHelperProps> = ({
  title,
  content,
}) =>
  content && (
    <div>
      <div>{title}:</div>
      <NotesWriter readonly notes={content} />
    </div>
  );

type LegacyNextActionsProps = {
  projectId: string;
};

const LegacyNextActions: FC<LegacyNextActionsProps> = ({ projectId }) => {
  const { projects, deleteLegacyNextActions } = useProjectsContext();
  const [project, setProject] = useState(
    projects?.find((p) => p.id === projectId)
  );
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    setProject(projects?.find((p) => p.id === projectId));
  }, [projects, projectId]);

  return (
    (project?.myNextActions || project?.othersNextActions) && (
      <RecordDetails title="Legacy Next Actions" className="text-destructive">
        <div className="flex flex-col md:flex-row gap-4 w-full p-0 m-0">
          <DeleteWarning
            open={showDeleteWarning}
            onOpenChange={setShowDeleteWarning}
            confirmText="Are you sure you want to delete the legacy next actions?"
            onConfirm={() => deleteLegacyNextActions(projectId)}
          />

          <div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteWarning(true)}
            >
              Delete
            </Button>
          </div>

          <LegacyNextActionsHelper
            title="Mine"
            content={project?.myNextActions}
          />

          <LegacyNextActionsHelper
            title="Others"
            content={project?.othersNextActions}
          />
        </div>
      </RecordDetails>
    )
  );
};

export default LegacyNextActions;
