import {
  batchGetItems,
  getItem,
  getItemRaw,
  queryByIndex,
} from "../../process-export-tasks/helpers/dynamodb";
import { fetchCurrentEmployment } from "../../process-export-tasks/helpers/activities";

type OwnerOpts = { owner: string };

/** Parse a JSON string into an array, or null if it isn't valid JSON / not an array. */
const safeParseArray = (s: string): unknown[] | null => {
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export type MeetingRecord = {
  id: string;
  owner?: string;
  sonicTranscript?: unknown;
  sonicMentionedPersonIds?: unknown;
};

export type PersonSummary = {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
};

export type MeetingTopic = {
  projectId: string;
  projectName: string;
  company: string | null;
};

/** Load a Meeting by id (raw, to recover owner — mirrors project-summary/lib/render.ts). */
export const loadMeeting = (meetingId: string): Promise<MeetingRecord | null> =>
  getItemRaw<MeetingRecord>("Meeting", meetingId);

/** Resolve the caller's own linked Person via their User profile (sub::sub). */
export const resolveOwnPersonId = async (
  sub: string
): Promise<string | null> => {
  // The User table's partition key is `profileId` (NOT `id`), formatted as
  // `${sub}::${sub}` — passing `id` here yields DynamoDB's "provided key
  // element does not match the schema" error.
  const user = await getItemRaw<{ personId?: string }>(
    "User",
    `${sub}::${sub}`,
    "profileId"
  );
  return user?.personId ?? null;
};

const toPersonSummary = async (
  personId: string,
  name: string,
  opts: OwnerOpts
): Promise<PersonSummary> => {
  const employment = await fetchCurrentEmployment(personId, opts);
  return {
    id: personId,
    name,
    company: employment?.accountName ?? null,
    role: employment?.position ?? null,
  };
};

/**
 * This meeting's participants, as { id, name, company, role }, ALWAYS
 * including the meeting owner's own linked person (even though the owner
 * never explicitly adds themselves as a participant — see
 * MeetingParticipant/useSonicTranscription; the owner is implicitly always
 * in their own meetings). Also returns the raw id set so the caller can
 * exclude participants from the separately-resolved "mentioned" list.
 */
export const fetchParticipants = async (
  meetingId: string,
  ownerSub: string,
  opts: OwnerOpts
): Promise<{ people: PersonSummary[]; ids: Set<string> }> => {
  const junctions = await queryByIndex(
    "MeetingParticipant",
    "gsi-Meeting.participants",
    "meetingId",
    meetingId,
    opts
  );
  const personIds = [
    ...new Set(
      junctions
        .map((j) => (j as { personId?: string }).personId)
        .filter((id): id is string => !!id)
    ),
  ];

  const ownPersonId = await resolveOwnPersonId(ownerSub);
  if (ownPersonId && !personIds.includes(ownPersonId)) {
    personIds.push(ownPersonId);
  }
  if (!personIds.length) return { people: [], ids: new Set() };

  const personMap = await batchGetItems<{ id: string; name?: string }>(
    "Person",
    personIds,
    opts
  );
  const people = personIds
    .map((id) => personMap.get(id))
    .filter((p): p is { id: string; name: string } => !!p && !!p.name);

  const resolved = await Promise.all(
    people.map((p) => toPersonSummary(p.id, p.name, opts))
  );
  return { people: resolved, ids: new Set(people.map((p) => p.id)) };
};

/**
 * This meeting's "mentioned" people: detected-and-confirmed during the live
 * transcription but not formal participants. The ids come from the client
 * (`sonicMentionedPersonIds`, written alongside the PENDING trigger — see
 * useSonicTranscription.requestSummary) since they aren't reconstructable
 * from any other table. Participants already covered by fetchParticipants
 * are excluded so the same person never appears in both lists.
 */
export const fetchMentionedPeople = async (
  mentionedPersonIds: unknown,
  participantIds: Set<string>,
  opts: OwnerOpts
): Promise<PersonSummary[]> => {
  // The field is a.json() written by the client. Depending on how it was
  // written it can come back from DynamoDB either as a native list or as a
  // JSON string ('["id1","id2"]') — accept both.
  const raw =
    typeof mentionedPersonIds === "string"
      ? safeParseArray(mentionedPersonIds)
      : mentionedPersonIds;
  const ids = Array.isArray(raw)
    ? (raw as unknown[]).filter(
        (id): id is string => typeof id === "string" && !participantIds.has(id)
      )
    : [];
  if (!ids.length) return [];

  const personMap = await batchGetItems<{ id: string; name?: string }>(
    "Person",
    ids,
    opts
  );
  const people = ids
    .map((id) => personMap.get(id))
    .filter((p): p is { id: string; name: string } => !!p && !!p.name);

  return Promise.all(people.map((p) => toPersonSummary(p.id, p.name, opts)));
};

/**
 * This meeting's topics: the projects the user has added to the meeting as
 * Activities, via the ProjectActivity junction. Deduped across activities
 * (a project linked to two activities of the same meeting counts once).
 */
export const fetchTopics = async (
  meetingId: string,
  opts: OwnerOpts
): Promise<MeetingTopic[]> => {
  const activities = await queryByIndex<{ id: string }>(
    "Activity",
    "gsi-Meeting.activities",
    "meetingActivitiesId",
    meetingId,
    opts
  );
  if (!activities.length) return [];

  const projectIdSet = new Set<string>();
  for (const activity of activities) {
    const junctions = await queryByIndex(
      "ProjectActivity",
      "gsi-Activity.forProjects",
      "activityId",
      activity.id,
      opts
    );
    for (const j of junctions) {
      const projectsId = (j as { projectsId?: string }).projectsId;
      if (projectsId) projectIdSet.add(projectsId);
    }
  }
  const projectIds = [...projectIdSet];
  if (!projectIds.length) return [];

  const projectMap = await batchGetItems<{
    id: string;
    project?: string;
    partnerId?: string | null;
  }>("Projects", projectIds, opts);

  const topics: MeetingTopic[] = [];
  for (const id of projectIds) {
    const project = projectMap.get(id);
    if (!project?.project) continue;
    let company: string | null = null;
    if (project.partnerId) {
      const account = await getItem<{ name?: string }>(
        "Account",
        project.partnerId,
        opts
      );
      company = account?.name ?? null;
    }
    topics.push({ projectId: id, projectName: project.project, company });
  }
  return topics;
};
