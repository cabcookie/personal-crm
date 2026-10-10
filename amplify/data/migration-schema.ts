import { a } from "@aws-amplify/backend";
import { migrationExport } from "../functions/migration-export/resource";

export const tablesWithDeleteProtection = [] as string[];

const migrationSchema = {
  /**
   * Starts the migration export for nexflow.it in the background. The Lambda
   * derives the owner from the caller's identity; `identityId` (Cognito
   * identity pool id) only names the caller's storage folder
   * `exports/<identityId>/migration/` and the image prefix it may read.
   */
  startMigrationExport: a
    .mutation()
    .arguments({ identityId: a.string().required() })
    .handler(a.handler.function(migrationExport).async())
    .authorization((allow) => [allow.authenticated()]),
};

export default migrationSchema;
