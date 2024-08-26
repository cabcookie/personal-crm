import { type Schema } from "@/amplify/data/resource";
import {
  createAndDeleteBlocksAndTodos,
  updateBlocksAndTodos,
} from "@/components/ui-elements/editors/helpers/block-todo-cud";
import { getBlockIds } from "@/components/ui-elements/editors/helpers/blocks";
import { addAttrsInEditorContent } from "@/components/ui-elements/editors/helpers/cleanup-attrs";
import { deleteAndCreateMentionedPeople } from "@/components/ui-elements/editors/helpers/mentioned-people-cud";
import { createAndDeleteProjectTodos } from "@/components/ui-elements/editors/helpers/project-todo-cud";
import TransactionError from "@/components/ui-elements/editors/helpers/transaction-error";
import { transformNotesVersion } from "@/components/ui-elements/editors/helpers/transformers";
import { UpdateNotesFunction } from "@/components/ui-elements/editors/helpers/update-notes";
import { useToast } from "@/components/ui/use-toast";
import { toISODateTimeString } from "@/helpers/functional";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { useState } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type TempIdMapping = {
  tempId: string;
  id: string;
};

export type Activity = {
  id: string;
  notes: JSONContent;
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
  projectIds: string[];
  projectActivityIds: string[];
  noteBlockIds: (string | null)[] | null;
  oldFormatVersion: boolean;
};

const selectionSet = [
  "id",
  "notes",
  "formatVersion",
  "notesJson",
  "meetingActivitiesId",
  "finishedOn",
  "createdAt",
  "updatedAt",
  "forProjects.id",
  "forProjects.projectsId",
  "noteBlockIds",
  "noteBlocks.id",
  "noteBlocks.content",
  "noteBlocks.type",
  "noteBlocks.todo.id",
  "noteBlocks.todo.todo",
  "noteBlocks.todo.status",
  "noteBlocks.todo.doneOn",
  "noteBlocks.people.id",
  "noteBlocks.people.personId",
] as const;

export type ActivityData = SelectionSet<
  Schema["Activity"]["type"],
  typeof selectionSet
>;
export type NoteBlockData = ActivityData["noteBlocks"][number];
export type ActivityProjectsData = ActivityData["forProjects"][number];

export const mapActivity = (a: ActivityData): Activity => ({
  id: a.id,
  notes: transformNotesVersion(a),
  noteBlockIds:
    a.noteBlockIds?.filter((id) => a.noteBlocks.some((b) => b.id === id)) ??
    null,
  meetingId: a.meetingActivitiesId || undefined,
  finishedOn: new Date(a.finishedOn || a.createdAt),
  updatedAt: new Date(a.updatedAt),
  projectIds: a.forProjects.map(({ projectsId }) => projectsId),
  projectActivityIds: a.forProjects.map(({ id }) => id),
  oldFormatVersion: !a.formatVersion || a.formatVersion < 3,
});

const fetchActivity =
  (activityId?: string) => async (): Promise<Activity | undefined> => {
    if (!activityId) return;
    const { data, errors } = await client.models.Activity.get(
      { id: activityId },
      { selectionSet }
    );
    if (errors) {
      handleApiErrors(errors, "Error loading activity");
      throw errors;
    }
    if (!data) throw new Error("fetchActivity didn't retrieve data");
    try {
      return mapActivity(data);
    } catch (error) {
      console.error("fetchActivity", { error });
      throw error;
    }
  };

const useActivity = (activityId?: string) => {
  const {
    data: activity,
    error: errorActivity,
    isLoading: isLoadingActivity,
    mutate: mutateActivity,
  } = useSWR(`/api/activities/${activityId}`, fetchActivity(activityId));
  const { toast } = useToast();
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false);

  const updateDate = async (date: Date) => {
    if (!activity) return;
    const updated: Activity = {
      ...activity,
      finishedOn: date,
      updatedAt: new Date(),
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activity.id,
      finishedOn: toISODateTimeString(date),
    });
    if (errors) handleApiErrors(errors, "Error updating date of activity");

    mutateActivity(updated);
    return data?.id;
  };

  const addProjectToActivity = async (projectId: string | null) => {
    if (!activity) return;
    if (!projectId) return;
    const updated: Activity = {
      ...activity,
      projectIds: [...activity.projectIds, projectId],
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.ProjectActivity.create({
      activityId: activity.id,
      projectsId: projectId,
    });
    if (errors) handleApiErrors(errors, "Error adding project to current note");
    if (data) toast({ title: "Added note to another project" });
    mutateActivity(updated);
    return data?.id;
  };

  const deleteProjectActivity = async (projectActivityId: string) => {
    if (!activity) return;
    const updated: Activity = {
      ...activity,
      projectActivityIds: activity.projectActivityIds.filter(
        (id) => id !== projectActivityId
      ),
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.ProjectActivity.delete({
      id: projectActivityId,
    });
    if (errors) handleApiErrors(errors, "Deleting notes on project failed");
    mutateActivity(updated);
    if (!data) return;
    toast({ title: "Deleted project notes" });
    return data.id;
  };

  const updateNotes: UpdateNotesFunction = async (editor) => {
    if (isUpdatingActivity) return;
    if (!editor) return;
    if (!activity) return;

    setIsUpdatingActivity(true);

    try {
      /* Ensure each block in the editor has relevant attributes (blockId, todoId, recordId) */
      addAttrsInEditorContent(editor);

      /**
       * Delete and create todos and note blocks where neccessary
       * and update Activity's note block ids
       */
      await createAndDeleteBlocksAndTodos(editor, activity);

      /* Delete and create mentioned people where neccessary and update activity recordId's */
      await deleteAndCreateMentionedPeople(editor, activity);

      /* Update todos and blocks where neccessary */
      await updateBlocksAndTodos(editor, activity);

      /* Create or delete todo projects where neccessary */
      await createAndDeleteProjectTodos(editor, activity);

      const content = editor.getJSON();
      mutateActivity(
        {
          ...activity,
          notes: content,
          noteBlockIds: getBlockIds(content),
          oldFormatVersion: false,
        },
        true
      );
    } catch (error) {
      if (error instanceof TransactionError) {
        console.error(
          "updateNotes",
          error.name,
          error.message,
          error.failedTransaction,
          error.block,
          error.graphQlErrors,
          error.stack
        );
      } else {
        console.error("updateNotes", error);
      }
    } finally {
      setIsUpdatingActivity(false);
    }
  };

  return {
    activity,
    isLoadingActivity,
    errorActivity,
    updateNotes,
    updateDate,
    mutateActivity,
    addProjectToActivity,
    deleteProjectActivity,
  };
};

export type MutateActivityFn = ReturnType<typeof useActivity>["mutateActivity"];
export default useActivity;
