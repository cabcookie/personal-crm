import { Project, useProjectsContext } from "@/api/ContextProjects";
import { CrmProject } from "@/api/useCrmProjects";
import { invertSign } from "@/helpers/functional";
import { make2YearsRevenueText } from "@/helpers/projects";
import { isFuture } from "date-fns";
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
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import CrmProjectAccordionItem from "../ui-elements/crm-project-details/CrmProjectAccordionItem";
import { Accordion } from "../ui/accordion";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
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

const filterCompanyOnHoldProjects =
  (
    crmProjects: CrmProject[] | null,
    showOnHold: boolean,
    getProjectById: (projectId: string) => Project | undefined,
    propertyName: ValidAccountPropertyNames
  ) =>
  (company: string) =>
    flow(
      getCrmProjectsByAccount(propertyName, company),
      some(
        (crm) =>
          showOnHold ||
          !crm.projectIds.length ||
          flow(
            get("projectIds"),
            map(getProjectById),
            some(flow(get("onHoldTill"), isFuture, (b) => !b))
          )(crm)
      )
    )(crmProjects);

const GroupCrmProjects: FC<GroupCrmProjectsProps> = ({
  crmProjects,
  propertyName,
}) => {
  const [showOnHold, setShowOnHold] = useState(false);
  const { getProjectById } = useProjectsContext();

  return (
    <>
      <div className="mt-2 flex items-center space-x-2">
        <Switch
          id="show-onhold"
          checked={showOnHold}
          onCheckedChange={setShowOnHold}
        />
        <Label htmlFor="show-onhold">Include projects on hold</Label>
      </div>

      {flow(
        map(get(propertyName)),
        uniq,
        compact,
        sortBy(flow(companyPipeline(crmProjects, propertyName), invertSign)),
        filter(
          filterCompanyOnHoldProjects(
            crmProjects,
            showOnHold,
            getProjectById,
            propertyName
          )
        ),
        map((company: string) => (
          <DefaultAccordionItem
            key={`${propertyName}-${company}`}
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
                  <CrmProjectAccordionItem
                    key={id}
                    crmProjectId={id}
                    showProjects
                  />
                ))
              )(crmProjects)}
            </Accordion>
          </DefaultAccordionItem>
        ))
      )(crmProjects)}
    </>
  );
};

export default GroupCrmProjects;
