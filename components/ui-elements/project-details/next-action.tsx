import { OpenTask } from "@/api/ContextOpenTasks";
import { useProjectsContext } from "@/api/ContextProjects";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import ProjectNotesForm from "../project-notes-form/project-notes-form";

type NextActionProps = {
  openTask: OpenTask;
  showProjects?: boolean;
};

const NextAction: FC<NextActionProps> = ({
  openTask: { activityId, index, task, projectIds },
  showProjects,
}) => {
  const { getProjectNamesByIds } = useProjectsContext();

  return (
    <DefaultAccordionItem
      value={`${activityId}-${index}`}
      triggerTitle={`Todo: ${getTextFromEditorJsonContent(task)}`}
      triggerSubTitle={
        showProjects && projectIds && getProjectNamesByIds(projectIds)
      }
    >
      <ProjectNotesForm activityId={activityId} hideProjects={!showProjects} />
    </DefaultAccordionItem>
  );
};

export default NextAction;
