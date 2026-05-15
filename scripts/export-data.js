const {
  DynamoDBClient,
  ListTablesCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { getEnvironment } = require("./import-data/environments");
const fs = require("fs");
const path = require("path");

const env = getEnvironment();
const suffix = `-${env.tables}-NONE`;

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const scanTable = async (tableName) => {
  const items = [];
  let lastKey = undefined;
  do {
    const response = await client.send(
      new ScanCommand({ TableName: tableName, ExclusiveStartKey: lastKey })
    );
    items.push(...(response.Items || []).map(unmarshall));
    lastKey = response.LastEvaluatedKey;
  } while (lastKey);
  return items;
};

const listEnvTables = async () => {
  const tables = [];
  let lastTable = undefined;
  do {
    const response = await client.send(
      new ListTablesCommand({ ExclusiveStartTableName: lastTable })
    );
    tables.push(...response.TableNames.filter((t) => t.endsWith(suffix)));
    lastTable = response.LastEvaluatedTableName;
  } while (lastTable);
  return tables.sort();
};

const exportAll = async () => {
  const tables = await listEnvTables();
  const outputDir = path.join(__dirname, "export");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Exporting ${tables.length} tables to ${outputDir}/\n`);

  let totalItems = 0;
  for (const fullName of tables) {
    const name = fullName.slice(0, -suffix.length);
    process.stdout.write(`  ${name.padEnd(36)}`);
    const items = await scanTable(fullName);
    fs.writeFileSync(
      path.join(outputDir, `${name}.json`),
      JSON.stringify(items, null, 2),
      "utf-8"
    );
    console.log(`${String(items.length).padStart(6)} items`);
    totalItems += items.length;
  }

  console.log(`\nDone. ${totalItems} items across ${tables.length} tables.`);
};

exportAll().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
