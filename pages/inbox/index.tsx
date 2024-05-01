import useInbox, { Inbox } from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import Input from "@/components/ui-elements/form-fields/input";
import { useState } from "react";

const makeInboxItem = (): Inbox => ({
    id: crypto.randomUUID(),
    note: "",
    createdAt: new Date(),
})

const InboxPage = () => {
    const {inbox, createInbox, updateNote} = useInbox();
    const [newItem, setNewItem] = useState(makeInboxItem())

    const addInboxItem = async (note: string) => {
        const data = await createInbox(note);
        if (!data) return;
        setNewItem(makeInboxItem());
    }

    const handleUpdate = (id: string) => (note: string) => id === newItem.id ? addInboxItem(note) : updateNote(id, note);

    return (
        <MainLayout title="Inbox" sectionName="Inbox">
            {[...(inbox?.filter(({id}) => id !== newItem.id) || []), newItem].map(({id, note}) => (
                <Input key={id} value={note} onChange={handleUpdate(id)} />
            ))}
        </MainLayout>
    );
}

export default InboxPage;
