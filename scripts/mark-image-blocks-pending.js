/**
 * One-off backfill step 1: mark existing image note blocks as pending.
 *
 * Scans the NoteBlock table for `s3image` blocks that do not yet have an
 * `imageDescription`, and sets `imageDescriptionPending = "1"` on them. That
 * populates the sparse `listImageDescriptionPending` GSI, which the
 * backfill-images-enqueue Lambda then pages through to fan work out to SQS.
 *
 * This is the only full-table scan in the backfill; it runs once, offline,
 * throttled, and writes only a tiny marker attribute. It is idempotent —
 * re-running only (re)marks blocks still missing a description.
 *
 * Usage:
 *   node scripts/mark-image-blocks-pending.js -env dev
 *   node scripts/mark-image-blocks-pending.js -env dev --commit
 *
 * Without --commit it runs a dry run and only reports how many blocks WOULD be
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
const tableName = getTable("NoteBlock");

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const markBlock = async (id) => {
  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: id } },
      // Only set the marker if it isn't already set AND no description exists —
      // keeps the write idempotent and avoids touching already-processed rows.
      UpdateExpression: "SET imageDescriptionPending = :one",
      ConditionExpression:
        "attribute_not_exists(imageDescriptionPending) AND attribute_not_exists(imageDescription)",
      ExpressionAttributeValues: { ":one": { S: "1" } },
    })
  );
};

const run = async () => {
  console.log(
    `${commit ? "MARKING" : "DRY RUN — scanning"} image blocks in ${tableName}\n`
  );

  let lastKey = undefined;
  let scanned = 0;
  let candidates = 0;
  let marked = 0;

  do {
    const res = await client.send(
      new ScanCommand({
        TableName: tableName,
        // Server-side filter: only s3image blocks missing a description.
        FilterExpression:
          "#t = :s3image AND attribute_not_exists(imageDescription)",
        ExpressionAttributeNames: { "#t": "type" },
        ExpressionAttributeValues: { ":s3image": { S: "s3image" } },
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
          await markBlock(id);
          marked += 1;
        } catch (err) {
          // ConditionalCheckFailed = already marked/described; ignore.
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
      `Would mark ${candidates} block(s). Re-run with --commit to apply.`
    );
  } else {
    console.log(`Marked ${marked} block(s) as pending.`);
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
