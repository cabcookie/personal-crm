import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
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
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [projectsOnList, setProjectsOnList] = useState<
    DailyPlanProject[] | undefined
  >();
  const [projectsMaybe, setProjectsMaybe] = useState<
    DailyPlanProject[] | undefined
  >();
  const [showMaybe, setShowMaybe] = useState(false);

  useEffect(() => {
    setProjectList(dailyPlan, false, accounts, projects, setProjectsOnList);
    setProjectList(dailyPlan, true, accounts, projects, setProjectsMaybe);
  }, [dailyPlan, projects, accounts]);

  return (
    <div className="space-y-2">
      <DayPlanInformation
        dayPlan={dailyPlan}
        className="sticky pt-1 top-[6.75rem] md:top-[8.25rem] z-[35] bg-bgTransparent"
      />

      <div className="ml-7 space-y-6">
        {dailyPlan.projects.length === 0 && (
          <ShowNoTodos className="md:text-center" />
        )}

        <DayPlanProjects dayPlan={dailyPlan} dayPlanProjects={projectsOnList} />

        <ShowHideSwitch
          value={showMaybe}
          onChange={setShowMaybe}
          switchLabel="projects set on maybe"
          className="font-semibold"
        />

        {showMaybe && (
          <DayPlanProjects
            dayPlan={dailyPlan}
            dayPlanProjects={projectsMaybe}
          />
        )}
      </div>
    </div>
  );
};

export default DailyPlanComponent;
