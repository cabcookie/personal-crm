import { fetchingProject } from "./fetching-projects";
import { client } from "./handler";
import {
  createAccountTexts,
  flatMapAccounts,
  getProjectIds,
  notNull,
  queryAccount,
} from "./helpers";

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
  if (!data || !data.getAccount) {
    console.warn(
      "fetchingAccount: No data returned for the specified account ID"
    );
    return "No data returned for the specified account ID";
  }

  console.log("Data for account", accountId, "retrieved:", data);

  const projectIds = getProjectIds(data.getAccount);
  const projects = await Promise.all(projectIds.map(fetchingProject));
  console.log("Projects found:", projects);

  return flatMapAccounts(data.getAccount)
    .map(createAccountTexts(projects))
    .filter(notNull)
    .join("\n\n");
};
