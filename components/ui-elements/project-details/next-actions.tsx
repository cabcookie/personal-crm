import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { useProjectsContext } from "@/api/ContextProjects";
import { Accordion } from "@/components/ui/accordion";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import LegacyNextActions from "./legacy-next-actions";
import NextAction from "./next-action";

type NextActionsProps = {
  projectId: string;
};

const NextActions: FC<NextActionsProps> = ({ projectId }) => {
  const { projects } = useProjectsContext();
  const { openTasksByProjectId } = useOpenTasksContext();
  const [project, setProject] = useState(
    projects?.find((p) => p.id === projectId)
  );
  const [openTasks] = useState(openTasksByProjectId(projectId));

  useEffect(() => {
    setProject(projects?.find((p) => p.id === projectId));
  }, [projects, projectId]);

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      triggerSubTitle={openTasks.map(({ openTask }) =>
        getTextFromEditorJsonContent(openTask)
      )}
      isVisible={
        openTasks.length > 0 ||
        !!project?.myNextActions ||
        !!project?.othersNextActions
      }
    >
      <Accordion type="single" collapsible>
        {openTasks?.map((openTask) => (
          <NextAction
            key={`${openTask.activityId}-${openTask.index}`}
            openTask={openTask}
          />
        ))}
      </Accordion>

      <LegacyNextActions projectId={projectId} />
    </DefaultAccordionItem>
  );
};

export default NextActions;
