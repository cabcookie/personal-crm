import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "personal-crm-files",
  access: (allow) => ({
    "profile-images/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    // "profile-images/*": [allow.authenticated.to(["read"])],
    "user-files/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "exports/{entity_id}/*": [
      // User access to their own exports
      allow.entity("identity").to(["read", "write", "delete"]),
      // Lambda S3 access is granted via CDK in export-tasks.ts to avoid circular dependency
    ],
  }),
});
