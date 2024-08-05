import { CrmProject } from "@/api/useCrmProjects";
import { compact, filter, flow, get, map, uniq } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import CrmProjectDetails from "../ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "../ui/accordion";

type CrmProjectForGrouping = Pick<CrmProject, "accountName" | "partnerName">;

type GroupCrmProjectsProps = {
  crmProjects: CrmProject[] | null;
  propertyName: keyof CrmProjectForGrouping;
};

const GroupCrmProjects: FC<GroupCrmProjectsProps> = ({
  crmProjects,
  propertyName,
}) =>
  flow(
    map(get(propertyName)),
    uniq,
    compact,
    map((company: string) => (
      <DefaultAccordionItem
        value={`${propertyName}-${company}`}
        triggerTitle={company}
      >
        <Accordion type="single" collapsible>
          {flow(
            filter((p: CrmProject) => get(propertyName)(p) === company),
            map(({ id }) => (
              <CrmProjectDetails key={id} crmProjectId={id} showProjects />
            ))
          )(crmProjects)}
        </Accordion>
      </DefaultAccordionItem>
    ))
  )(crmProjects);

export default GroupCrmProjects;
