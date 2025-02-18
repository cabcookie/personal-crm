import useMrrLatestUpload from "@/api/useLatestUploadsWork";
import InstructionsUploadMrr from "@/components/analytics/instructions/instructions-upload-mrr";
import { MrrFilterProvider } from "@/components/analytics/useMrrFilter";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import { Accordion } from "@/components/ui/accordion";
import { FC } from "react";

interface ProcessFinancialUpdatesProps {
  mutateMrr: ReturnType<typeof useMrrLatestUpload>["mutateMrr"];
  skipFinancialUpdate?: () => void;
}

const ProcessFinancialUpdates: FC<ProcessFinancialUpdatesProps> = ({
  mutateMrr,
  skipFinancialUpdate,
}) => (
  <>
    <PlanWeekAction
      label="Upload Customer Financials"
      skip={skipFinancialUpdate}
    />
    <MrrFilterProvider>
      <Accordion type="single" collapsible>
        <InstructionsUploadMrr reloader={mutateMrr} />
      </Accordion>
    </MrrFilterProvider>
  </>
);

export default ProcessFinancialUpdates;
