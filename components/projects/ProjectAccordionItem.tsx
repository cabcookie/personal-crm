import { useAccountsContext } from "@/api/ContextAccounts";
import { Project } from "@/api/ContextProjects";
import { calcRevenueTwoYears, make2YearsRevenueText } from "@/helpers/projects";
import { format } from "date-fns";
import { flow, get, map, sum } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectDetails from "../ui-elements/project-details/project-details";

type ProjectAccordionItemProps = {
  project: Project;
  accordionSelectedValue?: string;
  showNotes?: boolean;
};

const ProjectAccordionItem: FC<ProjectAccordionItemProps> = ({
  project: {
    id: projectId,
    project,
    doneOn,
    dueOn,
    onHoldTill,
    accountIds,
    crmProjects,
  },
  accordionSelectedValue,
  showNotes = true,
}) => {
  const { getAccountById } = useAccountsContext();

  return (
    <DefaultAccordionItem
      value={projectId}
      triggerTitle={project}
      className="tracking-tight"
      accordionSelectedValue={accordionSelectedValue}
      link={`/projects/${projectId}`}
      triggerSubTitle={[
        doneOn && `Done on: ${format(doneOn, "PPP")}`,
        onHoldTill && !doneOn && `On hold till: ${format(onHoldTill, "PPP")}`,
        flow(map(calcRevenueTwoYears), sum, make2YearsRevenueText)(crmProjects),
        dueOn && !doneOn && `Due on: ${format(dueOn, "PPP")}`,
        ...flow(map(getAccountById), map(get("name")))(accountIds),
      ]}
    >
      <ProjectDetails
        projectId={projectId}
        showCrmDetails
        includeAccounts
        showNotes={showNotes}
      />
    </DefaultAccordionItem>
  );
};

export default ProjectAccordionItem;
