import useMrrLatestUpload from "@/api/useLatestUploadsWork";
import ImportProjectData from "@/components/crm/import-project-data";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import { FC } from "react";

interface ProcessCrmUpdatesProps {
  mutateSfdc: ReturnType<typeof useMrrLatestUpload>["mutateSfdc"];
  skipCrmUpdate?: () => void;
}

const ProcessCrmUpdates: FC<ProcessCrmUpdatesProps> = ({
  mutateSfdc,
  skipCrmUpdate,
}) => (
  <>
    <PlanWeekAction
      label="Upload Salesforce Opportunities"
      skip={skipCrmUpdate}
    />
    <ImportProjectData reloader={mutateSfdc} />
  </>
);

export default ProcessCrmUpdates;
