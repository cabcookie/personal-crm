import { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser, { User } from "@/api/useUser";
import { make2YearsRevenueText } from "@/helpers/projects";
import { filter, flow, map, sum } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import CrmProjectAccordionItem from "../ui-elements/crm-project-details/CrmProjectAccordionItem";
import { Accordion } from "../ui/accordion";
import { THygieneIssue } from "./pipeline-hygiene";

export const categoryPipeline =
  (user: User | undefined, crmProjects: CrmProject[] | undefined) =>
  (category: THygieneIssue) =>
    flow(
      filter(category.filterFn(user)),
      map((crm) => crm.pipeline),
      sum
    )(crmProjects) ?? 0;

type CrmProjectsPipelineHygieneCategoryProps = {
  crmProjects: CrmProject[] | undefined;
  hygieneCategory: THygieneIssue;
};

const CrmProjectsPipelineHygieneCategory: FC<
  CrmProjectsPipelineHygieneCategoryProps
> = ({ crmProjects, hygieneCategory }) => {
  const { user } = useCurrentUser();

  return (
    <DefaultAccordionItem
      value={hygieneCategory.value}
      triggerTitle={hygieneCategory.label}
      triggerSubTitle={[
        `${crmProjects?.length} projects`,
        hygieneCategory.description,
        flow(
          categoryPipeline(user, crmProjects),
          make2YearsRevenueText
        )(hygieneCategory),
      ]}
      isVisible={!!crmProjects?.length}
    >
      <div className="text-gray-400 font-semibold">
        {hygieneCategory.description}
      </div>

      <Accordion type="single" collapsible>
        {crmProjects?.map(({ id }) => (
          <CrmProjectAccordionItem key={id} crmProjectId={id} showProjects />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default CrmProjectsPipelineHygieneCategory;
