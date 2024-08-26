import useInbox from "@/api/useInbox";
import { useCreateInboxItemContext } from "@/components/inbox/CreateInboxItemDialog";
import WorkFlowItem from "@/components/inbox/WorkflowItem";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/core";
import { debounce } from "lodash";
import { Plus } from "lucide-react";
import { GrCycle } from "react-icons/gr";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, editor: Editor) => ApiResponse;

export const debouncedOnChangeInboxNote = debounce(
  async (id: string, editor: Editor, updateNote: UpdateInboxFn) => {
    const data = await updateNote(id, editor);
    if (!data) return;
  },
  1500
);

const CreateItemButton = () => {
  const { open } = useCreateInboxItemContext();
  return (
    <div>
      <Button onClick={open}>
        <Plus />
        <span>Create Item</span>
      </Button>
    </div>
  );
};

const InboxPage = () => {
  const { inbox, error, mutate, isLoading } = useInbox();

  return (
    <MainLayout title="Inbox" sectionName="Inbox">
      <div className="flex flex-col space-y-6">
        <ApiLoadingError error={error} title="Loading Inbox Items Failed" />

        <CreateItemButton />

        <ContextSwitcher />

        {inbox?.map((item) => (
          <ToProcessItem
            key={item.id}
            title={
              <WorkFlowItem
                inboxItem={item}
                forwardUrl={`/inbox/${item.id}`}
                mutate={mutate}
                isLoading={isLoading}
              />
            }
            actionStep={<GrCycle />}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default InboxPage;
