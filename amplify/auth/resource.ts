import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

/**
 * Define and configure your auth resource
 * When used alongside data, it is automatically configured as an auth provider for data
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // Require MFA for every sign-in. TOTP (authenticator app) only — SMS is
  // weaker and adds cost, so it stays off. With REQUIRED, existing users are
  // prompted to set up TOTP on their next sign-in; the login UI must render
  // the setup + challenge steps (handled by the Authenticator component).
  multifactor: {
    mode: "REQUIRED",
    totp: true,
  },
  userAttributes: {
    givenName: {
      mutable: true,
      required: false,
    },
  },
  triggers: { postConfirmation },
});
