import { type Schema } from "@/amplify/data/resource";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/useExtensions";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type HandleMutationFn = (item: Inbox, callApi?: boolean) => void;

const STATUS_LIST = [
  "new",
  "actionable",
  "notActionable",
  "doNow",
  "moveToProject",
  "clarifyAction",
  "clarifyDeletion",
  "done",
] as const;

export type InboxStatus = (typeof STATUS_LIST)[number];

const isValidInboxStatus = (status: string): status is InboxStatus =>
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
    formatVersion,
    notes: note,
    notesJson: noteJson,
  }),
  createdAt: new Date(createdAt),
});

const fetchInbox = async () => {
  const { data, errors } = await client.models.Inbox.listInboxByStatus({
    status: "new",
  });
  if (errors) {
    handleApiErrors(errors, "Error loading inbox items");
    throw errors;
  }
  try {
    return data
      .map(mapInbox)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("fetchInbox", { error });
    throw error;
  }
};

const useInbox = () => {
  const {
    data: inbox,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/inbox", fetchInbox);

  const handleMutation: HandleMutationFn = (item, callApi = true) => {
    const updated: Inbox[] | undefined = inbox?.map((i) =>
      i.id !== item.id ? i : item
    );
    if (updated) mutate(updated, callApi);
  };

  return {
    inbox,
    error,
    isLoading,
    mutate: handleMutation,
  };
};

export default useInbox;
