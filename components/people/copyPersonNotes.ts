import { subMonths, format, isAfter, isBefore } from "date-fns";
import { client } from "@/lib/amplify";
import { SelectionSet } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import {
  compact,
  filter,
  flow,
  identity,
  map,
  get,
  sortBy,
  uniq,
  uniqBy,
} from "lodash/fp";
import { handleApiErrors } from "@/api/globals";
import { createDocument } from "@/components/ui-elements/editors/helpers/transformers";
import { getMarkdown } from "../ui-elements/editors/helpers/text-generation";

export const copyPersonNotes = async (personId: string, months: number) => {
  const notes = await loadPersonNotes(personId, months);
  await navigator.clipboard.writeText(notes);
};

const loadPersonNotes = async (
  personId: string,
  months: number
): Promise<string> => {
  const { data, errors } = await client.models.NoteBlockPerson.listByPersonId(
    { personId },
    {
      limit: 1000,
      selectionSet,
    }
  );

  if (errors) {
    handleApiErrors(errors, "Loading person notes failed");
    throw errors;
  }

  const notes = await Promise.all(
    flow(
      identity<typeof data>,
      map("noteBlock.activity"),
      uniqBy(get("id")),
      compact,
      filter(justLastMonths(months)),
      sortBy<{ date: Date; content: string }>((note) => -note.date),
      map(mapNotes)
    )(data)
  );

  if (!notes) return "";

  const person = flow(
    identity<typeof data>,
    map("person"),
    compact,
    uniqBy(get("id")),
    map(mapPerson),
    get(0)
  )(data);

  return `# Notes about ${person}\n\n${notes.map(get("content")).join("\n")}`;
};

const justLastMonths =
  (months: number) =>
  ({
    forMeeting,
    finishedOn,
    createdAt,
  }: NotesData["noteBlock"]["activity"]): boolean => {
    const noteDate = new Date(forMeeting?.meetingOn || finishedOn || createdAt);
    return noteDate >= monthsAgo(months);
  };

const monthsAgo = (months: number) => subMonths(new Date(), months);

const mapPerson = ({ name, accounts }: NotesData["person"]) => {
  const accountNames = flow(
    identity<typeof accounts>,
    filter((a) => !a.startDate || isBefore(a.startDate, new Date())),
    filter((a) => !a.endDate || isAfter(a.endDate, new Date())),
    map((a) => `${a.position ? `${a.position} at ` : ""}${a.account?.name}`)
  )(accounts);
  return name
    ? `${name}${accountNames.length ? ` (${accountNames.join(", ")})` : ""}`
    : "";
};

const mapNotes = async ({
  createdAt,
  finishedOn,
  formatVersion,
  forMeeting,
  noteBlocks,
  noteBlockIds,
  notes,
  notesJson,
  forProjects,
}: NotesData["noteBlock"]["activity"]) => {
  const noteDoc = createDocument({
    formatVersion,
    notes,
    notesJson,
    noteBlockIds,
    noteBlocks,
  });
  const noteDate = new Date(forMeeting?.meetingOn || finishedOn || createdAt);
  const projectNames = await Promise.all(
    flow(
      identity<typeof forProjects>,
      map("projectsId"),
      uniq,
      map(getProject),
      map(mapProject)
    )(forProjects)
  );
  return {
    date: noteDate,
    content: `## ${format(noteDate, "yyyy-MM-dd")} – ${forMeeting ? `Meeting: ${forMeeting.topic} ` : ""}${projectNames ? `Project: "${projectNames.join(", ")}"` : ""}\n\n${getMarkdown(noteDoc)}\n`,
  };
};

const mapProject = async (promisedProject: Promise<Project>) => {
  const project = await promisedProject;
  if (!project) return "";
  const accountNames = flow(
    identity<typeof project>,
    get("accounts"),
    map("account"),
    compact,
    map("name"),
    uniqBy((name) => name)
  )(project);
  return project
    ? `${project.project}${accountNames.length ? ` (${accountNames.join(", ")})` : ""}`
    : "";
};

const projectSelectionSet = ["project", "accounts.account.name"] as const;

type Project = SelectionSet<
  Schema["Projects"]["type"],
  typeof projectSelectionSet
>;

const projectCache = new Map<string, Project>();

const getProject = async (id: string) => {
  if (projectCache.has(id)) {
    return projectCache.get(id);
  }
  const { data, errors } = await client.models.Projects.get(
    { id },
    {
      selectionSet: projectSelectionSet,
    }
  );
  if (errors) {
    handleApiErrors(errors, "Loading project failed");
    throw errors;
  }
  if (data) projectCache.set(id, data);
  return data;
};

const selectionSet = [
  "noteBlock.activity.id",
  "noteBlock.activity.createdAt",
  "noteBlock.activity.finishedOn",
  "noteBlock.activity.formatVersion",
  "noteBlock.activity.forMeeting.topic",
  "noteBlock.activity.forMeeting.meetingOn",
  "noteBlock.activity.noteBlocks.formatVersion",
  "noteBlock.activity.noteBlocks.id",
  "noteBlock.activity.noteBlocks.content",
  "noteBlock.activity.noteBlocks.type",
  "noteBlock.activity.noteBlocks.todo.id",
  "noteBlock.activity.noteBlocks.todo.todo",
  "noteBlock.activity.noteBlocks.todo.status",
  "noteBlock.activity.noteBlocks.todo.doneOn",
  "noteBlock.activity.noteBlocks.people.id",
  "noteBlock.activity.noteBlocks.people.personId",
  "noteBlock.activity.noteBlockIds",
  "noteBlock.activity.notes",
  "noteBlock.activity.notesJson",
  "noteBlock.activity.forProjects.projectsId",
  "person.id",
  "person.name",
  "person.accounts.startDate",
  "person.accounts.endDate",
  "person.accounts.position",
  "person.accounts.account.name",
] as const;

type NotesData = SelectionSet<
  Schema["NoteBlockPerson"]["type"],
  typeof selectionSet
>;
