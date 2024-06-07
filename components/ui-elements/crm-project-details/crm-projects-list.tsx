import { CrmProjectData } from "@/api/ContextProjects";
import { CrmProjectOnChangeFields } from "@/api/useCrmProject";
import useCrmProjects, { getRevenue2Years } from "@/api/useCrmProjects";
import { Accordion } from "@/components/ui/accordion";
import { useContextContext } from "@/contexts/ContextContext";
import { FC, useState } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import CrmProjectForm from "./CrmProjectForm";
import CrmProjectDetails from "./crm-project-details";

type CrmProjectsListProps = {
  accordionSelectedValue?: string;
  isVisible?: boolean;
  crmProjects: CrmProjectData[];
  projectId?: string;
};

const CrmProjectsList: FC<CrmProjectsListProps> = ({
  accordionSelectedValue,
  isVisible,
  crmProjects,
  projectId,
}) => {
  const { isWorkContext } = useContextContext();
  const { createCrmProject } = useCrmProjects();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const onCrmProjectCreate = async ({
    arr,
    closeDate,
    name,
    isMarketplace,
    stage,
    tcv,
    crmId,
  }: CrmProjectOnChangeFields) => {
    if (!projectId) return;
    if (!name) return;
    if (!closeDate) return;
    return await createCrmProject({
      id: "new",
      arr: arr || 0,
      closeDate,
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
        accordionSelectedValue={accordionSelectedValue}
        isVisible={isVisible}
        triggerSubTitle={getRevenue2Years(crmProjects)}
      >
        <CrmProjectForm onCreate={onCrmProjectCreate} />
        <div className="mb-2" />

        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          {crmProjects.map((crmProject) => (
            <CrmProjectDetails
              key={crmProject.id}
              crmProjectId={crmProject.id}
              accordionSelectedValue={accordionValue}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default CrmProjectsList;
