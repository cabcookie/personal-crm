import { client } from "./handler";
import { getApiKeysForAi } from "../../graphql-code/queries";

export const fetchingApiKey = async (apiKey: string) => {
  console.log("Fetching data for API key:", apiKey);

  const { data, errors } = await client.graphql({
    query: getApiKeysForAi,
    variables: { apiKey },
  });

  if (errors)
    throw new Error(
      `Error in fetchingApiKey: ${
        errors.map((err) => err.message).join(". ") || "Query failed"
      }`
    );
  if (!data || !data.getApiKeysForAi)
    throw new Error(
      "Error in fetchingApiKey: No data returned from getDataForAi"
    );

  return data.getApiKeysForAi;
};
