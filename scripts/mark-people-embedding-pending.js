/**
 * One-off backfill step 1: mark existing people as pending a name embedding.
 *
 * Scans the Person table for rows that do not yet have a `nameEmbedding`, and
 * sets `nameEmbeddingPending = "1"` on them. That populates the sparse
 * `listNameEmbeddingPending` GSI, which the backfill-person-embed-enqueue
 * Lambda then pages through to fan work out to SQS.
 *
 * This is the only full-table scan in the backfill; it runs once, offline,
 * throttled, and writes only a tiny marker attribute. It is idempotent —
 * re-running only (re)marks people still missing an embedding.
 *
 * Usage:
 *   node scripts/mark-people-embedding-pending.js -env dev
 *   node scripts/mark-people-embedding-pending.js -env dev --commit
 *
 * Without --commit it runs a dry run and only reports how many people WOULD be
 * marked. Pass --commit to actually write the markers.
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
const tableName = getTable("Person");

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const markPerson = async (id) => {
  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: id } },
      // Only set the marker if it isn't already set AND no embedding exists —
      // keeps the write idempotent and avoids touching already-processed rows.
      UpdateExpression: "SET nameEmbeddingPending = :one",
      ConditionExpression:
        "attribute_not_exists(nameEmbeddingPending) AND attribute_not_exists(nameEmbedding)",
      ExpressionAttributeValues: { ":one": { S: "1" } },
    })
  );
};

const run = async () => {
  console.log(
    `${commit ? "MARKING" : "DRY RUN — scanning"} people in ${tableName}\n`
  );

  let lastKey = undefined;
  let scanned = 0;
  let candidates = 0;
  let marked = 0;

  do {
    const res = await client.send(
      new ScanCommand({
        TableName: tableName,
        // Server-side filter: only people missing an embedding.
        FilterExpression: "attribute_not_exists(nameEmbedding)",
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
          await markPerson(id);
          marked += 1;
        } catch (err) {
          // ConditionalCheckFailed = already marked/embedded; ignore.
          if (err.name !== "ConditionalCheckFailedException") {
            console.error(`  failed to mark ${id}:`, err.message);
          }
        }
        // Gentle throttle to stay light on table capacity.
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
      `Would mark ${candidates} person(s). Re-run with --commit to apply.`
    );
  } else {
    console.log(`Marked ${marked} person(s) as pending.`);
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
