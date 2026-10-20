import {
  SchedulerClient,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  ConflictException,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";

/**
 * Arms a one-time EventBridge Scheduler schedule that deletes a meeting's live
 * transcript 24h from now (mirrors the project-summary scheduler pattern:
 * matches the user's preference for a one-time schedule over polling). The
 * schedule is keyed per meeting and auto-deletes after it fires; re-running a
 * summary simply moves the fire time out by another 24h (newest wins).
 *
 * Required env (injected by custom/backend/summarize-meeting.ts):
 *  - TRANSCRIPT_DELETE_SCHEDULE_GROUP_NAME  schedule group these live in
 *  - TRANSCRIPT_DELETE_SCHEDULER_ROLE_ARN   role Scheduler assumes to invoke
 *  - TRANSCRIPT_DELETE_TARGET_ARN           delete-meeting-transcript Lambda ARN
 */

export const TRANSCRIPT_DELETE_DELAY_MINUTES = 24 * 60;

const client = new SchedulerClient({});

const env = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env ${key}`);
  return value;
};

/** Names must match [0-9a-zA-Z-_.]{1,64}. */
const scheduleName = (meetingId: string): string => {
  const safeId = meetingId.replace(/[^0-9a-zA-Z-_.]/g, "-");
  return `transcript-delete-${safeId}`.slice(0, 64);
};

/** ISO-8601 without trailing millis/Z, as Scheduler's at() expects. */
const atExpression = (delayMinutes: number): string => {
  const when = new Date(Date.now() + delayMinutes * 60_000);
  return `at(${when.toISOString().split(".")[0]})`;
};

/**
 * Create or re-arm the transcript-delete schedule for one meeting. The target
 * Lambda receives { meetingId, owner } so it can do an owner-guarded delete.
 */
export const upsertTranscriptDeleteSchedule = async (
  meetingId: string,
  owner: string
): Promise<void> => {
  const shared = {
    Name: scheduleName(meetingId),
    GroupName: env("TRANSCRIPT_DELETE_SCHEDULE_GROUP_NAME"),
    ScheduleExpression: atExpression(TRANSCRIPT_DELETE_DELAY_MINUTES),
    FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF },
    ActionAfterCompletion: ActionAfterCompletion.DELETE,
    Target: {
      Arn: env("TRANSCRIPT_DELETE_TARGET_ARN"),
      RoleArn: env("TRANSCRIPT_DELETE_SCHEDULER_ROLE_ARN"),
      Input: JSON.stringify({ meetingId, owner }),
    },
  };

  try {
    await client.send(new CreateScheduleCommand(shared));
  } catch (error) {
    if (error instanceof ConflictException) {
      await client.send(new UpdateScheduleCommand(shared));
      return;
    }
    throw error;
  }
};
