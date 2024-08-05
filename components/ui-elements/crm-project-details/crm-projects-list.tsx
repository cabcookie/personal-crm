import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import { Accordion } from "@/components/ui/accordion";
import { useContextContext } from "@/contexts/ContextContext";
import { getRevenue2Years } from "@/helpers/projects";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import CrmProjectForm from "./CrmProjectForm";
import CrmProjectDetails from "./crm-project-details";

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
        isVisible={isVisible}
        triggerSubTitle={
          crmProjects && crmProjects.length > 0 && getRevenue2Years(crmProjects)
        }
      >
        <CrmProjectForm onCreate={onCrmProjectCreate} />
        <div className="mb-2" />

        <Accordion type="single" collapsible>
          {crmProjects.map((crmProject) => (
            <CrmProjectDetails
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
