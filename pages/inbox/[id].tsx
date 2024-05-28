import WorkFlowItem from "@/components/inbox/WorkflowItem";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import { useRouter } from "next/router";
import { GrCycle } from "react-icons/gr";

const InboxDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const itemId = Array.isArray(id) ? id[0] : id;

  return (
    <MainLayout title="Process Inbox Item" sectionName="Process Inbox Item">
      <ContextSwitcher />
      <div className="mt-12" />
      {!itemId ? (
        "Loading inbox item..."
      ) : (
        <ToProcessItem
          title={
            <div>
              <WorkFlowItem inboxItemId={itemId} />
            </div>
          }
          actionStep={<GrCycle />}
        />
      )}
    </MainLayout>
  );
};

export default InboxDetailPage;
