import useInbox, { Inbox } from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import CheckListItem from "@/components/ui-elements/list-items/checklist-item";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import SubmitButton from "@/components/ui-elements/submit-button";
import { debounce } from "lodash";
import { FC, FormEvent, useState } from "react";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, note: EditorJsonContent) => ApiResponse;

const debouncedOnChange = debounce(
  async (
    id: string,
    serializer: () => SerializerOutput,
    updateNote: UpdateInboxFn,
    setSaved: (status: boolean) => void
  ) => {
    const { json: note } = serializer();
    const data = await updateNote(id, note);
    if (!data) return;
    setSaved(true);
  },
  1500
);

type InputFieldProps = {
  inboxItem: Inbox;
  updateNote: UpdateInboxFn;
  finishItem: () => any;
};

const InputField: FC<InputFieldProps> = ({
  inboxItem: { id, note },
  updateNote,
  finishItem,
}) => {
  const [saved, setSaved] = useState(true);

  const handleUpdate = (serializer: () => SerializerOutput) => {
    setSaved(false);
    debouncedOnChange(id, serializer, updateNote, setSaved);
  };

  return (
    <CheckListItem
      title={
        <NotesWriter notes={note} unsaved={!saved} saveNotes={handleUpdate} />
      }
      switchCheckbox={finishItem}
    />
  );
};

const InboxPage = () => {
  const { inbox, createInbox, updateNote, finishItem } = useInbox();
  const [newItem, setNewItem] = useState<EditorJsonContent>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await createInbox(newItem);
    if (!data) return;
    setNewItem({});
  };

  return (
    <MainLayout title="Inbox" sectionName="Inbox">
      {inbox?.map((item) => (
        <InputField
          key={item.id}
          inboxItem={item}
          updateNote={updateNote}
          finishItem={() => finishItem(item.id)}
        />
      ))}
      <form onSubmit={handleSubmit}>
        <CheckListItem
          title={
            <NotesWriter
              notes={newItem}
              saveNotes={(s) => setNewItem(s().json)}
              unsaved={newItem.length > 3}
              placeholder="What's on your mind?"
            />
          }
          switchCheckbox={() => {}}
        />
        <SubmitButton type="submit">Confirm</SubmitButton>
      </form>
    </MainLayout>
  );
};

export default InboxPage;
