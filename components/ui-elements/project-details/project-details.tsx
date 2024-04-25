import { Project, useProjectsContext } from "@/api/ContextProjects";
import { FC, useEffect, useState } from "react";
import ProjectDates from "./project-dates";
import NextActions from "./next-actions";
import AccountName from "../tokens/account-name";
import SavedState from "../project-notes-form/saved-state";
import styles from "./ProjectDetails.module.css";
import AccountSelector from "../account-selector";

type ProjectDetailsProps = {
  projectId: string;
  includeAccounts?: boolean;
};

const ProjectDetails: FC<ProjectDetailsProps> = ({
  projectId,
  includeAccounts,
}) => {
  const {
    getProjectById,
    saveNextActions,
    saveProjectDates,
    addAccountToProject,
  } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [detailsSaved, setDetailsSaved] = useState(true);

  useEffect(() => {
    setProject(getProjectById(projectId));
  }, [getProjectById, projectId]);

  const handleDateChange = async (props: {
    dueOn?: Date | undefined;
    onHoldTill?: Date | undefined;
    doneOn?: Date | undefined;
  }) => {
    if (!project) return;
    setDetailsSaved(false);
    const data = await saveProjectDates({ projectId: project.id, ...props });
    if (data) setDetailsSaved(true);
    return data;
  };

  const handleSelectAccount = async (accountId: string | null) => {
    if (!project) return;
    if (!accountId) return;
    setDetailsSaved(false);
    const data = await addAccountToProject(project.id, accountId);
    if (data) setDetailsSaved(true);
    return data;
  };

  return (
    project && (
      <div>
        {includeAccounts && (
          <div className={styles.accounts}>
            <h3 className={styles.title}>Accounts</h3>
            {project.accountIds.map((accountId) => (
              <AccountName key={accountId} accountId={accountId} />
            ))}
            <AccountSelector
              allowCreateAccounts
              onChange={handleSelectAccount}
            />
          </div>
        )}
        <ProjectDates project={project} updateDatesFn={handleDateChange} />
        <NextActions
          own={project.myNextActions}
          others={project.othersNextActions}
          saveFn={(own, others) => saveNextActions(project.id, own, others)}
        />
        <SavedState saved={detailsSaved} />
      </div>
    )
  );
};

export default ProjectDetails;
