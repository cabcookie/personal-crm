import { FC, useState } from "react";
import ProjectDetails from "../ui-elements/project-details/project-details";
import ProjectSelector from "../ui-elements/project-selector";
import ProjectName from "../ui-elements/tokens/project-name";
import { Button } from "../ui/button";
import styles from "./Inbox.module.css";
import { WorkflowStepComponentProps } from "./workflow";

const ClarifyAction: FC<WorkflowStepComponentProps> = ({
  responses,
  action,
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const respondProjectSelected = async (projectId: string | null) => {
    if (!projectId) return;
    if (!responses) return;
    if (responses.length !== 1 && responses[0].response !== "next") return;
    await action(responses[0], projectId);
  };

  return (
    <div>
      <ProjectSelector
        placeholder="Select project…"
        onChange={setSelectedProject}
        allowCreateProjects
      />
      {selectedProject && (
        <div>
          <ProjectName projectId={selectedProject} />
          <ProjectDetails projectId={selectedProject} includeAccounts />
          <Button onClick={() => respondProjectSelected(selectedProject)}>
            Confirm Changes
          </Button>
        </div>
      )}
      <div className={styles.spacer}>
        <strong>Inbox Notes (will be moved to selected project):</strong>
      </div>
    </div>
  );
};

export default ClarifyAction;
