import { type Schema } from "@/amplify/data/resource";
import {
  EditorJsonContent,
  transformNotesVersion,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type InboxStatus =
  | "new"
  | "actionable"
  | "notActionable"
  | "doNow"
  | "moveToProject"
  | "clarifyDeletion"
  | "clarifyAction"
  | "done";

export const STATUS_LIST: InboxStatus[] = [
  "new",
  "actionable",
  "notActionable",
  "doNow",
  "moveToProject",
  "clarifyAction",
  "clarifyDeletion",
  "done",
];

export const isValidInboxStatus = (status: string): status is InboxStatus =>
  STATUS_LIST.includes(status as InboxStatus);

const mapStatus = (status: string): InboxStatus =>
  isValidInboxStatus(status) ? status : "new";

export type Inbox = {
  id: string;
  note: EditorJsonContent;
  status: InboxStatus;
  createdAt: Date;
};

type MapInboxFn = (data: Schema["Inbox"]["type"]) => Inbox;

export const mapInbox: MapInboxFn = ({
  id,
  note,
  createdAt,
  formatVersion,
  status,
  noteJson,
}) => ({
  id,
  status: mapStatus(status),
  note: transformNotesVersion({
    version: formatVersion,
    notes: note,
    notesJson: noteJson,
  }),
  createdAt: new Date(createdAt),
});

const fetchInbox = async () => {
  const { data, errors } = await client.models.Inbox.listInboxByStatus({
    status: "new",
  });
  if (errors) throw errors;
  return data
    .map(mapInbox)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

const useInbox = () => {
  const {
    data: inbox,
    error: errorInbox,
    mutate,
  } = useSWR("/api/inbox", fetchInbox);

  const createInbox = async (note: EditorJsonContent) => {
    const updated: Inbox[] = [
      ...(inbox || []),
      {
        id: crypto.randomUUID(),
        note,
        status: "new",
        createdAt: new Date(),
      },
    ];
    mutate(updated, false);
    const { data, errors } = await client.models.Inbox.create({
      noteJson: JSON.stringify(note),
      note: null,
      formatVersion: 2,
      status: "new",
    });
    if (errors) handleApiErrors(errors, "Error creating inbox item");
    mutate(updated);
    return data?.id;
  };

  const updateNote = async (id: string, note: EditorJsonContent) => {
    const updated = inbox?.map((item) =>
      item.id !== id ? item : { ...item, note }
    );
    mutate(updated, false);
    const { data, errors } = await client.models.Inbox.update({
      id,
      note: null,
      formatVersion: 2,
      noteJson: JSON.stringify(note),
    });
    if (errors) handleApiErrors(errors, "Error updating inbox item");
    mutate(updated);
    return data?.id;
  };

  return {
    inbox,
    errorInbox,
    createInbox,
    updateNote,
  };
};

export default useInbox;
