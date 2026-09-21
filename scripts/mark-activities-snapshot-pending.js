/**
 * One-off backfill step 1: mark ProjectActivity rows whose Activity has no
 * cached snapshot yet.
 *
 * Scans ProjectActivity, looks up each row's Activity, and sets
 * `snapshotPending = "1"` on rows whose Activity lacks `notesMarkdownUpdatedAt`
 * (i.e. never snapshotted). That populates the sparse `listSnapshotPending`
 * GSI, which backfill-snapshots-enqueue then pages (project-by-project) to fan
 * work out to SQS.
 *
 * Idempotent: the conditional write only marks rows not already marked.
 *
 * Usage:
 *   node scripts/mark-activities-snapshot-pending.js -env dev
 *   node scripts/mark-activities-snapshot-pending.js -env dev --commit
 *
 * Without --commit it's a dry run (reports how many rows WOULD be marked).
 */
const {
  DynamoDBClient,
  ScanCommand,
  BatchGetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { getEnvironment, getTable } = require("./import-data/environments");

const env = getEnvironment();
const commit = process.argv.includes("--commit");
const paTable = getTable("ProjectActivity");
const activityTable = getTable("Activity");

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Return the set of activityIds (from the given list) that already have a
 * cached snapshot (notesMarkdownUpdatedAt present). */
const activitiesWithSnapshot = async (ids) => {
  const withSnapshot = new Set();
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    let keys = chunk.map((id) => ({ id: { S: id } }));
    while (keys.length) {
      const res = await client.send(
        new BatchGetItemCommand({
          RequestItems: {
            [activityTable]: {
              Keys: keys,
              ProjectionExpression: "id, notesMarkdownUpdatedAt",
            },
          },
        })
      );
      for (const item of res.Responses?.[activityTable] ?? []) {
        if (item.notesMarkdownUpdatedAt?.S) withSnapshot.add(item.id.S);
      }
      keys = res.UnprocessedKeys?.[activityTable]?.Keys ?? [];
    }
  }
  return withSnapshot;
};

const markRow = async (rowId) => {
  await client.send(
    new UpdateItemCommand({
      TableName: paTable,
      Key: { id: { S: rowId } },
      UpdateExpression: "SET snapshotPending = :one",
      ConditionExpression: "attribute_not_exists(snapshotPending)",
      ExpressionAttributeValues: { ":one": { S: "1" } },
    })
  );
};

const run = async () => {
  console.log(
    `${commit ? "MARKING" : "DRY RUN — scanning"} ProjectActivity rows in ${paTable}\n`
  );

  let lastKey;
  let scanned = 0;
  let candidates = 0;
  let marked = 0;

  do {
    const res = await client.send(
      new ScanCommand({
        TableName: paTable,
        ProjectionExpression: "id, activityId",
        ExclusiveStartKey: lastKey,
        Limit: 200,
      })
    );

    const rows = (res.Items ?? []).map((i) => ({
      id: i.id?.S,
      activityId: i.activityId?.S,
    }));
    scanned += rows.length;

    const activityIds = [
      ...new Set(rows.map((r) => r.activityId).filter(Boolean)),
    ];
    const haveSnapshot = await activitiesWithSnapshot(activityIds);

    const pendingRows = rows.filter(
      (r) => r.id && r.activityId && !haveSnapshot.has(r.activityId)
    );
    candidates += pendingRows.length;

    if (commit) {
      for (const r of pendingRows) {
        try {
          await markRow(r.id);
          marked += 1;
        } catch (err) {
          if (err.name !== "ConditionalCheckFailedException") {
            console.error(`  failed to mark ${r.id}:`, err.message);
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
      `Would mark ${candidates} row(s). Re-run with --commit to apply.`
    );
  } else {
    console.log(`Marked ${marked} row(s) as pending.`);
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
