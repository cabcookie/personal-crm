/**
 * One-off backfill: populate Person.lastSeen from existing relationships.
 *
 * Scans MeetingParticipant and NoteBlockPerson, finds the most recent
 * `createdAt` per personId (i.e. the last time a person was seen — added to a
 * meeting or @-mentioned in a note), and stamps it onto Person.lastSeen with a
 * forward-only conditional UpdateItem (same semantics as the
 * touch-person-last-seen stream Lambda).
 *
 * Powers the "recently seen people" initial set. Needed after the Person table
 * is dropped/recreated by the lastSeen GSI change, and to seed lastSeen for
 * people who were seen before the stream Lambda existed. Idempotent.
 *
 * Usage:
 *   node scripts/backfill-person-last-seen.js -env dev
 *   node scripts/backfill-person-last-seen.js -env dev --commit
 *
 * Dry run by default: reports how many people WOULD be stamped. Pass --commit
 * to write.
 */
const {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { getEnvironment } = require("./import-data/environments");

const env = getEnvironment();
const commit = process.argv.includes("--commit");

const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});

const table = (model) => `${model}-${env.tables}-NONE`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Scan a junction table and fold the latest createdAt per personId into `acc`.
 */
const foldLatestByPerson = async (model, acc) => {
  let lastKey;
  let scanned = 0;
  do {
    const res = await client.send(
      new ScanCommand({
        TableName: table(model),
        ProjectionExpression: "personId, createdAt",
        ExclusiveStartKey: lastKey,
        Limit: 500,
      })
    );
    for (const it of res.Items ?? []) {
      const personId = it.personId?.S;
      const createdAt = it.createdAt?.S;
      if (!personId || !createdAt) continue;
      const prev = acc.get(personId);
      if (!prev || createdAt > prev) acc.set(personId, createdAt);
    }
    scanned += res.ScannedCount ?? 0;
    lastKey = res.LastEvaluatedKey;
    process.stdout.write(`\r  scanning ${model}: ${scanned}`);
  } while (lastKey);
  process.stdout.write("\n");
};

// Send one forward-only stamp, retrying transient/throttling errors with
// exponential backoff. Returns "stamped" | "skipped". Throws only after
// exhausting retries, so a real failure is never silently swallowed.
const stampOnce = (personId, seenAt) =>
  client.send(
    new UpdateItemCommand({
      TableName: table("Person"),
      Key: { id: { S: personId } },
      UpdateExpression: "SET lastSeen = :s",
      // Forward-only, and only for an existing person.
      ConditionExpression:
        "attribute_exists(id) AND (attribute_not_exists(lastSeen) OR lastSeen < :s)",
      ExpressionAttributeValues: { ":s": { S: seenAt } },
    })
  );

const TRANSIENT = new Set([
  "ProvisionedThroughputExceededException",
  "ThrottlingException",
  "RequestLimitExceeded",
  "InternalServerError",
  "TransactionConflictException",
]);

const stamp = async (personId, seenAt) => {
  let attempt = 0;
  for (;;) {
    try {
      await stampOnce(personId, seenAt);
      return "stamped";
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") return "skipped";
      if (TRANSIENT.has(err.name) && attempt < 6) {
        await sleep(100 * 2 ** attempt); // 100,200,400,...,3200ms
        attempt += 1;
        continue;
      }
      throw err; // non-transient, or retries exhausted
    }
  }
};

const run = async () => {
  console.log(
    `${commit ? "BACKFILLING" : "DRY RUN"} Person.lastSeen in ${env.tables}\n`
  );

  const latest = new Map();
  await foldLatestByPerson("MeetingParticipant", latest);
  await foldLatestByPerson("NoteBlockPerson", latest);

  console.log(`\n  ${latest.size} distinct people seen across relationships.`);

  if (!commit) {
    console.log("\nDry run — nothing written. Re-run with --commit to apply.");
    return;
  }

  let stamped = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;
  for (const [personId, seenAt] of latest) {
    try {
      const result = await stamp(personId, seenAt);
      if (result === "stamped") stamped += 1;
      else skipped += 1;
    } catch (err) {
      failed += 1;
      console.error(
        `\n  failed to stamp ${personId}: ${err.name} ${err.message}`
      );
    }
    processed += 1;
    if (processed % 20 === 0) await sleep(40); // gentle, steady throttle
    process.stdout.write(
      `\r  stamped ${stamped}, skipped ${skipped}, failed ${failed} (${processed}/${latest.size})`
    );
  }
  console.log(
    `\n\nDone. Stamped ${stamped}, skipped ${skipped}, failed ${failed}.`
  );
  if (failed > 0) {
    console.log(
      "Some writes failed after retries. Re-run (idempotent) to finish them."
    );
    process.exitCode = 1;
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
