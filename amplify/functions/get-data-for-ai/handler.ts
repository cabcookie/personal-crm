import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/get-data-for-ai";
import { fetchingApiKey } from "./fetching-apikey";
import { fetchingAccount } from "./fetching-account";

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "iam",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
);

export const client = generateClient<Schema>({
  authMode: "iam",
});

export const handler: Schema["getDataForAi"]["functionHandler"] = async (
  event
) => {
  console.log("getDataForAi event:", JSON.stringify(event));

  try {
    const apiKey = event.arguments.apiKey;
    if (!apiKey) throw new Error("API key is required");
    const dataToRetrieve = await fetchingApiKey(apiKey);
    if (dataToRetrieve.dataSource === "account") {
      const accountData = await fetchingAccount(dataToRetrieve.itemId);
      return { data: accountData };
    }

    return { data: dataToRetrieve };
  } catch (error) {
    console.error("Error in getDataForAi handler:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
