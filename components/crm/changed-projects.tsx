import { CrmProject } from "@/api/useCrmProjects";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import ChangedCrmProject from "./changed-project";

type ChangedCrmProjectsProps = {
  imported: Omit<CrmProject, "id">[];
  crmProjects: CrmProject[] | undefined;
  confirmUpdate: (crmProjects?: CrmProject[]) => void;
};

const ChangedCrmProjects: FC<ChangedCrmProjectsProps> = ({
  imported,
  crmProjects,
  confirmUpdate,
}) => {
  return (
    crmProjects &&
    imported.length > 0 && (
      <DefaultAccordionItem
        value="changed-crm-projects"
        triggerTitle="Changed CRM Projects"
        triggerSubTitle={`${imported.length} projects`}
      >
        <Accordion type="single" collapsible>
          {imported.map((crm) => (
            <ChangedCrmProject
              key={crm.crmId}
              imported={crm}
              crmProject={crmProjects.find((p) => p.crmId === crm.crmId)}
              confirmUpdate={(crm) =>
                confirmUpdate(
                  crmProjects.map((p) => (p.id !== crm.id ? p : crm))
                )
              }
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default ChangedCrmProjects;
