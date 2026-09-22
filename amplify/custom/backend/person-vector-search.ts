import type { BackendType } from "../../backend";
import * as iam from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import { PERSON_VECTOR_INDEX_NAME } from "./project-summary";

/**
 * Wiring for the Sonic `report_detected_person` path:
 *
 *  1. The `person-vector-search` resolver Lambda gets the Person table name +
 *     vector index name as env, plus IAM for SearchVectors (index ARN) and
 *     Titan embeddings (to embed the spoken name). It enforces the owner
 *     filter itself — see the handler.
 *
 *  2. The authenticated Cognito role gets bedrock:InvokeModel /
 *     InvokeModelWithBidirectionalStream on Nova 2 Sonic so the browser can
 *     open the live audio stream directly (no relay). This is safe: the user
 *     only streams their own audio. Tenant-sensitive data access (the vector
 *     search) is NOT exposed to the browser — it goes through the resolver
 *     Lambda above.
 */

const NOVA_SONIC = "amazon.nova-2-sonic-v1:0";

export function setupPersonVectorSearch(backend: BackendType) {
  const personTable = backend.data.resources.tables["Person"];
  const personVectorSearch = backend.personVectorSearch;
  const fn = personVectorSearch.resources.lambda;
  const stack = Stack.of(fn);

  personVectorSearch.addEnvironment("DDB_TABLE_PERSON", personTable.tableName);
  personVectorSearch.addEnvironment(
    "PERSON_VECTOR_INDEX_NAME",
    PERSON_VECTOR_INDEX_NAME
  );

  // SearchVectors on the index (own statement, no FGAC conditions — they don't
  // apply to SearchVectors).
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:SearchVectors"],
      resources: [`${personTable.tableArn}/index/${PERSON_VECTOR_INDEX_NAME}`],
    })
  );

  // Titan embeddings for the query name.
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["bedrock:InvokeModel"],
      resources: [
        `arn:aws:bedrock:${stack.region}::foundation-model/amazon.titan-embed-text-v2:0`,
      ],
    })
  );

  // Authenticated Cognito role → Nova Sonic bidirectional stream (browser).
  const authRole = backend.auth.resources.authenticatedUserIamRole;
  authRole.addToPrincipalPolicy(
    new iam.PolicyStatement({
      actions: [
        "bedrock:InvokeModelWithBidirectionalStream",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:InvokeModel",
      ],
      resources: [`arn:aws:bedrock:us-east-1::foundation-model/${NOVA_SONIC}`],
    })
  );
}
