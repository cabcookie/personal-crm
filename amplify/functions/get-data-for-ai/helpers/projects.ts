import { AccountData, SubsidaryData, NextToken, mapQuery } from ".";
import { differenceInBusinessDays } from "date-fns";
import { GetProjectsQueryVariables } from "../../../graphql-code/API";
import { Schema } from "../../../data/resource";

/* ========= FUNCTIONS ========= */

export const mapProjects = async (
  project: NonNullable<GetProjectData["getProjects"]>
) => ({
  ...project,
  activities: project.activities?.items
    .map((a) =>
      !a?.activity
        ? null
        : {
            ...a.activity,
            finishedOn:
              a.activity.forMeeting?.meetingOn ||
              a.activity.forMeeting?.createdAt ||
              a.activity.finishedOn ||
              a.activity.createdAt,
            blocks: a.activity.noteBlockIds
              ?.map((blockId) =>
                a.activity?.noteBlocks?.items.find(
                  (block) => block?.id === blockId
                )
              )
              .filter((b) => !!b),
          }
    )
    .filter((a) => !!a),
});

const mapProjectIds = (
  prev: string[],
  curr: NonNullable<SubsidaryData>["items"][number]
): string[] => [...prev, ...getProjectIds(curr)];

export const getProjectIds = (
  data: AccountData & {
    subsidiaries?: SubsidaryData;
  }
): string[] => [
  ...(data.projects?.items
    .filter(
      (p) =>
        (!!p.onHoldTill &&
          differenceInBusinessDays(new Date(), p.onHoldTill) >= 0) ||
        !p.done ||
        !p.doneOn ||
        differenceInBusinessDays(new Date(), p.doneOn) <= 25
    )
    .map((p) => p.id) || []),
  ...(data.subsidiaries?.items.reduce<string[]>(mapProjectIds, []) || []),
];

/* ========== QUERIES ========== */

export const queryProject = [
  "query GetProject($id: ID!)",
  [
    "getProjects",
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
