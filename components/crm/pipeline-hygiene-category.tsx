import { CrmProject } from "@/api/useCrmProjects";
import { make2YearsRevenueText } from "@/helpers/projects";
import { filter, flow, map, sum } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import CrmProjectDetails from "../ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "../ui/accordion";
import { THygieneIssue } from "./pipeline-hygiene";

export const categoryPipeline =
  (crmProjects: CrmProject[] | undefined) => (category: THygieneIssue) =>
    flow(
      filter(category.filterFn),
      map((crm) => crm.pipeline),
      sum
    )(crmProjects) ?? 0;

type CrmProjectsPipelineHygieneCategoryProps = {
  crmProjects: CrmProject[] | undefined;
  hygieneCategory: THygieneIssue;
};

const CrmProjectsPipelineHygieneCategory: FC<
  CrmProjectsPipelineHygieneCategoryProps
> = ({ crmProjects, hygieneCategory }) => (
  <DefaultAccordionItem
    value={hygieneCategory.value}
    triggerTitle={hygieneCategory.label}
    triggerSubTitle={[
      `${crmProjects?.length} projects`,
      hygieneCategory.description,
      flow(
        categoryPipeline(crmProjects),
        make2YearsRevenueText
      )(hygieneCategory),
    ]}
    isVisible={!!crmProjects?.length}
  >
    <Accordion type="single" collapsible>
      {crmProjects?.map(({ id }) => (
        <CrmProjectDetails key={id} crmProjectId={id} showProjects />
      ))}
    </Accordion>
  </DefaultAccordionItem>
);

export default CrmProjectsPipelineHygieneCategory;
