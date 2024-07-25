import { type Schema } from "@/amplify/data/resource";
import { useToast } from "@/components/ui/use-toast";
import {
  getTextFromEditorJsonContent,
  SerializerOutput,
} from "@/helpers/ui-notes-writer";
import { generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import { HandleMutationFn, Inbox, InboxStatus, mapInbox } from "./useInbox";
const client = generateClient<Schema>();

const useInboxWorkflow = (mutate: HandleMutationFn) => {
  const { toast } = useToast();

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
      status: "new",
    });
    if (errors) handleApiErrors(errors, "Error creating inbox item");

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
      hasOpenTasks,
      openTasks,
      closedTasks,
    });
    return data.id;
  };

  const updateNote =
    (inboxItem: Inbox) =>
    async (
      id: string,
      { json: note, hasOpenTasks, openTasks, closedTasks }: SerializerOutput
    ) => {
      const updated: Inbox = {
        ...inboxItem,
        hasOpenTasks,
        openTasks,
        note,
        closedTasks,
      };
      mutate(updated, false);
      const { data, errors } = await client.models.Inbox.update({
        id,
        note: null,
        formatVersion: 2,
        noteJson: JSON.stringify(note),
        hasOpenTasks: hasOpenTasks ? "true" : "false",
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
        finishedOn: inboxItem.createdAt.toISOString(),
        formatVersion: 2,
        notes: null,
        notesJson: JSON.stringify(inboxItem.note),
        hasOpenTasks: inboxItem.hasOpenTasks ? "true" : "false",
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
