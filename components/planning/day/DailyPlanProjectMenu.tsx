import { addProjectDayplan } from "@/api/dayplan/add-project-dayplan";
import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
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
  mutate: (maybe: boolean, refresh: boolean) => void;
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
  mutate,
}) => {
  const addProject = (maybe: boolean) =>
    addProjectDayplan({
      data: {
        dayPlanId: dayPlan.id,
        projectId: dailyPlanProject.projectId,
        maybe,
      },
      options: {
        mutate: (refresh) => mutate(maybe, refresh),
      },
    });

  return (
    <div className="flex flex-wrap gap-1">
      <ButtonPlayPause
        state={dailyPlanProject.maybe ? "PAUSE" : "PLAY"}
        className="h-7 p-1"
        onClick={() => addProject(!dailyPlanProject.maybe)}
      />

      <IconButton
        tooltip="Add todo…"
        label={isTodoFormOpen ? "Close" : "Add Todo"}
        className="w-24 h-7 p-1"
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
        className="w-28 h-7 p-1"
        label={showTodos ? "Hide todos" : "Show todos"}
        onClick={() => setShowTodos((val) => !val)}
      >
        <Square className={cn(!showTodos && "text-gray-300")} />
      </IconButton>

      <IconButton
        tooltip={
          showDonePostPoned ? "Hide done & postponed" : "Show done & postponed"
        }
        label={showDonePostPoned ? "Hide inactive" : "Show inactive"}
        className="w-32 h-7 p-1"
        onClick={() => setShowDonePostPoned((val) => !val)}
      >
        <Check className={cn(!showDonePostPoned && "text-gray-300")} />
      </IconButton>
    </div>
  );
};

export default DailyPlanProjectMenu;
