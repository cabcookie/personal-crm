import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import { setProjectList } from "@/helpers/today";
import { FC, useEffect, useState } from "react";
import ShowHideSwitch from "../ui-elements/ShowHideSwitch";
import DayPlanInformation from "./DayPlanInformation";
import DayPlanProjects from "./DayPlanProjects";
import ShowNoTodos from "./ShowNoTodos";

type DailyPlanComponentProps = {
  dailyPlan: DailyPlan;
};

const DailyPlanComponent: FC<DailyPlanComponentProps> = ({ dailyPlan }) => {
  const [projectsOnList, setProjectsOnList] = useState<
    DailyPlanProject[] | undefined
  >();
  const [projectsMaybe, setProjectsMaybe] = useState<
    DailyPlanProject[] | undefined
  >();
  const [showMaybe, setShowMaybe] = useState(false);

  useEffect(() => {
    setProjectList(dailyPlan, false, setProjectsOnList);
    setProjectList(dailyPlan, true, setProjectsMaybe);
  }, [dailyPlan]);

  return (
    <div className="space-y-2">
      <DayPlanInformation
        dayPlan={dailyPlan}
        className="sticky pt-1 top-[6.75rem] md:top-[8.25rem] z-[35] bg-bgTransparent"
      />

      {dailyPlan.projects.length === 0 && (
        <ShowNoTodos className="ml-7 my-8 md:text-center" />
      )}

      <DayPlanProjects
        dayPlan={dailyPlan}
        dayPlanProjects={projectsOnList}
        className="ml-7"
      />

      <ShowHideSwitch
        value={showMaybe}
        onChange={setShowMaybe}
        switchLabel="projects set on maybe"
        className="ml-7 font-semibold"
      />

      {showMaybe && (
        <DayPlanProjects
          dayPlan={dailyPlan}
          dayPlanProjects={projectsMaybe}
          className="ml-7"
        />
      )}
    </div>
  );
};

export default DailyPlanComponent;
