import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { EditorJsonContent, transformNotesVersion } from "@/components/ui-elements/notes-writer/NotesWriter";
const client = generateClient<Schema>();

export type Inbox = {
    id: string;
    note: EditorJsonContent;
    createdAt: Date;
}

type MapInboxFn = (data: Schema["Inbox"]["type"]) => Inbox;

const mapInbox: MapInboxFn = ({ id, note, createdAt, formatVersion, noteJson }) => ({
    id,
    note: transformNotesVersion({
        version: formatVersion,
        notes: note,
        notesJson: noteJson,
    }),
    createdAt: new Date(createdAt),
})

const fetchInbox = async () => {
    const { data, errors } = await client.models.Inbox.listInboxByDone({ done: "false" });
    if (errors) throw errors;
    return data.map(mapInbox).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

const useInbox = () => {
    const { data: inbox, error: errorInbox, mutate } = useSWR("/api/inbox", fetchInbox);

    const createInbox = async (note: EditorJsonContent) => {
        const updated: Inbox[] = [...(inbox || []), {
            id: crypto.randomUUID(),
            note,
            createdAt: new Date(),
        }]
        mutate(updated, false)
        const { data, errors } = await client.models.Inbox.create({
            noteJson: note,
            formatVersion: 2,
            done: "false",
        })
        if (errors) handleApiErrors(errors, "Error creating inbox item");
        mutate(updated)
        return data?.id;
    }

    const finishItem = async (id: string) => {
        const updated = inbox?.filter((item) => item.id !== id);
        mutate(updated, false);
        const { data, errors } = await client.models.Inbox.update({ id, done: "true" });
        if (errors) handleApiErrors(errors, "Error updating status of inbox item");
        mutate(updated);
        return data?.id;
    }

    const updateNote = async (id: string, note: EditorJsonContent) => {
        const updated = inbox?.map((item) => item.id !== id ? item : { ...item, note });
        mutate(updated, false);
        const { data, errors } = await client.models.Inbox.update({
            id,
            note: null,
            formatVersion: 2,
            noteJson: note,
        });
        if (errors) handleApiErrors(errors, "Error updating inbox item");
        mutate(updated);
        return data?.id;
    };

    return { inbox, errorInbox, createInbox, finishItem, updateNote }
}

export default useInbox;