const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  ListUsersCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { fromIni } = require("@aws-sdk/credential-providers");
const { generatePassword } = require("./generate-pwd");

/**
 * Creates a new user in the specified user pool.
 *
 * @param {string} userPoolId The Cognito User Pool ID for the user pool.
 * @param {string} userEmail The email address of the user to be created.
 * @param {string} awsProfile The AWS profile to use for authentication.
 * @param {string} awsRegion The AWS region to use for the Cognito Identity Provider client.
 *
 * @returns {string} The ID of the created user.
 * @throws Error if the user could not be created.
 *
 * @example
 * const userId = createUser('user-pool-id');
 */
const createUser = async (userPoolId, userEmail, awsProfile, awsRegion) => {
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
  if (existingUser) return existingUser.Username;

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

  return createdUser.User.Username;
};

module.exports = {
  createUser,
};
