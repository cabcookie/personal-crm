import type { Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { loadAmplifyConfig } from "./helpers/configure";
import { getProjectData } from "./helpers/project";
import { pseudonomizeProject } from "./bedrock/pseudonomize-project";

export const handler: DynamoDBStreamHandler = async (event) => {
  logEvent(event);

  try {
    for (const record of event.Records) {
      // if (record.eventName !== "INSERT") return;
      if (record.dynamodb?.NewImage?.requestType?.S !== "PSEUDONOMIZE") return;
      if (!record.dynamodb?.NewImage?.projectId?.S) return;
      const projectId = record.dynamodb.NewImage.projectId.S;
      const project = await getProjectData(projectId);
      if (!project) return;
      const result = await pseudonomizeProject(project);
      console.log("Bedrock response", JSON.stringify(result));
    }
  } catch (error) {
    console.error("ERROR in handler", JSON.stringify(error));
  }
};

loadAmplifyConfig();

export const client = generateClient<Schema>({
  authMode: "iam",
});

const logEvent = (event: DynamoDBStreamEvent) => {
  console.log(
    "Event Records:",
    event.Records.map(({ eventID, eventName, eventVersion }) => ({
      eventID,
      eventName,
      eventVersion,
    }))
  );
};
