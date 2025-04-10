import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { backend } from "../backend";

export const grantCallBedrockInvokeModel = () => {
  backend.pseudonomizeProject.resources.lambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["bedrock:InvokeModel"],
      resources: [
        `arn:aws:bedrock:${backend.stack.region}::foundation-model/*`,
        `arn:aws:bedrock:${backend.stack.region}:${backend.stack.account}:async-invoke/*`,
      ],
    })
  );
};
