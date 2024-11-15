import { Project } from "@/api/ContextProjects";
import useCurrentUser from "@/api/useUser";
import ActivityFormatBadge from "@/components/activities/activity-format-badge";
import HygieneIssueBadge from "@/components/crm/hygiene-issue-badge";
import { hasHygieneIssues } from "@/components/crm/pipeline-hygiene";
import TaskBadge from "@/components/task/TaskBadge";
import { FC } from "react";

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
  const { user } = useCurrentUser();

  return (
    <div className="flex flex-row gap-2 items-center">
      {crmProjects.some(hasHygieneIssues(user)) && <HygieneIssueBadge />}
      <TaskBadge hasOpenTasks={hasOpenTodos} />
      {hasOldVersionedActivityFormat && <ActivityFormatBadge />}
    </div>
  );
};

export default ProjectBadges;
