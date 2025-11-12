import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingReqRes } from "@aws-amplify/adapter-nextjs/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const reqResBasedClient = generateServerClientUsingReqRes<Schema>({
  config: outputs,
  authMode: "identityPool",
});
