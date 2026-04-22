import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "personal-crm-files",
  isDefault: true,
  access: (allow) => ({
    "profile-images/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    // "profile-images/*": [allow.authenticated.to(["read"])],
    "user-files/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "exports/{entity_id}/*": [
      // User access to their own one-time exports.
      allow.entity("identity").to(["read", "write", "delete"]),
      // Lambda access is granted via CDK in custom/backend/export-tasks.ts to
      // avoid a circular dependency between the storage stack and function
      // stacks — `allow.resource(...)` pulls the function into the storage
      // stack's dependency graph.
    ],
  }),
});

// Dedicated bucket for recurring exports so we can safely grant external
// grantees (Quick Suite, etc.) bucket-wide read access without exposing any
// other user data. Lambda access + env var injection live in CDK (same
// circular-dep reason as above). Key shape:
// `exports/<identityId>/<recurringExportId>/latest.md`.
export const recurringExports = defineStorage({
  name: "recurringExports",
  access: (allow) => ({
    // Amplify rejects `{entity_id}` as the first path segment, so we prefix
    // with `exports/`. Owners read/delete their own recurring exports.
    "exports/{entity_id}/*": [allow.entity("identity").to(["read", "delete"])],
  }),
});
