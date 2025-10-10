import { subWeeks, format } from "date-fns";
import { client } from "@/lib/amplify";
import { SelectionSet } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { compact, filter, flow, identity, join, map, sortBy } from "lodash/fp";
import { handleApiErrors } from "@/api/globals";
import { createDocument } from "@/components/ui-elements/editors/helpers/transformers";
import { getMarkdown } from "../ui-elements/editors/helpers/text-generation";

export const copyProjectNotes = async (projectId: string, weeks: number) => {
  const notes = await loadProjectNotes(projectId, weeks);
  console.log(`Copied notes from last ${weeks} weeks:`, notes);
  await navigator.clipboard.writeText(notes);
};

const loadProjectNotes = async (
  projectId: string,
  weeks: number
): Promise<string> => {
  console.log(
    `Loading project notes from last ${weeks} weeks for project ${projectId}`
  );
  const { data, errors } =
    await client.models.ProjectActivity.listProjectActivityByProjectsId(
      { projectsId: projectId },
      { limit: 1000, selectionSet }
    );

  if (errors) {
    handleApiErrors(errors, "Loading project notes failed");
    throw errors;
  }
  return flow(
    identity<NotesData[] | undefined>,
    map("activity"),
    compact,
    map(mapNotes),
    filter((note: { date: Date; content: string }) =>
      justLastWeeks(note, weeks)
    ),
    sortBy<{ date: Date; content: string }>((note) => -note.date),
    map("content"),
    join("\n")
  )(data);
};

const weeksAgo = (weeks: number) => subWeeks(new Date(), weeks);

const justLastWeeks = (
  { date }: { date: Date; content: string },
  weeks: number
): boolean => date >= weeksAgo(weeks);

const mapNotes = ({
  createdAt,
  finishedOn,
  forMeeting,
  formatVersion,
  noteBlocks,
  noteBlockIds,
  notes,
  notesJson,
}: NotesData["activity"]) => {
  const noteDoc = createDocument({
    formatVersion,
    notes,
    notesJson,
    noteBlockIds,
    noteBlocks,
  });
  const noteDate = new Date(forMeeting?.meetingOn || finishedOn || createdAt);
  return {
    date: noteDate,
    content: `## ${format(noteDate, "yyyy-MM-dd")} – ${forMeeting ? `Meeting: ${forMeeting.topic}` : "Project Notes"}\n\n${getMarkdown(noteDoc)}\n`,
  };
};

const selectionSet = [
  "activity.createdAt",
  "activity.finishedOn",
  "activity.formatVersion",
  "activity.forMeeting.topic",
  "activity.forMeeting.meetingOn",
  "activity.noteBlocks.formatVersion",
  "activity.noteBlocks.id",
  "activity.noteBlocks.content",
  "activity.noteBlocks.type",
  "activity.noteBlocks.todo.id",
  "activity.noteBlocks.todo.todo",
  "activity.noteBlocks.todo.status",
  "activity.noteBlocks.todo.doneOn",
  "activity.noteBlocks.people.id",
  "activity.noteBlocks.people.personId",
  "activity.noteBlockIds",
  "activity.notes",
  "activity.notesJson",
] as const;

type NotesData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;
