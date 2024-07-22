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
  openTask: { activityId, index, openTask, projectIds },
  showProjects,
}) => {
  const { getProjectNamesByIds } = useProjectsContext();

  return (
    <DefaultAccordionItem
      value={`${activityId}-${index}`}
      triggerTitle={`Todo: ${getTextFromEditorJsonContent(openTask)}`}
      triggerSubTitle={
        showProjects && projectIds && getProjectNamesByIds(projectIds)
      }
    >
      <ProjectNotesForm activityId={activityId} deleteActivity={() => {}} />
    </DefaultAccordionItem>
  );
};

export default NextAction;
