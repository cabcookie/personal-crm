import { GetAccountQueryVariables } from "../../../graphql-code/API";
import { mapQuery, NextToken } from "./queries";

/* ========= CONSTANTS ========= */

export const accountDataFields = [
  "id",
  "name",
  "formatVersion",
  "introduction",
  "introductionJson",
  "projects",
  ["nextToken", "items", ["id", "done", "doneOn", "onHoldTill"]],
  "learnings",
  ["nextToken", "items", ["learnedOn", "learning"]],
];

/* ========= FUNCTIONS ========= */

export const accountInformation = (
  accountData: AccountData & { subsidiaries?: SubsidaryData }
): string => {
  const name = accountData.name;
  const intro = accountData.introductionJson || accountData.introduction || "";
  return `## Account: ${name}\n\n${!intro ? "" : `${intro}\n\n`}${accountData.subsidiaries?.items.map(accountInformation).join("")}`;
};

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
      id: string;
      done: string;
      doneOn: string;
      onHoldTill?: string | null;
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
