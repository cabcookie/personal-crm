/**
 * One-off backfill step 1: mark existing projects as pending a summary embedding.
 *
 * Scans the Projects table for rows that do not yet have a `summaryEmbedding`,
 * and sets `summaryEmbeddingPending = "1"` on them. That populates the sparse
 * `listSummaryEmbeddingPending` GSI, which the backfill-project-embed-enqueue
 * Lambda then pages through to fan work out to SQS.
 *
 * Mirrors mark-people-embedding-pending.js. Idempotent — re-running only
 * (re)marks projects still missing an embedding.
 *
 * Usage:
 *   node scripts/mark-projects-embedding-pending.js -env dev
 *   node scripts/mark-projects-embedding-pending.js -env dev --commit
 *
 * Without --commit it runs a dry run and only reports how many projects WOULD
 * be marked. Pass --commit to actually write the markers.
 */
const {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { getEnvironment, getTable } = require("./import-data/environments");

const env = getEnvironment();
const commit = process.argv.includes("--commit");
const tableName = getTable("Projects");

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const markProject = async (id) => {
  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: id } },
      // Only set the marker if it isn't already set AND no embedding exists.
      UpdateExpression: "SET summaryEmbeddingPending = :one",
      ConditionExpression:
        "attribute_not_exists(summaryEmbeddingPending) AND attribute_not_exists(summaryEmbedding)",
      ExpressionAttributeValues: { ":one": { S: "1" } },
    })
  );
};

const run = async () => {
  console.log(
    `${commit ? "MARKING" : "DRY RUN — scanning"} projects in ${tableName}\n`
  );

  let lastKey = undefined;
  let scanned = 0;
  let candidates = 0;
  let marked = 0;

  do {
    const res = await client.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: "attribute_not_exists(summaryEmbedding)",
        ProjectionExpression: "id",
        ExclusiveStartKey: lastKey,
        Limit: 200,
      })
    );

    scanned += res.ScannedCount ?? 0;
    const ids = (res.Items ?? []).map((i) => i.id?.S).filter(Boolean);
    candidates += ids.length;

    if (commit) {
      for (const id of ids) {
        try {
          await markProject(id);
          marked += 1;
        } catch (err) {
          if (err.name !== "ConditionalCheckFailedException") {
            console.error(`  failed to mark ${id}:`, err.message);
          }
        }
        await sleep(20);
      }
    }

    lastKey = res.LastEvaluatedKey;
    process.stdout.write(
      `\r  scanned ${scanned}, candidates ${candidates}${commit ? `, marked ${marked}` : ""}`
    );
  } while (lastKey);

  console.log("\n\nDone.");
  if (!commit) {
    console.log(
      `Would mark ${candidates} project(s). Re-run with --commit to apply.`
    );
  } else {
    console.log(`Marked ${marked} project(s) as pending.`);
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
