import useInbox, { Inbox } from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import Input from "@/components/ui-elements/form-fields/input";
import { debounce } from "lodash";
import { FC, useEffect, useState } from "react";

const makeInboxItem = (): Inbox => ({
    id: crypto.randomUUID(),
    note: "",
    createdAt: new Date(),
})

type ApiResponse = Promise<string | undefined>;
type CreateInboxFn = (note: string) => ApiResponse;
type UpdateInboxFn = (id: string, note: string) => ApiResponse;

const debouncedOnChange = debounce((
    id: string,
    note: string,
    createInbox: CreateInboxFn,
    updateNote: UpdateInboxFn,
    isNew: boolean
) => isNew ? createInbox(note) : updateNote(id, note), 1500);

type InputFieldProps = {
    inboxItem: Inbox;
    createInbox: CreateInboxFn;
    updateNote: UpdateInboxFn;
    isNew: boolean;
}

const InputField: FC<InputFieldProps> = ({
    inboxItem: { id, note },
    createInbox,
    updateNote,
    isNew
}) => {
    const [value, setValue] = useState(note);

    useEffect(() => setValue(note), [note]);

    const handleUpdate = (newValue: string) => {
        setValue(newValue);
        debouncedOnChange(id, newValue, createInbox, updateNote, isNew);
    }

    return <Input
        value={value}
        onChange={handleUpdate}
        placeholder="What is on your mind?"
    />
};

const InboxPage = () => {
    const { inbox, createInbox, updateNote } = useInbox();
    const [newItem, setNewItem] = useState(makeInboxItem())

    const addInboxItem = async (note: string) => {
        const data = await createInbox(note);
        if (!data) return;
        setNewItem(makeInboxItem());
        return data;
    }

    return (
        <MainLayout title="Inbox" sectionName="Inbox">
            {[...(inbox?.filter(({id}) => id !== newItem.id) || []), newItem].map((item) => (
                <InputField
                    key={item.id}
                    inboxItem={item}
                    createInbox={addInboxItem}
                    updateNote={updateNote}
                    isNew={item.id === newItem.id}
                />
            ))}
        </MainLayout>
    );
}

export default InboxPage;
