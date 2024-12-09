import { make2YearsRevenueText } from "@/helpers/projects";
import { Loader2 } from "lucide-react";
import ApiLoadingError from "../../layouts/ApiLoadingError";
import DefaultAccordionItem from "../../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../../ui/accordion";
import MakeProjectDecision from "../project/MakeProjectDecision";
import {
  usePlanAccountProjects,
  withPlanAccountProjects,
} from "../usePlanAccountProjects";

const PlanWeekContextWork = () => {
  const { accountsProjects, loadingAccounts, errorAccounts, saveProjectDates } =
    usePlanAccountProjects();

  return (
    <div className="space-y-6">
      <ApiLoadingError error={errorAccounts} title="Error loading accounts" />

      {loadingAccounts && (
        <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
      )}

      <Accordion type="single" collapsible>
        {accountsProjects?.map(({ id, name, pipeline, projects }) => (
          <DefaultAccordionItem
            key={id}
            triggerTitle={name}
            triggerSubTitle={[
              `${projects.length} projects`,
              make2YearsRevenueText(pipeline),
            ]}
            value={id}
          >
            <Accordion type="single" collapsible>
              <div className="space-y-6">
                {projects.map((project) => (
                  <MakeProjectDecision
                    key={project.id}
                    project={project}
                    saveOnHoldDate={(onHoldTill) =>
                      saveProjectDates({ projectId: project.id, onHoldTill })
                    }
                  />
                ))}
              </div>
            </Accordion>
          </DefaultAccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default withPlanAccountProjects(PlanWeekContextWork);
