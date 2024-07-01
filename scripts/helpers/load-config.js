const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "..", "seed-data", "env.json");

const loadConfig = () => {
  let envConfig;
  try {
    const rawData = fs.readFileSync(configPath);
    envConfig = JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading the environment configuration file:", error);
    process.exit(1);
  }
  const { environmentId, userPoolId, userEmail, region } = envConfig;

  if (!environmentId || !userPoolId || !userEmail || !region) {
    console.log(envConfig);
    if (!environmentId) {
      console.error(
        "`environmentId` is required but values are missing from the environment configuration file. Please ensure that all required values are set in the env.json file."
      );
    }
    if (!userPoolId) {
      console.error(
        "`userPoolId` is required but values are missing from the environment configuration file. Please ensure that all required values are set in the env.json file."
      );
    }
    if (!userEmail) {
      console.error(
        "`userEmail` is required but values are missing from the environment configuration file. Please ensure that all required values are set in the env.json file."
      );
    }
    if (!region) {
      console.error(
        "`region` is required but values are missing from the environment configuration file. Please ensure that all required values are set in the env.json file."
      );
    }
    console.error("\n");
    process.exit(1);
  }

  return envConfig;
};

module.exports = {
  loadConfig,
};
