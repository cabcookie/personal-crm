const process = require("process");
const { getEnvironment } = require("../import-data/environments");

const getAwsProfile = () => getEnvironment().profile;

module.exports = { getAwsProfile };
