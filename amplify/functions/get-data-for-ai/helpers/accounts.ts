import { NextToken } from "./queries";

/* ========= CONSTANTS ========= */

export const accountDataFields = [
  "id",
  "name",
  "formatVersion",
  "introduction",
  "introductionJson",
  "projects",
  ["nextToken", "items", ["id"]],
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

/* =========== TYPES =========== */

type AccountData = {
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
  getAccount: AccountData & {
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
