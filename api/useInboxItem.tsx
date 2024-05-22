import { type Schema } from "@/amplify/data/resource";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/NotesWriter";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { InboxStatus, mapInbox } from "./useInbox";
const client = generateClient<Schema>();

const fetchInboxItem = (itemId?: string) => async () => {
  if (!itemId) return;
  const { data, errors } = await client.models.Inbox.get({ id: itemId });
  if (errors) throw errors;
  if (!data) throw new Error("fetchInboxItem didn't retrieve data");
  return mapInbox(data);
};

const useInboxItem = (itemId?: string) => {
  const {
    data: inboxItem,
    error: errorInboxItem,
    isLoading: loadingInboxItem,
    mutate,
  } = useSWR(`/api/inbox/${itemId}`, fetchInboxItem(itemId));

  const updateNote = async (id: string, note: EditorJsonContent) => {
    const { data, errors } = await client.models.Inbox.update({
      id,
      note: null,
      formatVersion: 2,
      noteJson: JSON.stringify(note),
    });
    if (errors) handleApiErrors(errors, "Error updating inbox item");
    if (!data) return;
    const updated = mapInbox(data);
    mutate(updated);
    return data.id;
  };

  const moveInboxItemToProject = async (projectId: string) => {
    if (!inboxItem) return;

    const { data: activity, errors: activityErrors } =
      await client.models.Activity.create({
        finishedOn: inboxItem.createdAt.toISOString(),
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

  const updateStatus = async (id: string, status: InboxStatus) => {
    if (inboxItem) mutate({ ...inboxItem, status }, false);
    const { data, errors } = await client.models.Inbox.update({ id, status });
    if (errors) handleApiErrors(errors, "Can't update status");
    if (!data) return;
    mutate(mapInbox(data));
    return data.id;
  };

  return {
    inboxItem,
    errorInboxItem,
    loadingInboxItem,
    updateNote,
    moveInboxItemToProject,
    updateStatus,
  };
};

export default useInboxItem;
