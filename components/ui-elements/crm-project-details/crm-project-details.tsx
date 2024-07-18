import useCrmProject from "@/api/useCrmProject";
import { makeCrmLink } from "@/components/crm/CrmLink";
import { formatUsdCurrency } from "@/helpers/functional";
import { getRevenue2Years } from "@/helpers/projects";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import CrmProjectForm from "./CrmProjectForm";

type CrmProjectDetailsProps = {
  crmProjectId: string;
};

const CrmProjectDetails: FC<CrmProjectDetailsProps> = ({ crmProjectId }) => {
  const { crmProject, updateCrmProject } = useCrmProject(crmProjectId);

  return !crmProject ? (
    "Loading..."
  ) : (
    <DefaultAccordionItem
      value={crmProject.id}
      triggerTitle={crmProject.name}
      link={
        crmProject.crmId && crmProject.crmId.length > 6
          ? makeCrmLink("Opportunity", crmProject.crmId)
          : undefined
      }
      triggerSubTitle={[crmProject.stage, getRevenue2Years([crmProject])]}
    >
      <CrmProjectForm crmProject={crmProject} onChange={updateCrmProject} />
      <div>Stage: {crmProject.stage}</div>
      {crmProject.arr > 0 && (
        <div>Annual recurring revenue: {formatUsdCurrency(crmProject.arr)}</div>
      )}
      {crmProject.tcv > 0 && (
        <div>Total contract volume: {formatUsdCurrency(crmProject.tcv)}</div>
      )}
      <div>Close date: {format(crmProject.closeDate, "PPP")}</div>
    </DefaultAccordionItem>
  );
};

export default CrmProjectDetails;
