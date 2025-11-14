import { GetAccountQueryVariables } from "../../../graphql-code/API";
import { getMarkdown, ProjectResult, mapQuery, NextToken, notNull } from ".";

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

/* ========= FUNCTIONS ========= */

export const flatMapAccounts = (
  accountData: AccountData & { subsidiaries?: SubsidaryData }
): AccountResult[] => {
  const intro = !accountData.introductionJson
    ? accountData.introduction || ""
    : getMarkdown(JSON.parse(accountData.introductionJson));
  return [
    {
      id: accountData.id,
      information: [
        ["#", "Account:", accountData.name].join(" "),
        !intro ? null : ["##", "Information about the account"].join(" "),
        !intro ? null : intro.replace(/^(#+)\s/gm, "###$1 "),
      ]
        .filter(notNull)
        .join("\n\n"),
      projectIds:
        accountData.projects?.items.map((p) => p.projects.id).filter(notNull) ||
        [],
    },
    ...(accountData.subsidiaries?.items.flatMap(flatMapAccounts) || []),
  ];
};

export const createAccountTexts =
  (projects: (ProjectResult | null)[]) => (data: AccountResult) => {
    const pinnedProjects = getProjectsForAccount(data, projects, true);
    const unpinnedProjects = getProjectsForAccount(data, projects, false);
    const total = pinnedProjects.length + unpinnedProjects.length;
    if (total === 0) return null;

    const projectTexts = [pinnedProjects, unpinnedProjects].join("\n\n");

    return `${data.information}${projectTexts}}`;
  };

const getProjectsForAccount = (
  accountData: AccountResult,
  projects: (ProjectResult | null)[],
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
