import AccountName from "./account-name";
import { FC, useEffect, useState } from "react";
import styles from "./Tokens.module.css";
import { useProjectsContext } from "@/api/ContextProjects";
import { IoCheckboxSharp } from "react-icons/io5";

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
          {project?.done && <IoCheckboxSharp className={styles.projectDone} />}
          {!project ? "..." : project.project}
          <small style={{ color: "gray" }}>
            {" "}
            {(project?.context || "none").toUpperCase()}
          </small>
        </div>
      ) : (
        <a href={`/projects/${projectId}`} className={styles.projectName}>
          {project?.done && <IoCheckboxSharp className={styles.projectDone} />}
          {!project ? "..." : project.project}
          <small style={{ color: "gray" }}>
            {" "}
            {(project?.context || "none").toUpperCase()}
          </small>
        </a>
      )}
      <div>
        {project?.accountIds.map(
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
