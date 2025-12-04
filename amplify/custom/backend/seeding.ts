import type { BackendType } from "../../backend";
import { DataSchemaMigrations } from "../data-schema-migrations/resource";

/**
 * Creating a custom resource which runs a Lambda function on every deploy.
 * You can use this Lambda function to run schema migrations. This is very
 * useful when a new required field has been added e.g.
 */
export function setupDataSeeding(backend: BackendType) {
  const dataMigrationsStack = backend.dataSchemaMigrationsFn.stack;
  const cfnDataMigrationFn = backend.dataSchemaMigrationsFn.resources.lambda;

  new DataSchemaMigrations(dataMigrationsStack, "DataMigrations", {
    dataSchemaMigrationFn: cfnDataMigrationFn,
  });

  try {
    const table = backend.data.resources.tables["Projects"];
    if (!table) throw "Table not found";
    backend.dataSchemaMigrationsFn.addEnvironment(
      "PROJECTS_TABLE_NAME",
      table.tableName
    );
    table.grantReadWriteData(cfnDataMigrationFn);
  } catch (error) {
    console.error(error);
  }
}
