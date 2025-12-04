import { differenceInCalendarDays, format } from "date-fns";
import { notNull } from ".";
import { GetAccountQueryVariables } from "../../../graphql-code/API";
import { fetchingAccount, fetchingProject } from "../fetching";
import { ExportTask } from "./load-task-record";
import { getMarkdown } from "./markdown";
import {
  getProjectIds,
  mapProject,
  ProjectData,
  ProjectResult,
} from "./projects";
import { mapQuery, NextToken } from "./queries";

/* ========= CONSTANTS ========= */

export const accountDataFields = [
  "id",
  "name",
  "formatVersion",
  "introduction",
  "introductionJson",
  "projects(limit: 500)",
  ["nextToken", "items", ["projects", ["id", "done", "doneOn", "onHoldTill"]]],
  "learnings",
  ["nextToken", "items", ["learnedOn", "learning"]],
];

/* ========= PUBLIC FUNCTIONS ========= */

export const getAccountMd = async (task: ExportTask): Promise<string> => {
  const accountData = await fetchingAccount(task.itemId);
  const projectIds = getProjectIds(accountData);
  const projectsData = await Promise.all(
    projectIds.map((projectId) => fetchingProject(projectId))
  );

  const createAccountTextsFn = await createAccountTexts(
    projectsData,
    task.startDate,
    task.endDate
  );

  return flatMapAccounts(task.startDate, task.endDate)(accountData)
    .map(createAccountTextsFn)
    .filter(notNull)
    .join("");
};

export const flatMapAccounts =
  (startDate: Date, endDate: Date) =>
  (
    accountData: AccountData & { subsidiaries?: SubsidaryData }
  ): AccountResult[] => {
    const intro = !accountData.introductionJson
      ? accountData.introduction || ""
      : getMarkdown(JSON.parse(accountData.introductionJson));
    const learnings = getAccountLearnings(accountData, startDate, endDate);
    return [
      {
        id: accountData.id,
        information: [
          ["#", "Account:", accountData.name].join(" "),
          !intro ? null : `## Information about ${accountData.name}\n\n`,
          !intro ? null : intro.replace(/^(#+)\s/gm, "###$1 "),
          !learnings ? null : `## Learnings about ${accountData.name}\n\n`,
          learnings,
        ]
          .filter(notNull)
          .join(""),
        projectIds:
          accountData.projects?.items
            .map((p) => p.projects.id)
            .filter(notNull) || [],
      },
      ...(accountData.subsidiaries?.items.flatMap(
        flatMapAccounts(startDate, endDate)
      ) || []),
    ];
  };

export const createAccountTexts = async (
  projects: ProjectData[],
  startDate: Date,
  endDate: Date
) => {
  const mappedProjects = (
    await Promise.all(projects.map((p) => mapProject(p, startDate, endDate)))
  ).filter((p) => !!p);

  return (data: AccountResult) => {
    const pinnedProjects = getProjectsForAccount(data, mappedProjects, true);
    const unpinnedProjects = getProjectsForAccount(data, mappedProjects, false);
    const total = pinnedProjects.length + unpinnedProjects.length;
    if (total === 0) return null;

    const projectTexts = [pinnedProjects, unpinnedProjects].join("\n\n");

    return `${data.information}${projectTexts}`;
  };
};

/* ========= PRIVATE FUNCTIONS ========= */

const getAccountLearnings = (
  accountData: AccountData,
  startDate: Date,
  endDate: Date
): string | null =>
  accountData.learnings?.items
    .filter(
      (l) =>
        differenceInCalendarDays(l.learnedOn, startDate) >= 0 &&
        differenceInCalendarDays(endDate, l.learnedOn) >= 0
    )
    .map((l) => ({ ...l, learnedOn: new Date(l.learnedOn) }))
    .sort((a, b) => b.learnedOn.getTime() - a.learnedOn.getTime())
    .map((l) =>
      [
        ["### Learned on", format(l.learnedOn, "PPPp")].join(" "),
        getMarkdown(l.learning),
      ].join("\n\n")
    )
    .join("") ?? null;

const getProjectsForAccount = (
  accountData: AccountResult,
  projects: ProjectResult[],
  pinned: boolean
) =>
  accountData.projectIds
    .map((projectId) => {
      const project = projects.find((p) => p?.id === projectId);
      if (!project || project.pinned !== pinned) return null;
      return project.text;
    })
    .filter(notNull)
    .join("\n\n");

/* ========== QUERIES ========== */

export const queryAccount = [
  "query GetAccount($id: ID!)",
  [
    "getAccount(id: $id)",
    [
      ...accountDataFields,
      "subsidiaries",
      [
        "nextToken",
        "items",
        [
          ...accountDataFields,
          "subsidiaries",
          [
            "nextToken",
            "items",
            [
              ...accountDataFields,
              "subsidiaries",
              [
                "nextToken",
                "items",
                [
                  ...accountDataFields,
                  "subsidiaries",
                  ["nextToken", "items", accountDataFields],
                ],
              ],
            ],
          ],
        ],
      ],
    ],
  ],
].reduce<string>(mapQuery(0), "") as GeneratedAccountQuery;

/* =========== TYPES =========== */

export type AccountResult = {
  id: string;
  information: string;
  projectIds: string[];
};

type GeneratedAccountQuery = string & {
  __generatedQueryInput: GetAccountQueryVariables;
  __generatedQueryOutput: GetAccountData;
};

export type AccountData = {
  id: string;
  name: string;
  formatVersion?: number | null;
  introduction?: string | null;
  introductionJson?: string | null;
  learnings?: {
    items: Array<{
      learnedOn: string;
      learning: string;
    }>;
    nextToken?: string | null;
  } | null;
  projects?: {
    items: Array<{
      projects: {
        id: string;
        done: string;
        doneOn: string;
        onHoldTill?: string | null;
      };
    }>;
    nextToken?: string | null;
  } | null;
};

export type SubsidaryData =
  | (NextToken & {
      items: Array<
        AccountData & {
          subsidiaries?: SubsidaryData;
        }
      >;
    })
  | null;

export type GetAccountData = {
  getAccount?: AccountData & {
    subsidiaries:
      | (NextToken & {
          items: Array<
            AccountData & {
              subsidiaries:
                | (NextToken & {
                    items: Array<
                      AccountData & {
                        subsidiaries:
                          | (NextToken & {
                              items: Array<
                                AccountData & {
                                  subsidiaries:
                                    | (NextToken & {
                                        items: Array<AccountData>;
                                      })
                                    | null;
                                }
                              >;
                            })
                          | null;
                      }
                    >;
                  })
                | null;
            }
          >;
        })
      | null;
  };
};
