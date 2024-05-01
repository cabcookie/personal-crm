import useInbox, { Inbox } from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import Input from "@/components/ui-elements/form-fields/input";
import CheckListItem from "@/components/ui-elements/list-items/checklist-item";
import SubmitButton from "@/components/ui-elements/submit-button";
import { debounce } from "lodash";
import { FC, FormEvent, useEffect, useState } from "react";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, note: string) => ApiResponse;

const debouncedOnChange = debounce((
    id: string,
    note: string,
    updateNote: UpdateInboxFn
) => updateNote(id, note), 1500);

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
    const [value, setValue] = useState(note);

    useEffect(() => setValue(note), [note]);

    const handleUpdate = (newValue: string) => {
        setValue(newValue);
        debouncedOnChange(id, newValue, updateNote);
    }

    return <CheckListItem
        title={(
            <Input
                value={value}
                onChange={handleUpdate}
                placeholder="What is on your mind?"
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
                    <Input
                      value={newItem}
                      onChange={setNewItem}
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
