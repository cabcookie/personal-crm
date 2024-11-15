import { Project } from "@/api/ContextProjects";
import { DailyPlanTodo } from "@/api/useDailyPlans";
import {
  getClosedTodos,
  getOpenTodos,
  getPostponedTodos,
} from "@/helpers/dailyplans";
import { FC, useState } from "react";
import ProjectAccordionItem from "../../projects/ProjectAccordionItem";
import ShowHideDonePostponedBtn from "../todos/ShowHideDonePostponedBtn";
import DailyPlanProjectTodos from "./DailyPlanProjectTodos";

type DailyPlanProjectProps = {
  project: Project;
  todos: DailyPlanTodo[];
  className?: string;
};

const DailyPlanProject: FC<DailyPlanProjectProps> = ({ project, todos }) => {
  const [showDonePostPoned, setShowDonePostPoned] = useState(false);

  return (
    <div className="space-y-2">
      <div className="sticky top-[8.75rem] md:top-[10.5rem] z-30 bg-bgTransparent">
        <ProjectAccordionItem project={project} />
      </div>

      <DailyPlanProjectTodos
        status="OPEN"
        todos={getOpenTodos(project, todos)}
      />
      <div className="pt-4 pb-8">
        <ShowHideDonePostponedBtn
          showDonePostponed={showDonePostPoned}
          onSwitch={() => setShowDonePostPoned((val) => !val)}
        />
        {showDonePostPoned && (
          <div className="text-muted-foreground">
            <DailyPlanProjectTodos
              status="DONE"
              todos={getClosedTodos(project, todos)}
            />
            <DailyPlanProjectTodos
              status="POSTPONED"
              todos={getPostponedTodos(project, todos)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPlanProject;
