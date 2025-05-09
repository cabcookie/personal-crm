import useActivity from "@/api/useActivity";
import ActivityComponent from "@/components/activities/activity";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useEffect } from "react";
import useExtensions from "@/components/ui-elements/editors/notes-editor/useExtensions";
import { nameActivity } from "@/helpers/activity/namer";

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const activityId = Array.isArray(id) ? id[0] : id;
  const { activity } = useActivity(activityId);
  const extensions = useExtensions();

  useEffect(() => {
    if (!activity) return;
    if (!extensions) return;
    nameActivity(activity, extensions);
  }, [activity, extensions]);

  return (
    <MainLayout
      title={
        activity?.name ??
        `Activity${
          !activity ? "" : ` on ${format(activity.finishedOn, "PPP")}`
        }`
      }
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
            showDates
            showMeeting
            allowAddingProjects
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AccountDetailPage;
