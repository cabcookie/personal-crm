import useInbox, { Inbox } from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import CheckListItem from "@/components/ui-elements/list-items/checklist-item";
import NotesWriter from "@/components/ui-elements/notes-writer/NotesWriter";
import { TransformNotesToMdFunction, transformMdToNotes } from "@/components/ui-elements/notes-writer/notes-writer-helpers";
import SubmitButton from "@/components/ui-elements/submit-button";
import { debounce } from "lodash";
import { FC, FormEvent, useState } from "react";
import { Descendant } from "slate";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, note: string) => ApiResponse;

const debouncedOnChange = debounce(async (
    id: string,
    descendants: Descendant[],
    transformFn: TransformNotesToMdFunction,
    updateNote: UpdateInboxFn,
    setSaved: (status: boolean) => void
) => {
    const note = transformFn(descendants);
    const data = await updateNote(id, note);
    if (!data) return;
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

    const handleUpdate = (descendants: Descendant[], transformFn: TransformNotesToMdFunction) => {
        setSaved(false);
        debouncedOnChange(id, descendants, transformFn, updateNote, setSaved);
    }

    return <CheckListItem
        title={(
            <NotesWriter
                notes={note}
                unsaved={!saved}
                saveNotes={handleUpdate}
            />
        )}
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
                      saveNotes={(d, t) => setNewItem(t(d))}
                      unsaved={newItem.length > 3}
                      placeholder="What's on your mind?"
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
