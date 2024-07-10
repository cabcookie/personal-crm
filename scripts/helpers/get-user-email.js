const process = require("process");

const getUserEmail = () => {
  const args = process.argv.slice(2);
  let email = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" || args[i] === "-e") {
      if (args[i + 1]) {
        email = args[i + 1];

        break;
      } else {
        console.error("Please provide a email name after --email or -e.");
        process.exit(1);
      }
    }
  }

  if (!email) {
    console.error("Please provide a email name with --email or -e.");
    process.exit(1);
  }

  return email;
};

module.exports = { getUserEmail };
