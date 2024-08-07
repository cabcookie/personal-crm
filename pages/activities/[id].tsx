import useActivity from "@/api/useActivity";
import ActivityComponent from "@/components/activities/activity";
import MainLayout from "@/components/layouts/MainLayout";
import { format } from "date-fns";
import { useRouter } from "next/router";

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const activityId = Array.isArray(id) ? id[0] : id;
  const { activity } = useActivity(activityId);

  return (
    <MainLayout
      title={`Activity${
        !activity ? "" : ` on ${format(activity.finishedOn, "PPP")}`
      }`}
      recordName={`Activity${
        !activity ? "" : ` on ${format(activity.finishedOn, "PPP")}`
      }`}
      sectionName="Activities"
    >
      <div className="space-y-6">
        {activityId && (
          <ActivityComponent
            activityId={activityId}
            notesNotInAccordion
            showMeeting
            allowAddingProjects
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AccountDetailPage;
