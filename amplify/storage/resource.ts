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
  }),
});
