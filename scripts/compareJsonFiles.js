const { writeFileSync } = require("fs");
const compareJSON = require("./helpers/compare-json");
const readFileAndParseJson = require("./helpers/read-file-and-parse-json");

if (process.argv.length !== 4) {
  console.error("Usage: node compareJsonFiles.js <file1> <file2>");
  process.exit(1);
}
const fileName1 = process.argv[2];
const fileName2 = process.argv[3];

const file1 = readFileAndParseJson(fileName1);
const file2 = readFileAndParseJson(fileName2);

const differences = compareJSON(file1, file2);

const result = [
  "# Deleted:",
  ...differences.deleted.map((i) => `- ${i}`),
  "# Updated:",
  ...differences.updated.map((i) => `- ${i}`),
  "# Added:",
  ...differences.added.map((i) => `- ${i}`),
].join("\n");

writeFileSync("import-data/compare-json-result.txt", result);
