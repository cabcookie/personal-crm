import { NestedStack } from "aws-cdk-lib";
import { Role, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class InferenceProfileIAM extends Construct {
  constructor(scope: NestedStack, id: string) {
    super(scope, id);

    // Find all IAM roles in the scope
    const targetRole = this.getBedrockGenerationIamRole(scope);

    if (targetRole) {
      // Add the inference profile resource to the role's inline policy
      targetRole.addToPolicy(
        new PolicyStatement({
          actions: ["bedrock:InvokeModel"],
          resources: [
            `arn:aws:bedrock:${scope.region}:${scope.account}:inference-profile/us.anthropic.claude-sonnet-4-20250514-v1:0`,
            "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
            "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
            "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
          ],
        })
      );
    }
  }

  private getBedrockGenerationIamRole(scope: Construct): Role | undefined {
    const traverse = (construct: Construct): Role | undefined => {
      if (construct instanceof Role && construct.node.id !== "ServiceRole") {
        console.log("Found role:", construct.node.id);
        return construct;
      }
      for (const child of construct.node.children) {
        const result = traverse(child);
        if (result) return result;
      }
      return undefined;
    };
    return traverse(scope);
  }
}
