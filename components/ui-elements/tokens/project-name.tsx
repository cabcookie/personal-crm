import AccountName from "./account-name";
import { FC, useEffect, useState } from "react";
import styles from "./Tokens.module.css";
import { useProjectsContext } from "@/api/ContextProjects";

type ProjectNameProps = {
  projectId: string;
  noLinks?: boolean;
};

const ProjectName: FC<ProjectNameProps> = ({ projectId, noLinks }) => {
  const { getProjectById } = useProjectsContext();
  const [project, setProject] = useState(() => getProjectById(projectId));

  useEffect(() => {
    setProject(getProjectById(projectId));
  }, [getProjectById, projectId]);

  return (
    <div>
      {noLinks ? (
        <div className={styles.projectName}>
          {!project ? "..." : project.project}
        </div>
      ) : (
        <a href={`/projects/${project?.id}`} className={styles.projectName}>
          {!project ? "..." : project.project}
        </a>
      )}
      <div>
        {project?.accountIds?.map(
          (accountId) =>
            accountId && (
              <AccountName
                noLinks={noLinks}
                key={accountId}
                accountId={accountId}
              />
            )
        )}
      </div>
    </div>
  );
};

export default ProjectName;
