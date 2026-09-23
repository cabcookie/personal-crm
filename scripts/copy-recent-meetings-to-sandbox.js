/**
 * One-off dev helper: copy the RECENT MEETINGS graph from PROD (read-only) into
 * the SANDBOX, so the sandbox has realistic meeting data after a table-replacing
 * schema change (e.g. the Person lastSeen GSI drops & recreates the Person
 * table). Meeting-centric counterpart to copy-project-to-sandbox.js.
 *
 * Copies, for every Meeting in the last N days (by meetingOn, else createdAt):
 *   Meeting, Activity, NoteBlock (+ Todo for taskItems), ProjectActivity,
 *   Projects, MeetingParticipant, NoteBlockPerson (mention junction), Person,
 *   PersonAccount (current only), Account.
 *
 * Writes go DIRECTLY to DynamoDB (BatchWriteItem) — NOT through AppSync — so
 * original ids and all foreign keys stay intact. Every record's `owner` is
 * rewritten to the sandbox owner (the prod Cognito sub differs from sandbox).
 *
 * Safety:
 *  - PROD access is read-only (Scan/Query/BatchGetItem). Never writes.
 *  - Writes only to sandbox tables (`*-<dev tables>-NONE`).
 *  - Dry run by default; pass --commit to actually write.
 *
 * Usage:
 *   node scripts/copy-recent-meetings-to-sandbox.js [--days 28] [--skip-images] [--commit]
 */
