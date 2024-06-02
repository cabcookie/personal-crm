import { calcRevenueTwoYears } from "@/api/ContextProjects";
import useCrmProject from "@/api/useCrmProject";
import { formatUsdCurrency } from "@/helpers/functional";
import { format } from "date-fns";
import { flow } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import CrmProjectForm from "./CrmProjectForm";

type CrmProjectDetailsProps = {
  crmProjectId: string;
  accordionSelectedValue?: string;
};

const CrmProjectDetails: FC<CrmProjectDetailsProps> = ({
  crmProjectId,
  accordionSelectedValue,
}) => {
  const { crmProject, updateCrmProject } = useCrmProject(crmProjectId);

  return !crmProject ? (
    "Loading..."
  ) : (
    <DefaultAccordionItem
      value={crmProject.id}
      accordionSelectedValue={accordionSelectedValue}
      title={
        <div className="flex flex-row gap-2">
          {crmProject.name}
          <CrmProjectForm crmProject={crmProject} onChange={updateCrmProject} />
        </div>
      }
      link={
        crmProject.crmId && crmProject.crmId.length > 6
          ? `https://aws-crm.lightning.force.com/lightning/r/Opportunity/${crmProject.crmId}/view`
          : undefined
      }
      subTitle={
        <>
          <small>{crmProject.stage}</small>
          <small>
            Revenue next 2Ys:{" "}
            {flow(calcRevenueTwoYears, formatUsdCurrency)(crmProject)}
          </small>
        </>
      }
    >
      Stage: {crmProject.stage}
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
