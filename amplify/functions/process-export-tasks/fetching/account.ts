import { queryAccount, client } from "../helpers";

export const fetchingAccount = async (accountId: string) => {
  console.log("Fetching data for Account ID:", accountId);

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
      `Error in fetchingAccount: No data returned for Account ID ${accountId}`
    );

  return data.getAccount;
};
