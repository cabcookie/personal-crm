import { CrmProject } from "@/api/useCrmProjects";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import CrmProjectDetails from "../ui-elements/crm-project-details/crm-project-details";
import { Accordion } from "../ui/accordion";
import { THygieneIssue } from "./pipeline-hygiene";

type CrmProjectsPipelineHygieneCategoryProps = {
  crmProjects: CrmProject[] | undefined;
  hygieneCategory: THygieneIssue;
};

const CrmProjectsPipelineHygieneCategory: FC<
  CrmProjectsPipelineHygieneCategoryProps
> = ({ crmProjects, hygieneCategory: { value, label, description } }) => (
  <DefaultAccordionItem
    value={value}
    triggerTitle={label}
    triggerSubTitle={[`${crmProjects?.length} projects`, description]}
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
