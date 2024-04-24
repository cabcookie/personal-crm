import { Project, useProjectsContext } from "@/api/ContextProjects";
import { FC, useEffect, useState } from "react";
import ProjectDates from "./project-dates";
import NextActions from "./next-actions";
import AccountName from "../tokens/account-name";

type ProjectDetailsProps = {
  projectId: string;
};

const ProjectDetails: FC<ProjectDetailsProps> = ({ projectId }) => {
  const { getProjectById, saveNextActions } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );

  useEffect(() => {
    setProject(getProjectById(projectId));
  }, [getProjectById, projectId]);

  return (
    project && (
      <div>
        {(project.dueOn || project.doneOn) && (
          <ProjectDates dueOn={project.dueOn} doneOn={project.doneOn} />
        )}
        <NextActions
          own={project.myNextActions}
          others={project.othersNextActions}
          saveFn={(own, others) => saveNextActions(project.id, own, others)}
        />
        {project?.accountIds.map((accountId) => (
          <AccountName key={accountId} accountId={accountId} />
        ))}
      </div>
    )
  );
};

export default ProjectDetails;