const {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
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
const days = parseInt(arg("days", "28"), 10);
const commit = process.argv.includes("--commit");
const skipImages = process.argv.includes("--skip-images");

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

const S = (item, key) => item?.[key]?.S;
const strList = (item, key) =>
  (item?.[key]?.L ?? []).map((e) => e.S).filter(Boolean);

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

const scanAll = async (table) => {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await prod.send(
      new ScanCommand({ TableName: prodTable(table), ExclusiveStartKey })
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

const isCurrent = (pa) => {
  const today = new Date().toISOString().slice(0, 10);
  const start = S(pa, "startDate");
  const end = S(pa, "endDate");
  if (start && start > today) return false;
  if (end && end < today) return false;
  return true;
};

const meetingDate = (m) => {
  const iso = S(m, "meetingOn") || S(m, "createdAt");
  return iso ? new Date(iso) : null;
};

/* -------------------------------- main -------------------------------- */

const run = async () => {
  console.log(
    `${commit ? "COPYING" : "DRY RUN"} recent meetings ` +
      `(last ${days} days, cutoff ${cutoff.toISOString()}${
        skipImages ? ", skip-images" : ""
      })\n`
  );

  // 1. Meetings in the window (scan Meeting, filter client-side by date).
  const allMeetings = await scanAll("Meeting");
  const meetings = allMeetings.filter((m) => {
    const d = meetingDate(m);
    return d && d >= cutoff;
  });
  const meetingIds = meetings.map((m) => S(m, "id")).filter(Boolean);
  console.log(
    `  meetings: ${meetings.length} of ${allMeetings.length} within window`
  );

  // 2. Activities of those meetings (gsi-Meeting.activities).
  const activities = (
    await Promise.all(
      meetingIds.map((mid) =>
        queryAll("Activity", "gsi-Meeting.activities", "meetingActivitiesId", mid)
      )
    )
  ).flat();
  const activityIds = activities.map((a) => S(a, "id")).filter(Boolean);

  // 3. NoteBlocks (+ Todos for taskItems). Optionally drop s3image blocks.
  const noteBlockIds = activities.flatMap((a) => strList(a, "noteBlockIds"));
  let noteBlocks = await batchGet("NoteBlock", noteBlockIds);
  let activitiesToCopy = activities;
  let skippedImageCount = 0;
  if (skipImages) {
    const imageBlockIds = new Set(
      noteBlocks
        .filter((b) => S(b, "type") === "s3image")
        .map((b) => S(b, "id"))
    );
    skippedImageCount = imageBlockIds.size;
    noteBlocks = noteBlocks.filter((b) => !imageBlockIds.has(S(b, "id")));
    activitiesToCopy = activities.map((a) => {
      const ids = strList(a, "noteBlockIds").filter(
        (id) => !imageBlockIds.has(id)
      );
      return { ...a, noteBlockIds: { L: ids.map((id) => ({ S: id })) } };
    });
  }
  const keepNoteBlockIds = noteBlocks.map((b) => S(b, "id")).filter(Boolean);

  const todoIds = noteBlocks
    .filter((b) => S(b, "type") === "taskItem" && S(b, "todoId"))
    .map((b) => S(b, "todoId"));
  const todos = await batchGet("Todo", todoIds);

  // 4. ProjectActivity junctions (gsi-Activity.forProjects) + Projects.
  const projectJunctions = (
    await Promise.all(
      activityIds.map((aid) =>
        queryAll("ProjectActivity", "gsi-Activity.forProjects", "activityId", aid)
      )
    )
  ).flat();
  const projectIds = projectJunctions
    .map((j) => S(j, "projectsId"))
    .filter(Boolean);
  const projects = await batchGet("Projects", projectIds);

  // 5. MeetingParticipant (gsi-Meeting.participants).
  const participantRows = (
    await Promise.all(
      meetingIds.map((mid) =>
        queryAll(
          "MeetingParticipant",
          "gsi-Meeting.participants",
          "meetingId",
          mid
        )
      )
    )
  ).flat();
  const participantPersonIds = participantRows
    .map((p) => S(p, "personId"))
    .filter(Boolean);

  // 6. NoteBlockPerson mention junctions (gsi-NoteBlock.people) for the kept
  //    note blocks.
  const noteBlockPersonRows = (
    await Promise.all(
      keepNoteBlockIds.map((nbid) =>
        queryAll(
          "NoteBlockPerson",
          "gsi-NoteBlock.people",
          "noteBlockId",
          nbid
        )
      )
    )
  ).flat();
  const mentionJunctionPersonIds = noteBlockPersonRows
    .map((r) => S(r, "personId"))
    .filter(Boolean);

  // Also collect mentions embedded in note-block content JSON (older notes
  // reference people inline, not only via the junction).
  const contentMentionIds = new Set();
  const collect = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "mention" && node.attrs?.id)
      contentMentionIds.add(node.attrs.id);
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

  // 7. Person (participants + mention junctions + content mentions).
  const personIds = [
    ...new Set([
      ...participantPersonIds,
      ...mentionJunctionPersonIds,
      ...contentMentionIds,
    ]),
  ];
  const persons = await batchGet("Person", personIds);

  // 8. PersonAccount (current only) + referenced Accounts.
  const personAccountRows = (
    await Promise.all(
      personIds.map((pid) =>
        queryAll("PersonAccount", "gsi-Person.accounts", "personId", pid)
      )
    )
  ).flat();
  const currentPersonAccounts = personAccountRows.filter(isCurrent);
  const accountIds = currentPersonAccounts
    .map((pa) => S(pa, "accountId"))
    .filter(Boolean);
  const accounts = await batchGet("Account", accountIds);

  // ------------------------------ plan ------------------------------
  const dedupe = (rows) => {
    const m = new Map();
    for (const it of rows) {
      const id = S(it, "id");
      if (id) m.set(id, it);
    }
    return [...m.values()];
  };

  const plan = [
    ["Meeting", dedupe(meetings)],
    ["Activity", dedupe(activitiesToCopy)],
    ["NoteBlock", dedupe(noteBlocks)],
    ["Todo", dedupe(todos)],
    ["ProjectActivity", dedupe(projectJunctions)],
    ["Projects", dedupe(projects)],
    ["MeetingParticipant", dedupe(participantRows)],
    ["NoteBlockPerson", dedupe(noteBlockPersonRows)],
    ["Person", dedupe(persons)],
    ["PersonAccount", dedupe(currentPersonAccounts)],
    ["Account", dedupe(accounts)],
  ];

  console.log("\nPlan (records to copy):");
  for (const [table, items] of plan) {
    console.log(`  ${table.padEnd(20)} ${items.length}`);
  }
  if (skipImages) console.log(`  (skipped ${skippedImageCount} s3image blocks)`);

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
