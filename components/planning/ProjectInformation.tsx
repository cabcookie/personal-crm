import { useAccountsContext } from "@/api/ContextAccounts";
import { Project } from "@/api/ContextProjects";
import { calcRevenueTwoYears, make2YearsRevenueText } from "@/helpers/projects";
import { format } from "date-fns";
import { flow, map, sum } from "lodash/fp";
import { FC } from "react";

type ProjectInformationProps = {
  project: Project;
};

const ProjectInformation: FC<ProjectInformationProps> = ({
  project: { accountIds, crmProjects, dueOn, doneOn, partnerId },
}) => {
  const { getAccountNamesByIds } = useAccountsContext();
  return (
    <div className="text-sm tracking-tight text-muted-foreground">
      {accountIds && <div>{getAccountNamesByIds(accountIds)}</div>}
      {crmProjects && (
        <div>
          {flow(
            map(calcRevenueTwoYears),
            sum,
            make2YearsRevenueText
          )(crmProjects)}
        </div>
      )}
      {dueOn && !doneOn && <div>Due on: {format(dueOn, "PPP")}</div>}
      {partnerId && <div>Partner: {getAccountNamesByIds([partnerId])}</div>}
    </div>
  );
};

export default ProjectInformation;
