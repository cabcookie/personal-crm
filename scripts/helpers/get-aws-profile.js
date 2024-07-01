const process = require("process");

const getAwsProfile = () => {
  const args = process.argv.slice(2);
  let profile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--profile" || args[i] === "-p") {
      if (args[i + 1]) {
        profile = args[i + 1];

        break;
      } else {
        console.error("Please provide a profile name after --profile or -p.");
        process.exit(1);
      }
    }
  }

  if (!profile) {
    console.error("Please provide a profile name with --profile or -p.");
    process.exit(1);
  }

  return profile;
};

module.exports = { getAwsProfile };
