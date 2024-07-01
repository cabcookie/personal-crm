const { loadConfig } = require("./helpers/load-config");
const { createUser } = require("./helpers/create-user");
const { getAwsProfile } = require("./helpers/get-aws-profile");
const { createTerritories } = require("./seed-data/territories");

const { userPoolId, userEmail, region } = loadConfig();
const awsProfile = getAwsProfile();

const createSeedData = async () => {
  const user = await createUser(userPoolId, userEmail, awsProfile, region);
  console.log("User ID:", user);
  const results = await createTerritories(user);
};

createSeedData();
