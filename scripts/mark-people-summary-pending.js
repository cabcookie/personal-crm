/**
 * One-off backfill step 1: mark people as pending a person summary.
 *
 * Only people with ACTIVITY are marked: at least one learning
 * (PersonLearning), one mention (NoteBlockPerson) or one meeting
 * (MeetingParticipant). People without any of these would get no summary
 * anyway, so they are not queued. For each such person without a
 * `personSummary` yet, sets `personSummaryPending = "1"`, which populates the
 * sparse `listPersonSummaryPending` GSI that the
 * backfill-person-summary-enqueue Lambda pages through.
 *
 * Idempotent: re-running only (re)marks people still missing a summary.
 *
 * Usage:
 *   node scripts/mark-people-summary-pending.js -env dev
 *   node scripts/mark-people-summary-pending.js -env dev --commit
 *   node scripts/mark-people-summary-pending.js -env dev --commit --limit 20
 *
 * Without --commit it runs a dry run and only reports how many people WOULD be
 * marked. --limit N marks at most N people (for a first small test run).
 */
const {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { getEnvironment } = require("./import-data/environments");

const env = getEnvironment();
// Build names directly (the gitignored environments helper only maps a subset
// of models): <Model>-<api id>-NONE.
const getTable = (model) => `${model}-${env.tables}-NONE`;
const commit = process.argv.includes("--commit");
const limitIdx = process.argv.indexOf("--limit");
const limit =
  limitIdx >= 0 ? parseInt(process.argv[limitIdx + 1], 10) : Infinity;
const personTable = getTable("Person");

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Collect all distinct personIds referenced by a junction table. */
const collectPersonIds = async (model, out) => {
  const tableName = getTable(model);
  let lastKey = undefined;
  let scanned = 0;
  do {
    const res = await client.send(
      new ScanCommand({
        TableName: tableName,
        ProjectionExpression: "personId",
        ExclusiveStartKey: lastKey,
        Limit: 500,
      })
    );
    scanned += res.ScannedCount ?? 0;
    for (const item of res.Items ?? []) {
      if (item.personId?.S) out.add(item.personId.S);
    }
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);
  console.log(`  ${model}: scanned ${scanned}, people so far ${out.size}`);
};

const markPerson = async (id) => {
  await client.send(
    new UpdateItemCommand({
      TableName: personTable,
      Key: { id: { S: id } },
      UpdateExpression: "SET personSummaryPending = :one",
      // Person must exist, not be marked already, and have no summary yet.
      ConditionExpression:
        "attribute_exists(id) AND attribute_not_exists(personSummaryPending) AND attribute_not_exists(personSummary)",
      ExpressionAttributeValues: { ":one": { S: "1" } },
    })
  );
};

const run = async () => {
  console.log(
    `${commit ? "MARKING" : "DRY RUN"} people with activity in ${personTable}\n`
  );

  const personIds = new Set();
  for (const model of ["PersonLearning", "NoteBlockPerson", "MeetingParticipant"]) {
    await collectPersonIds(model, personIds);
  }
  console.log(`\n${personIds.size} people with activity.`);

  if (!commit) {
    console.log(
      `Would mark up to ${Math.min(personIds.size, limit)} person(s) (minus those already summarised). Re-run with --commit to apply.`
    );
    return;
  }

  let marked = 0;
  let skipped = 0;
  for (const id of personIds) {
    if (marked >= limit) break;
    try {
      await markPerson(id);
      marked += 1;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") skipped += 1;
      else console.error(`  failed to mark ${id}:`, err.message);
    }
    process.stdout.write(`\r  marked ${marked}, skipped ${skipped}`);
    // Gentle throttle to stay light on table capacity.
    await sleep(20);
  }
  console.log(`\n\nDone. Marked ${marked} person(s) as pending.`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
