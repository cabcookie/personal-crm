import { TCrmStages } from "@/api/useCrmProject";
import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import { formatUsdCurrency } from "@/helpers/functional";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import CrmData from "./CrmData";
import LabelData from "./label-data";

type MissingCrmProjectsProps = {
  crmProjects?: CrmProject[];
};

const MissingCrmProjects: FC<MissingCrmProjectsProps> = ({ crmProjects }) => {
  const { closeCrmProject } = useCrmProjects();

  const handleClosing = (id: string, stage: TCrmStages) => async () => {
    const result = await closeCrmProject(id, stage);
    if (!result) return;
  };

  return (
    crmProjects &&
    crmProjects.length > 0 && (
      <DefaultAccordionItem
        value="missing-crm-projects"
        triggerTitle="Missing CRM Projects"
        triggerSubTitle={`${crmProjects.length} projects`}
      >
        <Accordion type="single" collapsible>
          {crmProjects.map((crm) => (
            <DefaultAccordionItem
              key={crm.id}
              value={crm.id}
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
                <CrmData crmId={crm.crmId} label={crm.name} />
                <div className="flex flex-row gap-2">
                  <Button onClick={handleClosing(crm.id, "Closed Lost")}>
                    Set “Closed Lost”
                  </Button>
                  <Button onClick={handleClosing(crm.id, "Launched")}>
                    Set “Launched”
                  </Button>
                </div>
              </div>
            </DefaultAccordionItem>
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default MissingCrmProjects;
