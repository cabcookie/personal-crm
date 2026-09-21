/**
 * One-off dev helper: copy a single project's recent notes graph from PROD
 * (read-only) into the SANDBOX, so we can test the snapshot/header/summary
 * pipeline against realistic, project-linked data (the sandbox has none after
 * the ProjectActivity GSI change dropped the table).
 *
 * Copies, for the given project and its activities within the last N days:
 *   Projects, ProjectActivity, Activity, NoteBlock (+ Todo for taskItems),
 *   Meeting, MeetingParticipant, Person, PersonAccount (current only), Account.
 *
 * Writes go DIRECTLY to DynamoDB (BatchWriteItem) — NOT through AppSync — so
 * original ids and all foreign keys stay intact. Every record's `owner` is
 * rewritten to the sandbox owner (the prod Cognito sub differs from sandbox).
 *
 * Safety:
 *  - PROD access is read-only (Query/GetItem/BatchGetItem/Scan). Never writes.
 *  - Writes only to sandbox tables (`*-<dev tables>-NONE`).
 *  - Dry run by default; pass --commit to actually write. Dry run prints the
 *    full plan (per-table counts) without touching the sandbox.
 *
 * Usage:
 *   node scripts/copy-project-to-sandbox.js --project <id> [--days 28] [--commit]
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

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const projectId = arg("project", "3ba94b8c-388a-4d33-b680-fd8a4f773b59");
const days = parseInt(arg("days", "28"), 10);
const commit = process.argv.includes("--commit");

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

const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

/* ----------------------------- prod reads ----------------------------- */

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

/* --------------------------- transform + write --------------------------- */

const withSandboxOwner = (item) => {
  const copy = { ...item };
  if (copy.owner) copy.owner = { S: SANDBOX_OWNER };
  return copy;
};

const batchWrite = async (table, items) => {
  if (!commit || !items.length) return;
  const rows = items.map((it) => ({ PutRequest: { Item: withSandboxOwner(it) } }));
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

const S = (item, key) => item?.[key]?.S;
const strList = (item, key) => (item?.[key]?.L ?? []).map((e) => e.S).filter(Boolean);

const effectiveDate = (activity, meetingById) => {
  const meeting = activity.meetingActivitiesId
    ? meetingById.get(S(activity, "meetingActivitiesId"))
    : null;
  const iso =
    (meeting && S(meeting, "meetingOn")) ||
    S(activity, "finishedOn") ||
    S(activity, "createdAt");
  return iso ? new Date(iso) : null;
};

const isCurrent = (pa) => {
  const today = new Date().toISOString().slice(0, 10);
  const start = S(pa, "startDate");
  const end = S(pa, "endDate");
  if (start && start > today) return false;
  if (end && end < today) return false;
  return true;
};

/* -------------------------------- main -------------------------------- */

const run = async () => {
  console.log(
    `${commit ? "COPYING" : "DRY RUN"} project ${projectId} (last ${days} days, cutoff ${cutoff.toISOString()})\n`
  );

  // 1. Project
  const projectItems = await batchGet("Projects", [projectId]);
  if (!projectItems.length) throw new Error("project not found in prod");

  // 2. ProjectActivity junctions for this project
  const allJunctions = await queryAll(
    "ProjectActivity",
    "gsi-Projects.activities",
    "projectsId",
    projectId
  );
  const activityIds = allJunctions.map((j) => S(j, "activityId")).filter(Boolean);

  // 3. Activities + their meetings, to apply the date window
  const activities = await batchGet("Activity", activityIds);
  const meetingIds = activities.map((a) => S(a, "meetingActivitiesId")).filter(Boolean);
  const meetings = await batchGet("Meeting", meetingIds);
  const meetingById = new Map(meetings.map((m) => [S(m, "id"), m]));

  const inWindow = activities.filter((a) => {
    const d = effectiveDate(a, meetingById);
    return d && d >= cutoff;
  });
  const keepActivityIds = new Set(inWindow.map((a) => S(a, "id")));

  // Junctions/meetings limited to in-window activities
  const junctions = allJunctions.filter((j) => keepActivityIds.has(S(j, "activityId")));
  const keepMeetingIds = new Set(
    inWindow.map((a) => S(a, "meetingActivitiesId")).filter(Boolean)
  );
  const keepMeetings = meetings.filter((m) => keepMeetingIds.has(S(m, "id")));

  // 4. NoteBlocks (+ Todos for taskItems) of in-window activities
  const noteBlockIds = inWindow.flatMap((a) => strList(a, "noteBlockIds"));
  const noteBlocks = await batchGet("NoteBlock", noteBlockIds);
  const todoIds = noteBlocks
    .filter((b) => S(b, "type") === "taskItem" && S(b, "todoId"))
    .map((b) => S(b, "todoId"));
  const todos = await batchGet("Todo", todoIds);

  // 5. People: meeting participants + mentions in the note blocks
  const participantRows = (
    await Promise.all(
      [...keepMeetingIds].map((mid) =>
        queryAll("MeetingParticipant", "gsi-Meeting.participants", "meetingId", mid)
      )
    )
  ).flat();
  const participantPersonIds = participantRows.map((p) => S(p, "personId")).filter(Boolean);

  const mentionIds = new Set();
  const collect = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "mention" && node.attrs?.id) mentionIds.add(node.attrs.id);
    if (Array.isArray(node.content)) node.content.forEach(collect);
  };
  for (const b of noteBlocks) {
    const c = S(b, "content");
    if (!c) continue;
    try {
      collect(JSON.parse(c));
    } catch {
      /* ignore non-JSON */
    }
  }

  const personIds = [...new Set([...participantPersonIds, ...mentionIds])];
  const persons = await batchGet("Person", personIds);

  // 6. PersonAccount (current only) + referenced Accounts
  const personAccountRows = (
    await Promise.all(
      personIds.map((pid) =>
        queryAll("PersonAccount", "gsi-Person.accounts", "personId", pid)
      )
    )
  ).flat();
  const currentPersonAccounts = personAccountRows.filter(isCurrent);
  const accountIds = currentPersonAccounts.map((pa) => S(pa, "accountId")).filter(Boolean);
  const accounts = await batchGet("Account", accountIds);

  // ------------------------------ plan ------------------------------
  const plan = [
    ["Projects", projectItems],
    ["ProjectActivity", junctions],
    ["Activity", inWindow],
    ["Meeting", keepMeetings],
    ["NoteBlock", noteBlocks],
    ["Todo", todos],
    ["MeetingParticipant", participantRows],
    ["Person", persons],
    ["PersonAccount", currentPersonAccounts],
    ["Account", accounts],
  ];

  console.log("Plan (records to copy):");
  for (const [table, items] of plan) {
    console.log(`  ${table.padEnd(20)} ${items.length}`);
  }
  console.log(
    `\n(${allJunctions.length} total junctions in prod; ${junctions.length} within window)`
  );

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
