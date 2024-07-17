import { type Schema } from "@/amplify/data/resource";
import { useToast } from "@/components/ui/use-toast";
import {
  EditorJsonContent,
  getTextFromEditorJsonContent,
  SerializerOutput,
  transformNotesVersion,
  transformTasks,
} from "@/helpers/ui-notes-writer";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

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

type Inbox = {
  id: string;
  note: EditorJsonContent;
  hasOpenTasks: boolean;
  openTasks?: EditorJsonContent[];
  closedTasks?: EditorJsonContent[];
  status: InboxStatus;
  createdAt: Date;
};

type MapInboxFn = (data: Schema["Inbox"]["type"]) => Inbox;

export const mapInbox: MapInboxFn = ({
  id,
  note,
  hasOpenTasks,
  openTasks,
  closedTasks,
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
  hasOpenTasks: hasOpenTasks === "true",
  openTasks: transformTasks(openTasks),
  closedTasks: transformTasks(closedTasks),
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
  return data
    .map(mapInbox)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const useInbox = () => {
  const {
    data: inbox,
    error: errorInbox,
    mutate,
  } = useSWR("/api/inbox", fetchInbox);
  const { toast } = useToast();

  const updateNote = async (
    id: string,
    { json: note, hasOpenTasks, openTasks, closedTasks }: SerializerOutput
  ) => {
    const updated: Inbox[] | undefined = inbox?.map((item) =>
      item.id !== id
        ? item
        : { ...item, note, hasOpenTasks, openTasks, closedTasks }
    );
    mutate(updated, false);
    const { data, errors } = await client.models.Inbox.update({
      id,
      note: null,
      formatVersion: 2,
      noteJson: JSON.stringify(note),
      hasOpenTasks: hasOpenTasks ? "true" : "false",
      openTasks: JSON.stringify(openTasks),
      closedTasks: JSON.stringify(closedTasks),
    });
    if (errors) handleApiErrors(errors, "Error updating inbox item");
    mutate(updated);
    return data?.id;
  };

  const createInboxItem = async ({
    json: note,
    hasOpenTasks,
    openTasks,
    closedTasks,
  }: SerializerOutput) => {
    const { data, errors } = await client.models.Inbox.create({
      noteJson: JSON.stringify(note),
      note: null,
      formatVersion: 2,
      hasOpenTasks: hasOpenTasks ? "true" : "false",
      openTasks: JSON.stringify(openTasks),
      closedTasks: JSON.stringify(closedTasks),
      status: "new",
    });
    if (errors) handleApiErrors(errors, "Error creating inbox item");
    if (!data) return;
    toast({
      title: "New Inbox Item Created",
      description: getTextFromEditorJsonContent(note),
    });
    mutate([
      ...(inbox || []),
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        status: "new",
        note,
        hasOpenTasks,
        openTasks,
        closedTasks,
      },
    ]);
    return data.id;
  };

  return {
    inbox,
    errorInbox,
    updateNote,
    createInboxItem,
  };
};

export default useInbox;
