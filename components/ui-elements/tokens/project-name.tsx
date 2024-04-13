import AccountName from "./account-name";
import { FC } from "react";
import styles from "./Tokens.module.css";
import useAccounts from "@/api/useAccounts";

type Project = {
  id: string;
  project: string;
  accountIds?: string[];
};

type ProjectNameProps = {
  project: Project;
  noLinks?: boolean;
};

const ProjectName: FC<ProjectNameProps> = ({ project, noLinks }) => {
  const { accounts } = useAccounts();
  return (
    <div>
      {noLinks ? (
        <div className={styles.projectName}>{project?.project}</div>
      ) : (
        <a href={`/projects/${project.id}`} className={styles.projectName}>
          {project?.project}
        </a>
      )}
      <div>
        {project.accountIds
          ?.map((accountId) => accounts?.find(({ id }) => id === accountId))
          ?.map(
            (account) =>
              account && (
                <AccountName
                  noLinks={noLinks}
                  key={account?.id}
                  account={account}
                />
              )
          )}
      </div>
    </div>
  );
};

export default ProjectName;
