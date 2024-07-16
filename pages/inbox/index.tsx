import useInbox from "@/api/useInbox";
import { useCreateInboxItemContext } from "@/components/inbox/CreateInboxItemDialog";
import WorkFlowItem from "@/components/inbox/WorkflowItem";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import { Button } from "@/components/ui/button";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { debounce } from "lodash";
import { Plus } from "lucide-react";
import { GrCycle } from "react-icons/gr";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (
  id: string,
  editorContent: SerializerOutput
) => ApiResponse;

export const debouncedOnChangeInboxNote = debounce(
  async (
    id: string,
    serializer: () => SerializerOutput,
    updateNote: UpdateInboxFn
  ) => {
    const serializedOutput = serializer();
    const data = await updateNote(id, serializedOutput);
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
  const { inbox } = useInbox();

  return (
    <MainLayout title="Inbox" sectionName="Inbox">
      <CreateItemButton />

      <div className="mt-12" />
      <ContextSwitcher />
      <div className="mt-12" />

      {inbox?.map((item) => (
        <ToProcessItem
          key={item.id}
          title={
            <WorkFlowItem
              inboxItemId={item.id}
              forwardUrl={`/inbox/${item.id}`}
            />
          }
          actionStep={<GrCycle />}
        />
      ))}
    </MainLayout>
  );
};

export default InboxPage;
