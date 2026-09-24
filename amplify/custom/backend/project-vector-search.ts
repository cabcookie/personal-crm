import type { BackendType } from "../../backend";
import * as iam from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import { PROJECT_VECTOR_INDEX_NAME } from "./project-summary";

/**
 * Wiring for the Sonic `suggest_project` path: the `project-vector-search`
 * resolver Lambda gets the Projects table name + vector index name as env, plus
 * IAM for Titan embeddings (to embed the query). SearchVectors on the index is
 * granted in setupProjectVectorIndex (custom/backend/project-summary.ts). The
 * Lambda enforces the owner filter itself — see the handler.
 *
 * (Nova Sonic browser access is already granted by setupPersonVectorSearch.)
 */
export function setupProjectVectorSearch(backend: BackendType) {
  const projectsTable = backend.data.resources.tables["Projects"];
  const projectVectorSearch = backend.projectVectorSearch;
  const fn = projectVectorSearch.resources.lambda;
  const stack = Stack.of(fn);

  projectVectorSearch.addEnvironment(
    "DDB_TABLE_PROJECTS",
    projectsTable.tableName
  );
  projectVectorSearch.addEnvironment(
    "PROJECT_VECTOR_INDEX_NAME",
    PROJECT_VECTOR_INDEX_NAME
  );

  // Titan embeddings for the query text.
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["bedrock:InvokeModel"],
      resources: [
        `arn:aws:bedrock:${stack.region}::foundation-model/amazon.titan-embed-text-v2:0`,
      ],
    })
  );
}
