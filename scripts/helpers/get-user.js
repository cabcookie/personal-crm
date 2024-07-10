const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  ListUsersCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { fromIni } = require("@aws-sdk/credential-providers");
const { generatePassword } = require("./generate-pwd");
const { getAwsProfile } = require("./get-aws-profile");
const { getUserEmail } = require("./get-user-email");
const { userPools } = require("../import-data/tables");

/**
 * Gets the current user with the specified Email address. If the user doesn't exist, the user will be created
 *
 * @param {"dev" | "prod"} env The environment in which the operation should be proceeded ('dev' or 'prod')
 * @param {string} awsRegion The AWS region to use for the Cognito Identity Provider client.
 *
 * @returns {string} The ID of the user.
 * @throws Error if the user could not be created.
 *
 * @example
 * const userId = createUser('user-pool-id');
 */
const getUser = async (env, awsRegion) => {
  const userPoolId = userPools[env].Id;
  const awsProfile = getAwsProfile();
  const userEmail = getUserEmail();

  const client = new CognitoIdentityProviderClient({
    region: awsRegion,
    credentials: fromIni({ profile: awsProfile }),
  });

  const existingUsers = await client.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Limit: 10,
    })
  );

  const existingUser = existingUsers.Users.find((u) =>
    u.Attributes.some((a) => a.Name === "email" && a.Value === userEmail)
  );
  if (existingUser) return `${existingUser.Username}::${existingUser.Username}`;

  const createdUser = await client.send(
    new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: userEmail,
      TemporaryPassword: generatePassword(),
    })
  );
  if (!createdUser) throw "User could not be created";
  if (!createdUser.User) throw "No User has been returned";
  if (!createdUser.User.Username) throw "No Username has been returned";

  return `${createdUser.User.Username}::${createdUser.User.Username}`;
};

module.exports = {
  getUser,
};
