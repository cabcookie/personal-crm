import { client } from "@/lib/amplify";
import type {
  DetectedPerson,
  SuggestedProject,
} from "@/api/useSonicTranscription";

/**
 * Persisted shape of Meeting.sonicDetections (see amplify/data/resource.ts).
 * Mirrors the in-memory DetectedPerson/SuggestedProject shapes exactly, so
 * read-back on reload needs no translation.
 */
export type PersistedDetections = {
  people: DetectedPerson[];
  projects: SuggestedProject[];
};

export const emptyDetections: PersistedDetections = {
  people: [],
  projects: [],
};

/**
 * Serializes every write to Meeting.sonicDetections for ONE meeting through a
 * single in-memory promise chain, so concurrent writers (a Sonic tool-call
 * result arriving while the user clicks "confirm", or two tool results
 * resolving back-to-back) can never race: each write reads the field's
 * current value fresh from the server, applies its own delta, and writes the
 * result back before the next queued write starts its own read.
 *
 * This is deliberately an in-browser-tab mutex, not a server-side queue —
 * all writers here (tool-call results, user clicks) originate from the same
 * tab's single Sonic session bound to one meeting at a time, so there's no
 * cross-process/cross-device race to guard against.
 */
class MeetingDetectionsQueue {
  private tail: Promise<unknown> = Promise.resolve();

  /**
   * Enqueue a read-modify-write: fetches the meeting's current
   * sonicDetections, passes it to `mutate`, and writes the result back.
   * Runs after every previously enqueued write for this meeting has
   * completed. Returns the written value so a caller can update local state
   * from the authoritative result (not from its own stale optimistic guess).
   */
  enqueue(
    meetingId: string,
    mutate: (current: PersistedDetections) => PersistedDetections
  ): Promise<PersistedDetections> {
    const run = this.tail.then(() => readModifyWrite(meetingId, mutate));
    // Keep the chain alive even if this step rejects, so later writes still
    // run — but swallow the rejection here (already logged in readModifyWrite)
    // so one failed write doesn't poison every write after it.
    this.tail = run.catch(() => undefined);
    return run;
  }
}

// One queue per meeting id, created lazily. A meeting's queue is cheap
// (a single pending promise) and never explicitly torn down — the whole map
// is small (bounded by meetings touched in this tab's lifetime).
const queues = new Map<string, MeetingDetectionsQueue>();

const queueFor = (meetingId: string): MeetingDetectionsQueue => {
  let q = queues.get(meetingId);
  if (!q) {
    q = new MeetingDetectionsQueue();
    queues.set(meetingId, q);
  }
  return q;
};

export const parseDetections = (value: unknown): PersistedDetections => {
  if (!value) return emptyDetections;
  const obj = typeof value === "string" ? safeParse(value) : value;
  if (!obj || typeof obj !== "object") return emptyDetections;
  const { people, projects } = obj as Partial<PersistedDetections>;
  return {
    people: Array.isArray(people) ? people : [],
    projects: Array.isArray(projects) ? projects : [],
  };
};

const safeParse = (s: string): unknown => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const readModifyWrite = async (
  meetingId: string,
  mutate: (current: PersistedDetections) => PersistedDetections
): Promise<PersistedDetections> => {
  const { data: current, errors: readErrors } = await client.models.Meeting.get(
    { id: meetingId },
    { selectionSet: ["id", "sonicDetections"] }
  );
  if (readErrors) {
    console.error("sonicDetections read", readErrors);
  }
  const before = parseDetections(current?.sonicDetections);
  const after = mutate(before);

  const { errors: writeErrors } = await client.models.Meeting.update({
    id: meetingId,
    // a.json() must be sent as a JSON *string*: the Amplify client declares
    // the GraphQL variable as `String` (AWSJSON) but doesn't stringify the
    // value, so a raw object/array can make AppSync reject the mutation
    // ("... has an invalid value"). parseDetections reads back either form.
    sonicDetections: JSON.stringify(after),
    sonicDetectionsUpdatedAt: new Date().toISOString(),
  });
  if (writeErrors) console.error("sonicDetections write", writeErrors);
  return after;
};

/**
 * Enqueue a detections mutation for the given meeting. The `mutate` callback
 * receives the field's latest server value (never a stale local copy) and
 * must return the full new value. Safe to call from multiple sites without
 * any extra locking — ordering and read-freshness are handled here.
 */
export const mutateSonicDetections = (
  meetingId: string,
  mutate: (current: PersistedDetections) => PersistedDetections
): Promise<PersistedDetections> =>
  queueFor(meetingId).enqueue(meetingId, mutate);
