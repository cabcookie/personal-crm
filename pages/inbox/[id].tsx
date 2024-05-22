import WorkFlowItem from "@/components/inbox/WorkflowItem";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import listStyles from "@/components/ui-elements/list-items/ListItem.module.css";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import { useContextContext } from "@/contexts/ContextContext";
import { useRouter } from "next/router";
import { GrCycle } from "react-icons/gr";
import styles from "./Inbox.module.css";

const InboxDetailPage = () => {
  const { context } = useContextContext();
  const router = useRouter();
  const { id } = router.query;
  const itemId = Array.isArray(id) ? id[0] : id;

  return (
    <MainLayout title="Process Inbox Item" sectionName="Process Inbox Item">
      <ContextSwitcher context={context} />
      <div className={styles.spacer} />
      {!itemId ? (
        "Loading inbox item..."
      ) : (
        <ToProcessItem
          title={
            <div>
              <WorkFlowItem inboxItemId={itemId} />
            </div>
          }
          actionStep={<GrCycle className={listStyles.listItemIcon} />}
        />
      )}
    </MainLayout>
  );
};

export default InboxDetailPage;
