import useCrmProject from "@/api/useCrmProject";
import { CrmProject } from "@/api/useCrmProjects";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Button } from "../ui/button";
import CompareCrmData from "./compare-data";
import CrmData from "./CrmData";

type ChangedCrmProjectProps = {
  imported: Omit<CrmProject, "id">;
  crmProject?: CrmProject;
  confirmUpdate: (crm: CrmProject) => void;
};

const ChangedCrmProject: FC<ChangedCrmProjectProps> = ({
  imported,
  crmProject: crm,
  confirmUpdate,
}) => {
  const { crmProject, updateCrmProject } = useCrmProject(crm?.id);

  const handleUpdateLocalData = async () => {
    if (!crmProject) return;
    const updated: CrmProject = {
      ...imported,
      id: crmProject.id,
    };
    await updateCrmProject(updated);
    confirmUpdate(updated);
  };

  return (
    crmProject && (
      <DefaultAccordionItem value={crmProject.id} triggerTitle={imported.name}>
        <div className="space-y-6">
          <div className="space-y-2">
            <CompareCrmData
              label="Name"
              importedValue={imported.name}
              originalValue={crmProject.name}
            />
            <CompareCrmData
              label="Account name"
              importedValue={imported.accountName}
              originalValue={crmProject.accountName}
            />
            <CompareCrmData
              label="Close Date"
              importedValue={imported.closeDate}
              originalValue={crmProject.closeDate}
            />
            <CompareCrmData
              label="Stage"
              importedValue={imported.stage}
              originalValue={crmProject.stage}
            />
            <CompareCrmData
              label="ARR"
              importedValue={imported.arr}
              originalValue={crmProject.arr}
            />
            <CompareCrmData
              label="Next step"
              importedValue={imported.nextStep}
              originalValue={crmProject.nextStep}
            />
            <CompareCrmData
              label="Partner name"
              importedValue={imported.partnerName}
              originalValue={crmProject.partnerName}
            />
            <CompareCrmData
              label="Opportunity owner"
              importedValue={imported.opportunityOwner}
              originalValue={crmProject.opportunityOwner}
            />
            <CompareCrmData
              label="Territory name"
              importedValue={imported.territoryName}
              originalValue={crmProject.territoryName}
            />
            <CompareCrmData
              label="Opportunity type"
              importedValue={imported.type}
              originalValue={crmProject.type}
            />
            <CompareCrmData
              label="Created Date"
              importedValue={imported.createdDate}
              originalValue={crmProject.createdDate}
            />
            <CrmData crmId={imported.crmId} label={imported.name} />
          </div>
          <Button disabled={!crmProject} onClick={handleUpdateLocalData}>
            {!crmProject && <Loader2 className="w-4 h-4 animate-spin" />}
            Update locally
          </Button>
        </div>
      </DefaultAccordionItem>
    )
  );
};

export default ChangedCrmProject;
