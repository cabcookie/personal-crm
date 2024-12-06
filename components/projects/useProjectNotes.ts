import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { compact, flow, identity, map, reduce, sortBy } from "lodash/fp";
import useSWR from "swr";
const client = generateClient<Schema>();

const selectionSet = [
  "activity.id",
  "activity.createdAt",
  "activity.finishedOn",
  "activity.forMeeting.id",
  "activity.forMeeting.topic",
  "activity.forMeeting.meetingOn",
  "activity.forMeeting.createdAt",
] as const;

type NotesData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;

type Meeting = {
  id: string;
  topic: string;
  meetingOn: Date;
};

type Note = {
  id: string;
  finishedOn: Date;
  projects: [];
  meeting?: Meeting;
};

const mapNotes = ({
  id,
  createdAt,
  finishedOn,
  forMeeting,
}: NotesData["activity"]): Note => ({
  id,
  finishedOn: new Date(finishedOn || createdAt),
  projects: [],
  meeting: !forMeeting
    ? undefined
    : {
        id: forMeeting.id,
        topic: forMeeting.topic,
        meetingOn: new Date(forMeeting.meetingOn || forMeeting.createdAt),
      },
});

const fetchProjectNotes = (projectId: string) => async () => {
  const { data, errors } =
    await client.models.ProjectActivity.listProjectActivityByProjectsId(
      { projectsId: projectId },
      { limit: 1000, selectionSet }
    );
  if (errors) {
    handleApiErrors(errors, "Loading project notes failed");
    throw errors;
  }
  try {
    return flow(
      identity<NotesData[] | undefined>,
      map("activity"),
      compact,
      map(mapNotes),
      sortBy((p) => -p.finishedOn.getTime()),
      reduce<Note, Note[]>(
        (prev, curr) =>
          prev.some((p) => p.id === curr.id) ? prev : [...prev, curr],
        []
      )
    )(data);
  } catch (error) {
    console.error("fetchProjectNotes", error);
    throw error;
  }
};

const useProjectNotes = (projectId: string) => {
  const { data: notes } = useSWR(
    `/api/project/id/${projectId}/notes`,
    fetchProjectNotes(projectId)
  );
  return { notes };
};

export default useProjectNotes;
