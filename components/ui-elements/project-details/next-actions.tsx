import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Accordion } from "@/components/ui/accordion";
import {
  EditorJsonContent,
  getTextFromEditorJsonContent,
} from "@/helpers/ui-notes-writer";
import { FC, ReactNode, useState } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import RecordDetails from "../record-details/record-details";
import NextAction from "./next-action";

type NextActionHelperProps = {
  title: ReactNode;
  actions?: EditorJsonContent | string;
};

const NextActionHelper: FC<NextActionHelperProps> = ({ actions, title }) => (
  <RecordDetails title={title}>
    {getTextFromEditorJsonContent(actions)}
  </RecordDetails>
);

type NextActionsProps = {
  projectId: string;
  own?: EditorJsonContent | string;
  others?: EditorJsonContent | string;
};

const NextActions: FC<NextActionsProps> = ({ projectId, own, others }) => {
  const { openTasksByProjectId } = useOpenTasksContext();
  const [openTasks] = useState(openTasksByProjectId(projectId));

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      triggerSubTitle={openTasks.map(({ openTask }) =>
        getTextFromEditorJsonContent(openTask)
      )}
      isVisible
    >
      <Accordion type="single" collapsible>
        {openTasks?.map((openTask) => (
          <NextAction
            key={`${openTask.activityId}-${openTask.index}`}
            openTask={openTask}
            showMeeting
          />
        ))}
      </Accordion>

      <div className="flex flex-col md:flex-row gap-4 w-full p-0 m-0">
        <NextActionHelper title="My next actions (LEGACY)" actions={own} />
        <NextActionHelper
          title="Other's next actions (LEGACY)"
          actions={others}
        />
      </div>
    </DefaultAccordionItem>
  );
};

export default NextActions;
