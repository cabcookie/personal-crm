import useInbox from "@/api/useInbox";
import useMrrLatestUpload from "@/api/useLatestUploadsWork";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import {
  useWeekPlanContext,
  withWeekPlan,
} from "@/components/planning/useWeekPlanContext";
import PlanWeekForm from "@/components/planning/week/PlanWeekForm";
import ProcessCrmUpdates from "@/components/planning/week/ProcessCrmUpdates";
import ProcessFinancialUpdates from "@/components/planning/week/ProcessFinancialUpdates";
import ProcessInbox from "@/components/planning/week/ProcessInbox";
import ProcessProjects from "@/components/planning/week/ProcessProjects";
import { useContextContext } from "@/contexts/ContextContext";

const WeeklyPlanningPage = () => {
  const { context } = useContextContext();
  const {
    error,
    inboxSkipped,
    financialUpdateSkipped,
    crmUpdateSkipped,
    skipCrmUpdate,
    skipFinancialUpdate,
    skipInbox,
  } = useWeekPlanContext();
  const { inbox } = useInbox();
  const { sfdcUploadTooOld, mutateSfdc, mrrUploadTooOld, mutateMrr } =
    useMrrLatestUpload();

  return (
    <MainLayout title="Weekly Planning" sectionName="Weekly Planning">
      <ApiLoadingError error={error} title="Loading Week Plan Failed" />

      <div className="space-y-6">
        <PlanWeekForm />

        <div className="space-y-2">
          <ContextSwitcher />
        </div>

        {!inboxSkipped && inbox && inbox.length > 0 ? (
          <ProcessInbox {...{ skipInbox }} />
        ) : context === "work" && !financialUpdateSkipped && mrrUploadTooOld ? (
          <ProcessFinancialUpdates {...{ mutateMrr, skipFinancialUpdate }} />
        ) : context === "work" && !crmUpdateSkipped && sfdcUploadTooOld ? (
          <ProcessCrmUpdates {...{ mutateSfdc, skipCrmUpdate }} />
        ) : (
          <ProcessProjects />
        )}
      </div>
    </MainLayout>
  );
};

export default withWeekPlan(WeeklyPlanningPage);
