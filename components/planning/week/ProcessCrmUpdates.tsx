import useMrrLatestUpload from "@/api/useLatestUploadsWork";
import ImportProjectData from "@/components/crm/import-project-data";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import { FC } from "react";

interface ProcessCrmUpdatesProps {
  mutateSfdc: ReturnType<typeof useMrrLatestUpload>["mutateSfdc"];
}

const ProcessCrmUpdates: FC<ProcessCrmUpdatesProps> = ({ mutateSfdc }) => (
  <>
    <PlanWeekAction label="Upload Salesforce Opportunities" />
    <ImportProjectData reloader={mutateSfdc} />
  </>
);

export default ProcessCrmUpdates;
