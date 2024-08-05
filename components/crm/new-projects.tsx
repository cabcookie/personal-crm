import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import { formatUsdCurrency } from "@/helpers/functional";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import CrmData from "./CrmData";
import LabelData from "./label-data";

type NewCrmProjectsProps = {
  crmProjects: Omit<CrmProject, "id">[];
};

const NewCrmProjects: FC<NewCrmProjectsProps> = ({ crmProjects }) => {
  const { createCrmProject } = useCrmProjects();

  const handleCreate = (crmProject: Omit<CrmProject, "id">) => async () => {
    const result = await createCrmProject({
      ...crmProject,
      id: crypto.randomUUID(),
    });
    if (!result) return;
  };

  return (
    crmProjects.length > 0 && (
      <DefaultAccordionItem
        value="new-crm-projects"
        triggerTitle="New CRM Projects"
        triggerSubTitle={`${crmProjects.length} projects`}
      >
        <Accordion type="single" collapsible>
          {crmProjects.map((crm) => (
            <DefaultAccordionItem
              key={crm.crmId}
              value={crm.crmId ?? ""}
              triggerTitle={crm.name}
            >
              <div className="space-y-2">
                <LabelData data={crm.accountName} />
                <LabelData
                  label="Close date"
                  data={format(crm.closeDate, "PP")}
                />
                <LabelData label="Stage" data={crm.stage} />
                <LabelData label="ARR" data={formatUsdCurrency(crm.arr)} />
                <LabelData label="Next step" data={crm.nextStep} />
                <LabelData label="Partner" data={crm.partnerName} />
                <LabelData label="Owner" data={crm.opportunityOwner} />
                <CrmData crmId={crm.crmId} />
                <LabelData
                  label="Created Date"
                  data={format(crm.createdDate, "PP")}
                />
                <Button onClick={handleCreate(crm)}>Create CRM project</Button>
              </div>
            </DefaultAccordionItem>
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default NewCrmProjects;
