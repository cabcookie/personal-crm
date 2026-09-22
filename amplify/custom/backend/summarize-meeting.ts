import type { BackendType } from "../../backend";
import * as iam from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";

/**
 * Grants the `summarize-meeting` resolver Lambda permission to invoke Claude
 * Sonnet 4.5 (US cross-region inference profile + the underlying foundation
 * models in each routed region), mirroring the project-summary Lambda's IAM.
 */
const SONNET_45 = "anthropic.claude-sonnet-4-5-20250929-v1:0";

export function setupSummarizeMeeting(backend: BackendType) {
  const fn = backend.summarizeMeeting.resources.lambda;
  const stack = Stack.of(fn);
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["bedrock:InvokeModel"],
      resources: [
        `arn:aws:bedrock:${stack.region}:${stack.account}:inference-profile/us.${SONNET_45}`,
        `arn:aws:bedrock:us-east-1::foundation-model/${SONNET_45}`,
        `arn:aws:bedrock:us-east-2::foundation-model/${SONNET_45}`,
        `arn:aws:bedrock:us-west-2::foundation-model/${SONNET_45}`,
      ],
    })
  );
}
