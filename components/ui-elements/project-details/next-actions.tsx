import { OpenTask, useOpenTasksContext } from "@/api/ContextOpenTasks";
import { useProjectsContext } from "@/api/ContextProjects";
import { Accordion } from "@/components/ui/accordion";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { filter, flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import LegacyNextActions from "./legacy-next-actions";
import NextAction from "./next-action";

type NextActionsProps = {
  projectId: string;
};

const NextActions: FC<NextActionsProps> = ({ projectId }) => {
  const { projects } = useProjectsContext();
  const { openTasks: tasks } = useOpenTasksContext();
  const [openTasks] = useState(
    flow(
      filter((task: OpenTask) => task.projectIds.includes(projectId)),
      filter((t) => !t.done)
    )(tasks)
  );
  const [project, setProject] = useState(
    projects?.find((p) => p.id === projectId)
  );

  useEffect(() => {
    setProject(projects?.find((p) => p.id === projectId));
  }, [projects, projectId]);

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      triggerSubTitle={openTasks.map(({ task }) =>
        getTextFromEditorJsonContent(task)
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
