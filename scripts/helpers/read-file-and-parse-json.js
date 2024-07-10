const fs = require("fs");

const readFileAndParseJson = (fileName) => {
  const fileContent = fs.readFileSync(fileName, "utf8");
  return JSON.parse(fileContent);
};

module.exports = readFileAndParseJson;
