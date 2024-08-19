import { type Schema } from "@/amplify/data/resource";
import { getTextFromEditorJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/useExtensions";
import { useToast } from "@/components/ui/use-toast";
import { toISODateTimeString } from "@/helpers/functional";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import { HandleMutationFn, Inbox, InboxStatus, mapInbox } from "./useInbox";
const client = generateClient<Schema>();

export const createInboxItemApi = async (note: EditorJsonContent) => {
  const { data, errors } = await client.models.Inbox.create({
    noteJson: JSON.stringify(note),
    note: null,
    formatVersion: 2,
    status: "new",
  });
  if (errors) handleApiErrors(errors, "Error creating inbox item");
  return data;
};

const useInboxWorkflow = (mutate: HandleMutationFn) => {
  const { toast } = useToast();

  const createInboxItem = async ({ json: note }: SerializerOutput) => {
    const data = await createInboxItemApi(note);
    if (!data) return;
    toast({
      title: "New Inbox Item Created",
      description: getTextFromEditorJsonContent(note),
    });
    mutate({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: "new",
      note,
    });
    return data.id;
  };

  const updateNote =
    (inboxItem: Inbox) =>
    async (id: string, { json: note }: SerializerOutput) => {
      const updated: Inbox = {
        ...inboxItem,
        note,
      };
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
    inboxItem: Inbox,
    projectId: string
  ) => {
    const { data: activity, errors: activityErrors } =
      await client.models.Activity.create({
        finishedOn: toISODateTimeString(inboxItem.createdAt),
        formatVersion: 2,
        notes: null,
        notesJson: JSON.stringify(inboxItem.note),
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
      id: inboxItem.id,
      status: "done",
      movedToActivityId: activity.id,
    });

    if (errors)
      return handleApiErrors(errors, "Error updating status of inbox item");
    return data?.id;
  };

  const updateStatus = async (inboxItem: Inbox, status: InboxStatus) => {
    if (inboxItem) mutate({ ...inboxItem, status }, false);
    const { data, errors } = await client.models.Inbox.update({
      id: inboxItem.id,
      status,
    });
    if (errors) handleApiErrors(errors, "Can't update status");
    if (!data) return;
    mutate(mapInbox(data));
    return data.id;
  };

  return { createInboxItem, updateNote, updateStatus, moveInboxItemToProject };
};

export default useInboxWorkflow;
