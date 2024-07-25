import useDailyPlans, { DailyPlanTodo } from "@/api/useDailyPlans";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { Accordion } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";

type TaskProps = {
  dailyPlanId: string;
  task: DailyPlanTodo;
};

const Task: FC<TaskProps> = ({ dailyPlanId, task }) => {
  const { finishDailyTask } = useDailyPlans("OPEN");
  const [changing, setChanging] = useState(false);

  const handleCheckedChange = async (checked: CheckedState) => {
    if (checked === "indeterminate") return;
    setChanging(true);
    await finishDailyTask(dailyPlanId, task, checked);
    setChanging(false);
  };

  return (
    <div>
      <div className="flex flex-row gap-2 items-start">
        {changing && <Loader2 className="mt-4 w-4 h-4 min-w-4 animate-spin" />}
        {!changing && (
          <Checkbox
            checked={task.done}
            className="mt-4 w-4 h-4 min-w-4"
            onCheckedChange={handleCheckedChange}
          />
        )}
        <div className="w-full">
          <NotesWriter notes={task.task} readonly />
          <Accordion type="single" collapsible>
            <DefaultAccordionItem
              triggerTitle="Show details"
              value="details"
              className="font-normal text-sm"
            >
              <ActivityComponent
                activityId={task.activityId}
                showMeeting
                showProjects
              />
            </DefaultAccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Task;