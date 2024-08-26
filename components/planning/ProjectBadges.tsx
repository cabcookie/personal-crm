import { Project } from "@/api/ContextProjects";
import { FC } from "react";
import ActivityFormatBadge from "../activities/activity-format-badge";
import HygieneIssueBadge from "../crm/hygiene-issue-badge";
import { hasHygieneIssues } from "../crm/pipeline-hygiene";
import TaskBadge from "../task/TaskBadge";

type ProjectBadgesProps = {
  crmProjects: Project["crmProjects"];
  hasOldVersionedActivityFormat: Project["hasOldVersionedActivityFormat"];
  hasOpenTodos: boolean | undefined;
};

const ProjectBadges: FC<ProjectBadgesProps> = ({
  crmProjects,
  hasOpenTodos,
  hasOldVersionedActivityFormat,
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      {crmProjects.some(hasHygieneIssues) && <HygieneIssueBadge />}
      <TaskBadge hasOpenTasks={hasOpenTodos} />
      {hasOldVersionedActivityFormat && <ActivityFormatBadge />}
    </div>
  );
};

export default ProjectBadges;
