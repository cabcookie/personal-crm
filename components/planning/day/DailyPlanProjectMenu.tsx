import useDailyPlans, {
  DailyPlan,
  DailyPlanProject,
} from "@/api/useDailyPlans";
import { ButtonPlayPause } from "@/components/ui/button-play-pause";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { Check, Plus, Square } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface DailyPlanProjectMenuProps {
  dayPlan: DailyPlan;
  dailyPlanProject: DailyPlanProject;
  isTodoFormOpen: boolean;
  setIsTodoFormOpen: Dispatch<SetStateAction<boolean>>;
  showTodos: boolean;
  setShowTodos: Dispatch<SetStateAction<boolean>>;
  showDonePostPoned: boolean;
  setShowDonePostPoned: Dispatch<SetStateAction<boolean>>;
}

const DailyPlanProjectMenu: FC<DailyPlanProjectMenuProps> = ({
  dayPlan,
  dailyPlanProject,
  isTodoFormOpen,
  setIsTodoFormOpen,
  setShowTodos,
  showTodos,
  showDonePostPoned,
  setShowDonePostPoned,
}) => {
  const { addProjectToDayPlan } = useDailyPlans("OPEN", true);

  const addProject = async (maybe: boolean) => {
    await addProjectToDayPlan(dayPlan.id, dailyPlanProject.projectId, maybe);
  };

  return (
    <div className="flex flex-row gap-1">
      <ButtonPlayPause
        state={dailyPlanProject.maybe ? "PAUSE" : "PLAY"}
        className="w-7 h-7 p-1"
        onClick={() => addProject(!dailyPlanProject.maybe)}
      />

      <IconButton
        tooltip="Add todo…"
        className="w-7 h-7 p-1"
        onClick={() => setIsTodoFormOpen((val) => !val)}
      >
        <Plus
          className={cn(
            !isTodoFormOpen && "text-gray-300",
            isTodoFormOpen && "rotate-45",
            "transition-transform duration-200"
          )}
        />
      </IconButton>

      <IconButton
        tooltip={showTodos ? "Hide todos" : "Show todos"}
        className="w-7 h-7 p-1"
        onClick={() => setShowTodos((val) => !val)}
      >
        <Square className={cn(!showTodos && "text-gray-300")} />
      </IconButton>

      <IconButton
        tooltip={
          showDonePostPoned ? "Hide done & postponed" : "Show done & postponed"
        }
        className="w-7 h-7 p-1"
        onClick={() => setShowDonePostPoned((val) => !val)}
      >
        <Check className={cn(!showDonePostPoned && "text-gray-300")} />
      </IconButton>
    </div>
  );
};

export default DailyPlanProjectMenu;
