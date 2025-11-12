import { NextApiRequest, NextApiResponse } from "next";
import {
  runWithAmplifyServerContext,
  reqResBasedClient,
} from "@/api/amplify-server-utils";

type Data = {
  data?: string | null;
  error?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid API key" });
  }

  try {
    const result = await runWithAmplifyServerContext({
      nextServerContext: null, // Public access, no user session needed
      operation: async (contextSpec) => {
        const { data, errors } = await reqResBasedClient.queries.getDataForAi(
          contextSpec,
          {
            apiKey: id,
          }
        );

        if (errors) {
          throw new Error(errors[0]?.message || "Query failed");
        }

        return data;
      },
    });

    res.status(200).json({ data: (result?.data as string) || null });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export default handler;
