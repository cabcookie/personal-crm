import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import HygieneIssueBadge from "@/components/crm/hygiene-issue-badge";
import { hasHygieneIssues } from "@/components/crm/pipeline-hygiene";
import { Accordion } from "@/components/ui/accordion";
import { useContextContext } from "@/contexts/ContextContext";
import { getRevenue2Years } from "@/helpers/projects";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import CrmProjectAccordionItem from "./CrmProjectAccordionItem";
import CrmProjectForm from "./CrmProjectForm";

type CrmProjectsListProps = {
  isVisible?: boolean;
  crmProjects: CrmProject[];
  projectId?: string;
};

const CrmProjectsList: FC<CrmProjectsListProps> = ({
  isVisible,
  crmProjects,
  projectId,
}) => {
  const { isWorkContext } = useContextContext();
  const { createCrmProject } = useCrmProjects();

  const onCrmProjectCreate = async ({
    arr,
    closeDate,
    name,
    isMarketplace,
    stage,
    tcv,
    crmId,
  }: Partial<CrmProject>) => {
    if (!projectId) return;
    if (!name) return;
    if (!closeDate) return;
    return await createCrmProject({
      id: "new",
      arr: arr || 0,
      closeDate,
      createdDate: new Date(),
      isMarketplace: !!isMarketplace,
      name,
      projectIds: [projectId],
      stage: stage || "Prospect",
      tcv: tcv || 0,
      crmId,
    });
  };

  return (
    isWorkContext() && (
      <DefaultAccordionItem
        value="crmprojects"
        triggerTitle="CRM Projects"
        badge={crmProjects.some(hasHygieneIssues) && <HygieneIssueBadge />}
        isVisible={isVisible}
        triggerSubTitle={
          crmProjects && crmProjects.length > 0 && getRevenue2Years(crmProjects)
        }
      >
        <CrmProjectForm onCreate={onCrmProjectCreate} />
        <div className="mb-2" />

        <Accordion type="single" collapsible>
          {crmProjects.map((crmProject) => (
            <CrmProjectAccordionItem
              key={crmProject.id}
              crmProjectId={crmProject.id}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default CrmProjectsList;
