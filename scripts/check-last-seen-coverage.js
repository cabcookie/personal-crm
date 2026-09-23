/**
 * Diagnostic (read-only): compare people seen in relationships vs. people that
 * actually have lastSeen set, and split the gap into "orphan" references
 * (personId no longer exists as a Person row) vs. real misses (person exists
 * but was not stamped). Helps decide whether a backfill re-run is needed.
 *
 * Usage: node scripts/check-last-seen-coverage.js -env prod
 */
const {
  DynamoDBClient,
  ScanCommand,
  BatchGetItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { getEnvironment } = require("./import-data/environments");

const env = getEnvironment();
const client = new DynamoDBClient({
  region: env.region,
  credentials: fromIni({ profile: env.profile }),
});
const table = (m) => `${m}-${env.tables}-NONE`;

const foldSeen = async (model, acc) => {
  let key;
  do {
    const r = await client.send(
      new ScanCommand({
        TableName: table(model),
        ProjectionExpression: "personId",
        ExclusiveStartKey: key,
        Limit: 500,
      })
    );
    for (const it of r.Items ?? []) {
      const id = it.personId?.S;
      if (id) acc.add(id);
    }
    key = r.LastEvaluatedKey;
  } while (key);
};

// Fetch which of the given ids exist, and which of those have lastSeen.
const inspect = async (ids) => {
  let exists = 0;
  let existsWithLastSeen = 0;
  const missing = []; // exist but no lastSeen
  for (let i = 0; i < ids.length; i += 100) {
    let keys = ids.slice(i, i + 100).map((id) => ({ id: { S: id } }));
    while (keys.length) {
      const r = await client.send(
        new BatchGetItemCommand({
          RequestItems: {
            [table("Person")]: {
              Keys: keys,
              ProjectionExpression: "id, lastSeen",
            },
          },
        })
      );
      for (const it of r.Responses?.[table("Person")] ?? []) {
        exists += 1;
        if (it.lastSeen?.S) existsWithLastSeen += 1;
        else missing.push(it.id.S);
      }
      keys = r.UnprocessedKeys?.[table("Person")]?.Keys ?? [];
    }
  }
  return { exists, existsWithLastSeen, missing };
};

(async () => {
  const seen = new Set();
  await foldSeen("MeetingParticipant", seen);
  await foldSeen("NoteBlockPerson", seen);
  const ids = [...seen];
  console.log(`distinct people seen in relationships: ${ids.length}`);

  const { exists, existsWithLastSeen, missing } = await inspect(ids);
  console.log(`  of those, exist as Person row:      ${exists}`);
  console.log(`  orphan refs (person deleted):        ${ids.length - exists}`);
  console.log(`  exist AND have lastSeen:             ${existsWithLastSeen}`);
  console.log(`  exist but MISSING lastSeen:          ${missing.length}`);
  if (missing.length) {
    console.log(`  sample missing ids: ${missing.slice(0, 5).join(", ")}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
