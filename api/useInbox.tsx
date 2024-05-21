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

const mapInbox: MapInboxFn = ({
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

const fetchInbox = (status: InboxStatus) => async () => {
  const { data, errors } = await client.models.Inbox.listInboxByStatus({
    status,
  });
  if (errors) throw errors;
  return data
    .map(mapInbox)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

const useInbox = (status?: InboxStatus) => {
  const {
    data: inbox,
    error: errorInbox,
    mutate,
  } = useSWR(`/api/inbox/${status}`, fetchInbox(status || "new"));

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

  const moveInboxItemToProject = async (
    inboxId: string,
    createdAt: Date,
    notes: EditorJsonContent,
    projectId: string
  ) => {
    const { data: activity, errors: activityErrors } =
      await client.models.Activity.create({
        finishedOn: createdAt.toISOString(),
        formatVersion: 2,
        notes: null,
        notesJson: JSON.stringify(notes),
      });
    if (activityErrors)
      return handleApiErrors(
        activityErrors,
        "Error creating activity with inbox notes"
      );
    if (!activity) return;

    const { errors: projectActivityErrors } =
      await client.models.ProjectActivity.create({
        activityId: activity.id,
        projectsId: projectId,
      });
    if (projectActivityErrors)
      return handleApiErrors(
        projectActivityErrors,
        "Error linking activity with project"
      );

    const { data, errors } = await client.models.Inbox.update({
      id: inboxId,
      status: "done",
      movedToActivityId: activity.id,
    });
    if (errors)
      return handleApiErrors(errors, "Error updating status of inbox item");

    return data?.id;
  };

  const updateStatus = async (id: string, status: InboxStatus) => {
    const updated = inbox?.map((item) =>
      item.id !== id ? item : { ...item, status }
    );
    mutate(updated, false);
    const { data, errors } = await client.models.Inbox.update({ id, status });
    if (errors) handleApiErrors(errors, "Can't update status");
    mutate(updated);
    return data?.id;
  };

  const makeActionable = (id: string) => updateStatus(id, "actionable");
  const makeNonActionable = (id: string) => updateStatus(id, "notActionable");
  const doNow = (id: string) => updateStatus(id, "doNow");
  const clarifyAction = (id: string) => updateStatus(id, "clarifyAction");
  const isDone = (id: string) => updateStatus(id, "done");
  const moveToProject = (id: string) => updateStatus(id, "moveToProject");
  const clarifyDeletion = (id: string) => updateStatus(id, "clarifyDeletion");

  return {
    inbox,
    errorInbox,
    createInbox,
    updateNote,
    makeActionable,
    makeNonActionable,
    doNow,
    clarifyAction,
    isDone,
    moveToProject,
    clarifyDeletion,
    moveInboxItemToProject,
  };
};

export default useInbox;
