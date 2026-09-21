# Backfill Runbooks

One-off backfills that populate the cached Markdown building blocks for
existing data. Both are **idempotent**, **throttled** (worker reserved
concurrency = 2), and safe to re-run. Each follows the same shape:

1. a **mark** script sets a sparse `*Pending` flag on the records to process
   (dry-run by default; `--commit` to write),
2. an **enqueue** Lambda pages the sparse GSI and fans work onto an SQS queue
   (self-continues if it nears its time budget),
3. a **worker** Lambda processes each message, does the work, and clears the
   flag. Failures retry, then land in a DLQ.

`-env` maps to `scripts/env.json` (`dev` = sandbox, `prod` = production). Prod
uses the `impulso-prod` AWS profile.

---

## Prerequisites

- The feature must be **deployed** to the target environment first (the
  Lambdas, queues, and GSIs must exist).
- AWS CLI access with the right profile (`impulso` for sandbox, `impulso-prod`
  for prod).

Find the physical Lambda + queue names for the environment:

```bash
PROFILE=impulso-prod   # or impulso for sandbox
aws lambda list-functions --profile $PROFILE --region us-east-1 \
  --query "Functions[?contains(FunctionName,'backfill')].FunctionName" --output text
```

---

## Backfill 1 — Image descriptions

Generates Bedrock (vision) descriptions for existing `s3image` note blocks that
don't have one yet. Run this **before** the snapshot backfill so the
descriptions flow into the activity snapshots.

```bash
# 1. Dry run — reports how many blocks would be marked
node scripts/mark-image-blocks-pending.js -env prod

# 2. Mark them
node scripts/mark-image-blocks-pending.js -env prod --commit

# 3. Kick off the enqueue Lambda (empty payload)
aws lambda invoke --profile impulso-prod --region us-east-1 \
  --function-name <backfill-images-enqueue-fn> \
  --cli-binary-format raw-in-base64-out --payload '{}' /tmp/out.json
```

## Backfill 2 — Activity snapshots (+ meeting headers + summaries)

Marks `ProjectActivity` rows whose Activity has no cached snapshot, then per
row: writes `notesMarkdown` + `activityHeaderMarkdown`, fills the meeting header
if missing, and arms the project's summary (debounced, so one run per project).

```bash
node scripts/mark-activities-snapshot-pending.js -env prod          # dry run
node scripts/mark-activities-snapshot-pending.js -env prod --commit # mark

aws lambda invoke --profile impulso-prod --region us-east-1 \
  --function-name <backfill-snapshots-enqueue-fn> \
  --cli-binary-format raw-in-base64-out --payload '{}' /tmp/out.json
```

Project summaries are **not** run directly — the snapshot write arms the
summary scheduler, which fires ~7 min after the last change per project.

---

## What to watch

- **Worker logs** — `processed` vs `message failed` counts:
  ```bash
  aws logs tail <worker-log-group> --profile impulso-prod --since 15m --format short \
    | grep -cE "processed|message failed"
  ```
- **DLQ depth** should stay 0. Find the DLQ and check:
  ```bash
  aws sqs get-queue-attributes --profile impulso-prod --region us-east-1 \
    --queue-url <dlq-url> --attribute-names ApproximateNumberOfMessages
  ```
- **Remaining work** — the sparse GSI should drain to 0. For snapshots:
  ```bash
  aws dynamodb query --profile impulso-prod --region us-east-1 \
    --table-name ProjectActivity-<tables>-NONE \
    --index-name projectActivitiesBySnapshotPendingAndProjectsId \
    --key-condition-expression "snapshotPending = :p" \
    --expression-attribute-values '{":p":{"S":"1"}}' --select COUNT --query Count
  ```
- **Spot-check** a few records got the expected fields
  (`notesMarkdown` / `activityHeaderMarkdown` on Activity,
  `meetingHeaderMarkdown` on Meeting, `imageDescription` on NoteBlock).

## Recovery

- **Re-run**: safe. Marking only flags records still missing the cache; workers
  overwrite deterministically. Re-invoke the enqueue Lambda to reprocess
  whatever is still flagged.
- **DLQ has messages**: inspect the worker error in CloudWatch, fix the cause,
  then redrive the DLQ back to the main queue (SQS console → DLQ → Redrive).
- **Tune throughput**: bump the worker `reservedConcurrentExecutions` in
  `amplify/custom/backend/project-summary.ts` (kept at 2 to respect Bedrock
  rate limits) and redeploy.

## Notes / gotchas

- The physical GSI name is **not** the schema `queryField` name — it is derived
  from the key schema (e.g. `projectActivitiesBySnapshotPendingAndProjectsId`,
  `noteBlocksByImageDescriptionPending`). Confirm via `describe-table` if unsure.
- Changing a table's secondary indexes drops & recreates the table **in the
  sandbox only** (Amplify deploy behavior); production is unaffected.
- `scripts/copy-project-to-sandbox.js` is a dev-only helper that copies a
  project's recent notes graph from prod (read-only) into the sandbox to test
  this pipeline with realistic, project-linked data.
