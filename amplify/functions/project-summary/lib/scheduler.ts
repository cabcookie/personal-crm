import {
  SchedulerClient,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  ConflictException,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";

/**
 * Creates/overwrites one-time EventBridge Scheduler schedules used to debounce
 * the snapshot and summary Lambdas. Each schedule is named deterministically
 * per (kind, targetId) so a reschedule while one is pending simply moves the
 * fire time — the trailing-debounce mechanism.
 *
 * Keying:
 *  - snapshot schedules are keyed by ACTIVITY id (one snapshot per activity),
 *  - summary schedules are keyed by PROJECT id (one summary per project, so
 *    several activities of the same project coalesce into a single run),
 *  - meeting-header schedules are keyed by MEETING id.
 *
 * On every note change we re-arm the activity's snapshot at +5 min and each
 * linked project's summary at +7 min. The 2-min gap guarantees the snapshot
 * (which the summary consumes) is written before the summary fires, and
 * because both timers move together on each edit, that ordering holds no
 * matter how long editing continues. Meeting headers are re-armed at +5 min
 * whenever the meeting, its participants, or its activities' mentions change.
 *
 * Required env (injected by custom/backend/project-summary.ts):
 *  - SCHEDULE_GROUP_NAME         schedule group these live in
 *  - SCHEDULER_ROLE_ARN          role Scheduler assumes to invoke the targets
 *  - SNAPSHOT_TARGET_ARN         generate-activity-snapshot Lambda ARN
 *  - SUMMARY_TARGET_ARN          generate-project-summary Lambda ARN
 *  - MEETING_HEADER_TARGET_ARN   generate-meeting-header Lambda ARN
 */

export const SNAPSHOT_DELAY_MINUTES = 5;
export const SUMMARY_DELAY_MINUTES = 7;
export const MEETING_HEADER_DELAY_MINUTES = 5;
export const PERSON_EMBEDDING_DELAY_MINUTES = 2;
export const PROJECT_EMBEDDING_DELAY_MINUTES = 2;

const client = new SchedulerClient({});

type Kind =
  | "snapshot"
  | "summary"
  | "meeting-header"
  | "person-embedding"
  | "project-embedding";

const env = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env ${key}`);
  return value;
};

const targetArnFor = (kind: Kind): string => {
  switch (kind) {
    case "snapshot":
      return env("SNAPSHOT_TARGET_ARN");
    case "summary":
      return env("SUMMARY_TARGET_ARN");
    case "meeting-header":
      return env("MEETING_HEADER_TARGET_ARN");
    case "person-embedding":
      return env("PERSON_EMBEDDING_TARGET_ARN");
    case "project-embedding":
      return env("PROJECT_EMBEDDING_TARGET_ARN");
  }
};

/**
 * EventBridge Scheduler names must match [0-9a-zA-Z-_.]{1,64}. Ids are UUIDs
 * (safe) but we sanitise anyway and keep the kind prefix for readability.
 */
const scheduleName = (kind: Kind, id: string): string => {
  const safeId = id.replace(/[^0-9a-zA-Z-_.]/g, "-");
  return `${kind}-${safeId}`.slice(0, 64);
};

/** ISO-8601 without the trailing `Z`/millis, as Scheduler's at() expects. */
const atExpression = (delayMinutes: number): string => {
  const when = new Date(Date.now() + delayMinutes * 60_000);
  return `at(${when.toISOString().split(".")[0]})`;
};

type UpsertArgs = {
  kind: Kind;
  /** Activity id (snapshot), project id (summary), or meeting id (header). */
  id: string;
  delayMinutes: number;
};

const inputFor = (kind: Kind, id: string): Record<string, string> => {
  switch (kind) {
    case "snapshot":
      return { activityId: id };
    case "summary":
      return { projectId: id };
    case "meeting-header":
      return { meetingId: id };
    case "person-embedding":
      return { personId: id };
    case "project-embedding":
      return { projectId: id };
  }
};

export const upsertOneTimeSchedule = async ({
  kind,
  id,
  delayMinutes,
}: UpsertArgs): Promise<void> => {
  const Name = scheduleName(kind, id);
  const GroupName = env("SCHEDULE_GROUP_NAME");

  // The target handler reads the id under the key it expects.
  const input = inputFor(kind, id);

  const shared = {
    Name,
    GroupName,
    ScheduleExpression: atExpression(delayMinutes),
    // One-time schedules require a flexible time window setting; OFF = fire at
    // the exact time.
    FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF },
    // Auto-delete after it fires so the group doesn't accumulate dead
    // schedules (one-time schedules otherwise linger).
    ActionAfterCompletion: ActionAfterCompletion.DELETE,
    Target: {
      Arn: targetArnFor(kind),
      RoleArn: env("SCHEDULER_ROLE_ARN"),
      Input: JSON.stringify(input),
    },
  };

  try {
    await client.send(new CreateScheduleCommand(shared));
  } catch (error) {
    if (error instanceof ConflictException) {
      // Already pending — move the fire time out (this is the debounce: the
      // newest change wins). Update can itself hit a ConflictException when two
      // invocations touch the same schedule concurrently (e.g. two activities
      // of one project processed in parallel), so retry with small backoff.
      await updateWithRetry(shared);
      return;
    }
    throw error;
  }
};

const updateWithRetry = async (
  shared: ConstructorParameters<typeof UpdateScheduleCommand>[0],
  attempts = 4
): Promise<void> => {
  for (let i = 0; i < attempts; i++) {
    try {
      await client.send(new UpdateScheduleCommand(shared));
      return;
    } catch (error) {
      if (error instanceof ConflictException && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 100 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};
