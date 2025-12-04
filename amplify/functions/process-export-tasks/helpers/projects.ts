import {
  differenceInBusinessDays,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { notNull } from ".";
import { compact, uniq } from "lodash/fp";
import { Schema } from "../../../data/resource";
import { GetProjectsQueryVariables } from "../../../graphql-code/API";
import { fetchingProject } from "../fetching";
import { ExportTask } from "./load-task-record";
import { AccountData, SubsidaryData } from "./accounts";
import { getMarkdown } from "./markdown";
import { getPeopleFromCache, getPerson } from "./people";
import { mapQuery, NextToken } from "./queries";

/* ====== PUBLIC FUNCTIONS ===== */

export const getProjectMd = async (task: ExportTask): Promise<string> => {
  const projectData = await fetchingProject(task.itemId);
  const mapped = await mapProject(projectData, task.startDate, task.endDate);
  return mapped?.text ?? "";
};

export const getProjectIds = (
  data: AccountData & {
    subsidiaries?: SubsidaryData;
  }
): string[] => [
  ...(data.projects?.items
    .filter(
      (p) =>
        (!!p.projects.onHoldTill &&
          differenceInBusinessDays(new Date(), p.projects.onHoldTill) >= 0) ||
        !p.projects.done ||
        !p.projects.doneOn ||
        differenceInBusinessDays(new Date(), p.projects.doneOn) <= 10
    )
    .map((p) => p.projects.id) || []),
  ...(data.subsidiaries?.items.reduce<string[]>(mapProjectIds, []) || []),
];

export const mapProject = async (
  project: ProjectData,
  startDate: Date,
  endDate: Date
): Promise<ProjectResult | null> => {
  try {
    if (!project.activities) return null;

    // Get all valid activities
    const cleanActivities = project.activities.items
      .map((a) => a?.activity)
      .filter((a) => !!a);
    if (cleanActivities.length === 0) return null;

    // Map with activity dates, sort them (descending), and filter for startDate and endDate
    const activitiesSorted = cleanActivities
      .map((a) => ({
        ...a,
        activityOn: new Date(
          a.forMeeting?.meetingOn ||
            a.forMeeting?.createdAt ||
            a.finishedOn ||
            a.createdAt
        ),
      }))
      .filter(
        (a) =>
          differenceInCalendarDays(a.activityOn, startDate) >= 0 &&
          differenceInCalendarDays(endDate, a.activityOn) >= 0
      )
      .sort((a, b) => b.activityOn.getTime() - a.activityOn.getTime());

    // Get markdown text with a header from each activity
    const activityNotes = await Promise.all(
      activitiesSorted.map(async (a) => {
        // Map the blocks of the activity
        const blocks = a.noteBlockIds
          ?.map((id) => a.noteBlocks?.items.find((b) => b?.id === id))
          .filter((b) => !!b);
        if (!blocks) return "";

        // Turn blocks into texts
        const notes = blocks
          .map((b) =>
            b.type === "taskItem"
              ? !b.todo?.todo
                ? ""
                : getMarkdown(b.todo.todo)
              : !b.content
                ? ""
                : getMarkdown(b.content)
          )
          .join("");
        if (!notes || notes.length < 10) return "";

        const meeting = await getMeetingText(a);

        return [
          ["###", meeting, format(a.activityOn, "PPPp")]
            .filter(notNull)
            .join(" "),
          notes,
        ].join("\n\n");
      })
    );
    if (!activityNotes.join(""))
      return { id: project.id, text: "", pinned: false };

    // Retrieve the people involved or mentioned in project to list them in the project header
    const peopleInvolvedIds = uniq([
      ...getMeetingParticipantsFromProject(project),
      ...getMentionedPeopleInProject(project),
    ]).filter((p) => !!p) as string[];
    const peopleFromCache = getPeopleFromCache(peopleInvolvedIds);
    const remainingPeople = await Promise.all(
      peopleFromCache.remainingIds.map(getPerson)
    );
    const peopleText = [...peopleFromCache.people, remainingPeople].join(", ");
    const peopleInvolvedText =
      peopleText.length === 0
        ? null
        : ["**People involved:**", peopleText].join(" ");

    // Name the project notes header and return the ProjectResult
    const projectNotes = [["##", "Project:", `'${project.project}'`].join(" ")];
    return {
      id: project.id,
      text: [projectNotes, peopleInvolvedText, activityNotes.join("")]
        .filter(notNull)
        .join("\n\n"),
      pinned: project.pinned === "PINNED",
    };
  } catch (error) {
    console.error("ERROR in mapProject:", error);
    return { id: project.id, text: "", pinned: false };
  }
};

/* ===== PRIVATE FUNCTIONS ===== */

const getMeetingText = async (a: TActivity) => {
  if (!a.forMeeting) return null;
  const peopleIds = compact(
    a.forMeeting.participants?.items.map((p) => p?.personId)
  );
  const people = await Promise.all(peopleIds.map(getPerson));
  return ["Meeting:", `'${a.forMeeting.topic}'`, `(${people.join(", ")})`].join(
    " "
  );
};

const getMentionedPeopleInProject = (project: ProjectData) =>
  project.activities?.items.flatMap((a) =>
    a?.activity?.noteBlockIds?.flatMap((id) =>
      a.activity?.noteBlocks?.items
        .find((b) => b?.id === id)
        ?.people?.items.map((p) => p?.personId)
    )
  ) || [];

const getMeetingParticipantsFromProject = (project: ProjectData) =>
  project.activities?.items.flatMap((a) =>
    a?.activity?.forMeeting?.participants?.items.map((p) => p?.personId)
  ) || [];

const mapProjectIds = (
  prev: string[],
  curr: NonNullable<SubsidaryData>["items"][number]
): string[] => [...prev, ...getProjectIds(curr)];

/* ========== QUERIES ========== */

export const queryProject = [
  "query GetProject($id: ID!)",
  [
    "getProjects(id: $id)",
    [
      "id",
      "project",
      "onHoldTill",
      "done",
      "doneOn",
      "pinned",
      "partner",
      ["name"],
      "activities(limit: 1000)",
      [
        "nextToken",
        "items",
        [
          "activity",
          [
            "id",
            "forMeeting",
            [
              "topic",
              "meetingOn",
              "createdAt",
              "participants(limit: 20) ",
              ["nextToken", "items", ["personId"]],
            ],
            "finishedOn",
            "createdAt",
            "noteBlockIds",
            "noteBlocks(limit: 500) ",
            [
              "nextToken",
              "items",
              [
                "id",
                "content",
                "type",
                "todo",
                ["todo", "status", "doneOn"],
                "people(limit: 50) ",
                ["nextToken", "items", ["personId"]],
              ],
            ],
          ],
        ],
      ],
    ],
  ],
].reduce<string>(mapQuery(0), "") as GeneratedProjectQuery;

/* =========== TYPES =========== */

export type ProjectResult = { id: string; text: string; pinned: boolean };

type TActivity = NonNullable<
  NonNullable<
    NonNullable<ProjectData["activities"]>["items"][number]
  >["activity"]
>;

type GeneratedProjectQuery = string & {
  __generatedQueryInput: GetProjectsQueryVariables;
  __generatedQueryOutput: GetProjectData;
};

export type GetProjectData = {
  getProjects?: {
    id: string;
    project: string;
    onHoldTill?: string | null;
    done?: boolean | null;
    doneOn?: string | null;
    pinned: Schema["ProjectPinned"]["type"];
    partner?: {
      name: string;
    } | null;
    activities?:
      | (NextToken & {
          items: Array<{
            activity?: {
              id: string;
              forMeeting?: {
                topic: string;
                meetingOn?: string | null;
                createdAt: string;
                participants?:
                  | (NextToken & {
                      items: Array<{
                        personId: string;
                      } | null>;
                    })
                  | null;
              } | null;
              finishedOn?: string | null;
              createdAt: string;
              noteBlockIds?: Array<string> | null;
              noteBlocks?:
                | (NextToken & {
                    items: Array<{
                      id: string;
                      content?: string | null;
                      type: string;
                      todo?: {
                        todo: string;
                        status: Schema["TodoStatus"]["type"];
                        doneOn?: string | null;
                      } | null;
                      people?:
                        | (NextToken & {
                            items: Array<{ personId: string } | null>;
                          })
                        | null;
                    } | null>;
                  })
                | null;
            } | null;
          } | null>;
        })
      | null;
  } | null;
};

export type ProjectData = NonNullable<GetProjectData["getProjects"]>;
