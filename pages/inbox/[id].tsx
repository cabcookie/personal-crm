import useInboxItem from "@/api/useInboxItem";
import WorkFlowItem from "@/components/inbox/WorkflowItem";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import { useRouter } from "next/router";
import { GrCycle } from "react-icons/gr";

const InboxDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const itemId = Array.isArray(id) ? id[0] : id;
  const { inboxItem, error, isLoading, mutate } = useInboxItem(itemId);

  return (
    <MainLayout title="Process Inbox Item" sectionName="Process Inbox Item">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Inbox Item Failed" />

        <ContextSwitcher />

        <ToProcessItem
          title={
            <div>
              <WorkFlowItem
                inboxItem={inboxItem}
                isLoading={isLoading}
                mutate={mutate}
              />
            </div>
          }
          actionStep={<GrCycle />}
        />
      </div>
    </MainLayout>
  );
};

export default InboxDetailPage;
