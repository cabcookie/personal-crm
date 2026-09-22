/**
 * One-off dev helper: copy a set of people (by employer account) from PROD
 * (read-only) into the SANDBOX, together with their current PersonAccount
 * employment rows and the referenced Accounts. Used to seed realistic people
 * so the person-embedding backfill + Sonic person detection can be tested
 * after the Person table was recreated (empty) by the GSI change.
 *
 * For each requested account it takes up to `limit` people (via the
 * gsi-Account.people index on PersonAccount, current employments only), then
 * copies: Person, PersonAccount (current only), Account.
 *
 * Writes go DIRECTLY to DynamoDB (BatchWriteItem) — NOT through AppSync — so
 * original ids and foreign keys stay intact. Every record's `owner` is
 * rewritten to the sandbox owner.
 *
 * Safety:
 *  - PROD access is read-only (Query/BatchGetItem). Never writes to prod.
 *  - Writes only to sandbox tables (`*-<dev tables>-NONE`).
 *  - Dry run by default; pass --commit to actually write.
 *
 * Usage (defaults copy ~8 AWS + ~25 ALDI Intl Services people):
 *   node scripts/copy-account-people-to-sandbox.js
 *   node scripts/copy-account-people-to-sandbox.js --commit
 *   node scripts/copy-account-people-to-sandbox.js \
 *     --accounts <accId>:10,<accId>:25 --commit
 */
const {
  DynamoDBClient,
  QueryCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");

const PROD_TABLES = "th6y75krqvgsndwxutb6jhqdwa";
const DEV_TABLES = "p5zstssn2bfppacp7gk5nt4fjq";
const PROD_PROFILE = "impulso-prod";
const DEV_PROFILE = "impulso";
const REGION = "us-east-1";
const SANDBOX_OWNER =
  "d4a834b8-0081-703f-8f59-f8c0b2a0a338::d4a834b8-0081-703f-8f59-f8c0b2a0a338";

// Default selection: AWS (889225c6…, cap 8) + ALDI International Services
// (bc986251…, cap 25). Override with --accounts <id>:<cap>,<id>:<cap>.
const DEFAULT_ACCOUNTS = [
  { accountId: "889225c6-56e4-4baa-b07e-58d79af719e2", limit: 8 },
  { accountId: "bc986251-d0ff-4128-b431-39ce7156e6c3", limit: 25 },
];

const commit = process.argv.includes("--commit");

const parseAccounts = () => {
  const i = process.argv.indexOf("--accounts");
  if (i < 0 || !process.argv[i + 1]) return DEFAULT_ACCOUNTS;
  return process.argv[i + 1].split(",").map((pair) => {
    const [accountId, cap] = pair.split(":");
    return { accountId, limit: parseInt(cap ?? "10", 10) };
  });
};

const prod = new DynamoDBClient({
  region: REGION,
  credentials: fromIni({ profile: PROD_PROFILE }),
});
const dev = new DynamoDBClient({
  region: REGION,
  credentials: fromIni({ profile: DEV_PROFILE }),
});

const prodTable = (m) => `${m}-${PROD_TABLES}-NONE`;
const devTable = (m) => `${m}-${DEV_TABLES}-NONE`;

const S = (item, key) => item?.[key]?.S;

const isCurrent = (pa) => {
  const today = new Date().toISOString().slice(0, 10);
  const start = S(pa, "startDate");
  const end = S(pa, "endDate");
  if (start && start > today) return false;
  if (end && end < today) return false;
  return true;
};

const queryAll = async (table, index, keyName, keyVal) => {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await prod.send(
      new QueryCommand({
        TableName: prodTable(table),
        ...(index ? { IndexName: index } : {}),
        KeyConditionExpression: "#k = :v",
        ExpressionAttributeNames: { "#k": keyName },
        ExpressionAttributeValues: { ":v": { S: keyVal } },
        ExclusiveStartKey,
      })
    );
    items.push(...(res.Items ?? []));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
};

const batchGet = async (table, ids) => {
  const unique = [...new Set(ids.filter(Boolean))];
  const out = [];
  for (let i = 0; i < unique.length; i += 100) {
    let keys = unique.slice(i, i + 100).map((id) => ({ id: { S: id } }));
    while (keys.length) {
      const res = await prod.send(
        new BatchGetItemCommand({
          RequestItems: { [prodTable(table)]: { Keys: keys } },
        })
      );
      out.push(...(res.Responses?.[prodTable(table)] ?? []));
      keys = res.UnprocessedKeys?.[prodTable(table)]?.Keys ?? [];
    }
  }
  return out;
};

const withSandboxOwner = (item) => {
  const copy = { ...item };
  if (copy.owner) copy.owner = { S: SANDBOX_OWNER };
  // Drop any stale embedding fields so the backfill regenerates them fresh in
  // the sandbox (prod owner/context differs; safest to re-embed).
  delete copy.nameEmbedding;
  delete copy.nameEmbeddingSource;
  delete copy.nameEmbeddingUpdatedAt;
  delete copy.nameEmbeddingPending;
  return copy;
};

const batchWrite = async (table, items) => {
  if (!commit || !items.length) return;
  const rows = items.map((it) => ({
    PutRequest: { Item: withSandboxOwner(it) },
  }));
  for (let i = 0; i < rows.length; i += 25) {
    let batch = rows.slice(i, i + 25);
    while (batch.length) {
      const res = await dev.send(
        new BatchWriteItemCommand({
          RequestItems: { [devTable(table)]: batch },
        })
      );
      batch = res.UnprocessedItems?.[devTable(table)] ?? [];
    }
  }
};

const run = async () => {
  const accounts = parseAccounts();
  console.log(
    `${commit ? "COPYING" : "DRY RUN"} people for ${accounts.length} account(s)\n`
  );

  const personIds = new Set();
  const personAccountRows = [];
  const accountIds = new Set();

  for (const { accountId, limit } of accounts) {
    // People currently employed at this account.
    const pas = (
      await queryAll("PersonAccount", "gsi-Account.people", "accountId", accountId)
    ).filter(isCurrent);

    // Take up to `limit` distinct people (a person may have >1 row; dedupe).
    const seen = new Set();
    const picked = [];
    for (const pa of pas) {
      const pid = S(pa, "personId");
      if (!pid || seen.has(pid)) continue;
      seen.add(pid);
      picked.push(pa);
      if (picked.length >= limit) break;
    }

    picked.forEach((pa) => {
      personAccountRows.push(pa);
      personIds.add(S(pa, "personId"));
      accountIds.add(S(pa, "accountId"));
    });
    console.log(
      `  account ${accountId}: ${pas.length} current employment(s), picked ${picked.length}`
    );
  }

  const persons = await batchGet("Person", [...personIds]);
  const accountItems = await batchGet("Account", [...accountIds]);

  const plan = [
    ["Person", persons],
    ["PersonAccount", personAccountRows],
    ["Account", accountItems],
  ];

  console.log("\nPlan (records to copy):");
  for (const [table, items] of plan) {
    console.log(`  ${table.padEnd(16)} ${items.length}`);
  }

  if (!commit) {
    console.log("\nDry run — nothing written. Re-run with --commit to copy.");
    return;
  }

  console.log("\nWriting to sandbox…");
  for (const [table, items] of plan) {
    await batchWrite(table, items);
    console.log(`  wrote ${items.length} -> ${table}`);
  }
  console.log("\nDone.");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
