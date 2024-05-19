import useInbox, { Inbox } from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import CheckListItem from "@/components/ui-elements/list-items/checklist-item";
import NotesWriter from "@/components/ui-elements/notes-writer/NotesWriter";
import SubmitButton from "@/components/ui-elements/submit-button";
import { debounce } from "lodash";
import { FC, FormEvent, useState } from "react";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, note: string) => ApiResponse;

const debouncedOnChange = debounce((
    id: string,
    serializer: () => string,
    setSavedNote: (note: string) => void,
    // updateNote: UpdateInboxFn,
    setSaved: (status: boolean) => void
) => {
    const note = serializer();
    // const data = await updateNote(id, note);
    setSavedNote(note);
    // if (!data) return;
    setSaved(true);
}, 1500);

type InputFieldProps = {
    inboxItem: Inbox;
    updateNote: UpdateInboxFn;
    finishItem: () => any;
}

const InputField: FC<InputFieldProps> = ({
    inboxItem: { id, note },
    updateNote,
    finishItem,
}) => {
    const [saved, setSaved] = useState(true);
    const [savedNotes, setSavedNotes] = useState(note);

    const handleUpdate = (serializer: () => string) => {
        setSaved(false);
        debouncedOnChange(id, serializer, setSavedNotes, setSaved);
    }

    return <CheckListItem
        title={(
            <NotesWriter
                notes={note}
                unsaved={!saved}
                saveNotes={handleUpdate}
                title=""
            />
        )}
        description={`v1: ${savedNotes}`}
        switchCheckbox={finishItem}
    />
};

const InboxPage = () => {
    const { inbox, createInbox, updateNote, finishItem } = useInbox();
    const [newItem, setNewItem] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = await createInbox(newItem);
        if (!data) return;
        setNewItem("");
    }

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
                   title={(
                    <NotesWriter
                      notes={newItem}
                      saveNotes={(s) => setNewItem(s())}
                      unsaved={newItem.length > 3}
                      placeholder="What's on your mind?"
                      title=""
                    />
                   )}
                   switchCheckbox={() => {}}
                />
                <SubmitButton type="submit">Confirm</SubmitButton>
            </form>
        </MainLayout>
    );
}

export default InboxPage;
