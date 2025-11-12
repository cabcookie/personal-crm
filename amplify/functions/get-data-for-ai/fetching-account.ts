import { client } from "./handler";
import { accountInformation, mapProjectIds, queryAccount } from "./helpers";

export const fetchingAccount = async (accountId: string) => {
  console.log("Fetching data for Account ID:", accountId);

  console.log("Using query:", queryAccount);

  const { data, errors } = await client.graphql({
    query: queryAccount,
    variables: { id: accountId },
  });

  if (errors)
    throw new Error(
      `Error in fetchingAccount: ${
        errors.map((err) => err.message).join(". ") || "Query failed"
      }`
    );
  if (!data || !data.getAccount)
    throw new Error(
      "Error in fetchingAccount: No data returned for the specified account ID"
    );

  const projectIds = [
    ...(data.getAccount.projects?.items.map((p) => p.id) || []),
    ...(data.getAccount.subsidiaries?.items.reduce<string[]>(
      mapProjectIds,
      []
    ) || []),
  ];

  return { account: accountInformation(data.getAccount), projectIds };
};
