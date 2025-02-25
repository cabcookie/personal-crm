import { SelectionSet, generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Dispatch, SetStateAction } from "react";
import { client } from "@/pages/projects/[id]/history/index";

export type Project = SelectionSet<
  Schema["Projects"]["type"],
  typeof selectionSet
>;

export const getProject = async (
  projectId: string,
  setProjectName: Dispatch<SetStateAction<string | null>>
): Promise<Project | null> => {
  const { data, errors } = await client.models.Projects.get(
    { id: projectId },
    { selectionSet }
  );
  if (errors || !data) return null;
  setProjectName(data.project);
  return data;
};

const selectionSet = [
  "project",
  "accounts.account.id",
  "accounts.account.name",
  "accounts.account.shortName",
  "accounts.account.createdAt",
  "accounts.account.people.personId",
  "accounts.account.introduction",
  "accounts.account.introductionJson",
  "accounts.account.learnings.id",
  "accounts.account.learnings.learnedOn",
  "accounts.account.learnings.createdAt",
  "accounts.account.learnings.learning",
  "accounts.account.subsidiaries.id",
  "accounts.account.subsidiaries.name",
  "accounts.account.subsidiaries.shortName",
  "accounts.account.subsidiaries.createdAt",
  "accounts.account.subsidiaries.people.personId",
  "accounts.account.subsidiaries.introduction",
  "accounts.account.subsidiaries.introductionJson",
  "accounts.account.subsidiaries.learnings.id",
  "accounts.account.subsidiaries.learnings.learnedOn",
  "accounts.account.subsidiaries.learnings.createdAt",
  "accounts.account.subsidiaries.learnings.learning",
  "accounts.account.subsidiaries.subsidiaries.id",
  "accounts.account.subsidiaries.subsidiaries.name",
  "accounts.account.subsidiaries.subsidiaries.shortName",
  "accounts.account.subsidiaries.subsidiaries.createdAt",
  "accounts.account.subsidiaries.subsidiaries.people.personId",
  "accounts.account.subsidiaries.subsidiaries.introduction",
  "accounts.account.subsidiaries.subsidiaries.introductionJson",
  "accounts.account.subsidiaries.subsidiaries.learnings.id",
  "accounts.account.subsidiaries.subsidiaries.learnings.learnedOn",
  "accounts.account.subsidiaries.subsidiaries.learnings.createdAt",
  "accounts.account.subsidiaries.subsidiaries.learnings.learning",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.id",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.name",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.shortName",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.createdAt",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.people.personId",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.introduction",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.introductionJson",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.learnings.id",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.learnings.learnedOn",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.learnings.createdAt",
  // "accounts.account.subsidiaries.subsidiaries.subsidiaries.learnings.learning",
  "activities.activity.id",
  "activities.activity.finishedOn",
  "activities.activity.createdAt",
  "activities.activity.forMeeting.topic",
  "activities.activity.forMeeting.participants.person.id",
  "activities.activity.forMeeting.participants.person.name",
  "activities.activity.formatVersion",
  "activities.activity.noteBlockIds",
  "activities.activity.noteBlocks.id",
  "activities.activity.noteBlocks.content",
  "activities.activity.noteBlocks.type",
  "activities.activity.noteBlocks.todo.id",
  "activities.activity.noteBlocks.todo.todo",
  "activities.activity.noteBlocks.todo.status",
  "activities.activity.noteBlocks.people.id",
  "activities.activity.noteBlocks.people.personId",
  "activities.activity.notes",
  "activities.activity.notesJson",
] as const;
