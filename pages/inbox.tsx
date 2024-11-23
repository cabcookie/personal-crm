import CreateInboxItemDialog from "@/components/inbox/CreateInboxItemDialog";
import ProcessInboxItem from "@/components/inbox/ProcessInboxItem";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const InboxPage = () => {
  return (
    <MainLayout title="Inbox" sectionName="Inbox">
      <div className="flex flex-col gap-6">
        <CreateInboxItemDialog
          dialogTrigger={
            <Button>
              <PlusCircle className="w-5 h-5 mr-1" />
              Create Item
            </Button>
          }
        />

        <ContextSwitcher />

        <ProcessInboxItem />
      </div>
    </MainLayout>
  );
};

export default InboxPage;
