import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { backend } from "../backend";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";

export const enableDdbStream = () => {
  const projectSummaryTable =
    backend.data.resources.tables["ProjectSummaryRequest"];

  backend.pseudonomizeProject.resources.lambda.addEventSource(
    new DynamoEventSource(projectSummaryTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 1,
      retryAttempts: 1,
    })
  );
};
