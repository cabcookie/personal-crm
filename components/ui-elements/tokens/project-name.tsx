import { useProjectsContext } from "@/api/ContextProjects";
import { FC, useEffect, useState } from "react";
import { IoCheckboxSharp } from "react-icons/io5";
import AccountName from "./account-name";

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

  return !project ? (
    "Loading…"
  ) : (
    <div>
      {project.done && <IoCheckboxSharp className="mt-1" />}
      {noLinks ? (
        project.project
      ) : (
        <a href={`/projects/${projectId}`} className="hover:underline">
          {!project ? "..." : project.project}
        </a>
      )}
      {project.accountIds.map((accountId) => (
        <small key={accountId} className="mt-[0.1rem] uppercase">
          <AccountName accountId={accountId} noLinks={noLinks} />
        </small>
      ))}
    </div>
  );
};

export default ProjectName;
