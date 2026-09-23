import { defineFunction } from "@aws-amplify/backend";

/**
 * Maintains `Person.lastSeen`.
 *
 * Triggered by the DynamoDB streams of MeetingParticipant and NoteBlockPerson.
 * On every INSERT (a person added as a meeting participant, or @-mentioned in a
 * note block) it stamps the referenced Person's `lastSeen` to the record's
 * `createdAt` (falling back to now). This powers the "recently seen people"
 * initial set — the client loads the 50 most recently seen via the Person
 * `listPeopleByLastSeen` GSI instead of loading every person into memory.
 *
 * Writes go DIRECTLY to DynamoDB (UpdateItem) — NOT through AppSync — so the
 * `owner` attribute is preserved untouched (AppSync would require an owner and
 * we don't have the caller identity in a stream event). No debounce: a single
 * conditional UpdateItem is cheap and idempotent (we only move lastSeen
 * forward).
 */
export const touchPersonLastSeen = defineFunction({
  name: "touch-person-last-seen",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 30,
  logging: { retention: "1 week" },
});
