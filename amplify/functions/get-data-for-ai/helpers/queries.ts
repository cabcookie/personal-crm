import { GetAccountQueryVariables } from "../../../graphql-code/API";
import { GetAccountData, accountDataFields } from "./accounts";

/* ========= FUNCTIONS ========= */

export const mapQuery =
  (level: number) =>
  (prev: string, curr: string | any[]): string => {
    const indent = "  ".repeat(level);
    if (typeof curr === "string") {
      return `${prev}${prev === "" ? "" : "\n"}${indent}${curr}`;
    } else if (Array.isArray(curr)) {
      return `${prev} {\n${curr.reduce<string>(mapQuery(level + 1), "")}\n${indent}}`;
    }
    return prev;
  };

/* ========= CONSTANTS ========= */

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
].reduce<string>(mapQuery(0), "") as GeneratedQuery;

/* =========== TYPES =========== */

export type NextToken = {
  nextToken: string | null;
};

type GeneratedQuery = string & {
  __generatedQueryInput: GetAccountQueryVariables;
  __generatedQueryOutput: GetAccountData;
};
