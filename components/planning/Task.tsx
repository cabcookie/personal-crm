import { useProjectsContext } from "@/api/ContextProjects";
import useDailyPlans, { DailyPlanTodo } from "@/api/useDailyPlans";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";

type TaskProps = {
  dailyPlanId: string;
  task: DailyPlanTodo;
};

const Task: FC<TaskProps> = ({ dailyPlanId, task }) => {
  const { finishDailyTask } = useDailyPlans("OPEN");
  const { getProjectNamesByIds } = useProjectsContext();
  const [changing, setChanging] = useState(false);

  const handleCheckedChange = async (checked: CheckedState) => {
    if (checked === "indeterminate") return;
    setChanging(true);
    await finishDailyTask(dailyPlanId, task, checked);
    setChanging(false);
  };

  return (
    <div className="space-y-0">
      <div className="flex flex-row items-start gap-3">
        {changing && <Loader2 className="mt-4 w-4 h-4 min-w-4 animate-spin" />}
        {!changing && (
          <Checkbox
            checked={task.done}
            className="mt-4 w-4 h-4 min-w-4"
            onCheckedChange={handleCheckedChange}
          />
        )}
        <div className="mt-[0.7rem] font-bold">
          {getTextFromEditorJsonContent(task.task)}
        </div>
      </div>
      <Accordion type="single" collapsible>
        <DefaultAccordionItem
          triggerTitle="Projects & Notes"
          triggerSubTitle={getProjectNamesByIds(task.projectIds)}
          value="details"
        >
          <ActivityComponent
            activityId={task.activityId}
            showMeeting
            showProjects
            readOnly
          />
        </DefaultAccordionItem>
      </Accordion>
    </div>
  );
};

export default Task;
