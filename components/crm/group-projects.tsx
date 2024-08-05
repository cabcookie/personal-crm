import { CrmProject } from "@/api/useCrmProjects";
import { invertSign } from "@/helpers/functional";
import { make2YearsRevenueText } from "@/helpers/projects";
import {
  compact,
  filter,
  flow,
  get,
  map,
  size,
  some,
  sortBy,
  sum,
  uniq,
} from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import CrmProjectDetails from "../ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "../ui/accordion";
import HygieneIssueBadge from "./hygiene-issue-badge";
import { hasHygieneIssues } from "./pipeline-hygiene";

type CrmProjectForGrouping = Pick<CrmProject, "accountName" | "partnerName">;
type ValidAccountPropertyNames = keyof CrmProjectForGrouping;

const getCrmProjectsByAccount = (
  propertyName: ValidAccountPropertyNames,
  company: string
) => filter((p: CrmProject) => get(propertyName)(p) === company);

type GroupCrmProjectsProps = {
  crmProjects: CrmProject[] | null;
  propertyName: ValidAccountPropertyNames;
};

const companyPipeline =
  (crmProjects: CrmProject[] | null, propertyName: ValidAccountPropertyNames) =>
  (company: string) =>
    flow(
      filter((crm: CrmProject) => get(propertyName)(crm) === company),
      map((crm) => crm.pipeline),
      sum
    )(crmProjects) ?? 0;

const GroupCrmProjects: FC<GroupCrmProjectsProps> = ({
  crmProjects,
  propertyName,
}) =>
  flow(
    map(get(propertyName)),
    uniq,
    compact,
    sortBy(flow(companyPipeline(crmProjects, propertyName), invertSign)),
    map((company: string) => (
      <DefaultAccordionItem
        value={`${propertyName}-${company}`}
        triggerTitle={company}
        badge={
          flow(
            getCrmProjectsByAccount(propertyName, company),
            some(hasHygieneIssues)
          )(crmProjects) && <HygieneIssueBadge />
        }
        triggerSubTitle={[
          `${flow(
            getCrmProjectsByAccount(propertyName, company),
            size
          )(crmProjects)} projects`,
          flow(
            companyPipeline(crmProjects, propertyName),
            make2YearsRevenueText
          )(company),
        ]}
      >
        <Accordion type="single" collapsible>
          {flow(
            getCrmProjectsByAccount(propertyName, company),
            map(({ id }: CrmProject) => (
              <CrmProjectDetails key={id} crmProjectId={id} showProjects />
            ))
          )(crmProjects)}
        </Accordion>
      </DefaultAccordionItem>
    ))
  )(crmProjects);

export default GroupCrmProjects;
