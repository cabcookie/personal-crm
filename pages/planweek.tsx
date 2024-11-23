import useInbox from "@/api/useInbox";
import useMrrLatestUpload from "@/api/useLatestUploadsWork";
import InstructionsUploadMrr from "@/components/analytics/instructions/instructions-upload-mrr";
import { MrrFilterProvider } from "@/components/analytics/useMrrFilter";
import ImportProjectData from "@/components/crm/import-project-data";
import ProcessInboxItem from "@/components/inbox/ProcessInboxItem";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import { PlanningProjectFilterProvider } from "@/components/planning/usePlanningProjectFilter";
import {
  useWeekPlanContext,
  withWeekPlan,
} from "@/components/planning/useWeekPlanContext";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import PlanWeekContextNotWork from "@/components/planning/week/PlanWeekContextNotWork";
import PlanWeekContextWork from "@/components/planning/week/PlanWeekContextWork";
import PlanWeekFilter from "@/components/planning/week/PlanWeekFilter";
import PlanWeekForm from "@/components/planning/week/PlanWeekForm";
import PlanWeekStatistics from "@/components/planning/week/PlanWeekStatistics";
import { Accordion } from "@/components/ui/accordion";
import { useContextContext } from "@/contexts/ContextContext";

const WeeklyPlanningPage = () => {
  const { context } = useContextContext();
  const { error } = useWeekPlanContext();
  const { inbox } = useInbox();
  const { mrrUploadTooOld, mutateMrr, sfdcUploadTooOld, mutateSfdc } =
    useMrrLatestUpload();

  return (
    <MainLayout title="Weekly Planning" sectionName="Weekly Planning">
      <ApiLoadingError error={error} title="Loading Week Plan Failed" />

      <div className="space-y-6">
        <PlanWeekForm />

        <div className="space-y-2">
          <ContextSwitcher />
        </div>

        {inbox && inbox.length > 0 ? (
          <>
            <PlanWeekAction label="Process Inbox Items" />
            <ProcessInboxItem />
          </>
        ) : context === "work" && mrrUploadTooOld ? (
          <>
            <PlanWeekAction label="Upload Customer Financials" />
            <MrrFilterProvider>
              <Accordion type="single" collapsible>
                <InstructionsUploadMrr reloader={mutateMrr} />
              </Accordion>
            </MrrFilterProvider>
          </>
        ) : context === "work" && sfdcUploadTooOld ? (
          <>
            <PlanWeekAction label="Upload Salesforce Opportunities" />
            <ImportProjectData reloader={mutateSfdc} />
          </>
        ) : (
          <>
            <PlanWeekAction label="Review Projects" />
            <PlanningProjectFilterProvider>
              <PlanWeekStatistics />

              <PlanWeekFilter />

              {context !== "work" && <PlanWeekContextNotWork />}
              {context === "work" && <PlanWeekContextWork />}
            </PlanningProjectFilterProvider>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default withWeekPlan(WeeklyPlanningPage);
