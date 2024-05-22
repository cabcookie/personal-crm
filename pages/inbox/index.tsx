import useInbox from "@/api/useInbox";
import WorkFlowItem from "@/components/inbox/WorkflowItem";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import SubmitButton from "@/components/ui-elements/buttons/submit-button";
import listStyles from "@/components/ui-elements/list-items/ListItem.module.css";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import { useContextContext } from "@/contexts/ContextContext";
import { debounce } from "lodash";
import { useState } from "react";
import { GrCycle } from "react-icons/gr";
import styles from "./Inbox.module.css";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, note: EditorJsonContent) => ApiResponse;

export const debouncedOnChangeInboxNote = debounce(
  async (
    id: string,
    serializer: () => SerializerOutput,
    updateNote: UpdateInboxFn
  ) => {
    const { json: note } = serializer();
    const data = await updateNote(id, note);
    if (!data) return;
  },
  1500
);

const InboxPage = () => {
  const { context } = useContextContext();
  const [newItem, setNewItem] = useState<EditorJsonContent | string>("");
  const { inbox, createInbox } = useInbox();

  const onSubmit = async (item: EditorJsonContent) => {
    const data = await createInbox(item);
    if (!data) return;
    setNewItem("");
  };

  return (
    <MainLayout title="Inbox" sectionName="Inbox">
      <ContextSwitcher context={context} />
      <div className={styles.spacer} />

      {inbox?.map((item) => (
        <ToProcessItem
          key={item.id}
          title={
            <WorkFlowItem
              inboxItemId={item.id}
              forwardUrl={`/inbox/${item.id}`}
            />
          }
          actionStep={<GrCycle className={listStyles.listItemIcon} />}
        />
      ))}

      <div>
        <ToProcessItem
          title={
            <NotesWriter
              notes={newItem}
              saveNotes={(s) => setNewItem(s().json)}
              placeholder="What's on your mind?"
              onSubmit={onSubmit}
            />
          }
        />
        <SubmitButton
          onClick={() => {
            if (typeof newItem === "string") return;
            onSubmit(newItem);
          }}
        >
          Confirm
        </SubmitButton>
      </div>
    </MainLayout>
  );
};

export default InboxPage;
