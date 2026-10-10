import {
  blocksToDoc,
  collectMentionIds,
  collectS3Keys,
  jsonFieldToDoc,
  textToDoc,
  type BlockRecord,
  type DocSource,
  type TodoRecord,
} from "./documents";
import type {
  Account,
  AccountLearning,
  Activity,
  Context,
  Doc,
  LearningStatus,
  Meeting,
  Person,
  PersonLearning,
  Profile,
  Project,
  Relationship,
  Warning,
} from "./types";

/**
 * Assembles the export entities from raw DynamoDB records (already filtered to
 * the exporting owner). Pure — the handler does the I/O.
 */

type Rec = Record<string, unknown>;

export type RawTables = {
  User: Rec[];
  Person: Rec[];
  PersonDetail: Rec[];
  PersonAccount: Rec[];
  PersonRelationship: Rec[];
  PersonLearning: Rec[];
  Account: Rec[];
  AccountLearning: Rec[];
  AccountLearningPerson: Rec[];
  Projects: Rec[];
  AccountProjects: Rec[];
  Meeting: Rec[];
  MeetingParticipant: Rec[];
  Activity: Rec[];
  ProjectActivity: Rec[];
  NoteBlock: Rec[];
  Todo: Rec[];
};

export type ExportData = {
  profile: Profile;
  people: Person[];
  relationships: Relationship[];
  personLearnings: PersonLearning[];
  accounts: Account[];
  accountLearnings: AccountLearning[];
  projects: Project[];
  meetings: Meeting[];
  activities: Activity[];
  /** s3Key -> description info of the image blocks, for files.json. */
  imageBlocks: Map<
    string,
    { description: string | null; descriptionUpdatedAt: string | null }
  >;
  warnings: Warning[];
};

const str = (r: Rec, key: string): string | null => {
  const v = r[key];
  return typeof v === "string" && v !== "" ? v : null;
};

const req = (r: Rec, key: string): string => str(r, key) ?? "";

const byCreated = <T extends { createdAt: string; id: string }>(a: T, b: T) =>
  a.createdAt === b.createdAt
    ? a.id.localeCompare(b.id)
    : a.createdAt.localeCompare(b.createdAt);

const sortRecs = (recs: Rec[]): Rec[] =>
  [...recs].sort((a, b) =>
    byCreated(
      { createdAt: req(a, "createdAt"), id: req(a, "id") },
      { createdAt: req(b, "createdAt"), id: req(b, "id") }
    )
  );

const groupBy = (recs: Rec[], key: string): Map<string, Rec[]> => {
  const map = new Map<string, Rec[]>();
  for (const r of sortRecs(recs)) {
    const k = str(r, key);
    if (!k) continue;
    map.set(k, [...(map.get(k) ?? []), r]);
  }
  return map;
};

const timestamps = (r: Rec) => ({
  createdAt: req(r, "createdAt"),
  updatedAt: req(r, "updatedAt"),
});

const learningStatus = (r: Rec): LearningStatus =>
  str(r, "status") === "archived" ? "archived" : "new";

const contextOf = (r: Rec): Context | null => {
  const c = str(r, "context");
  return c === "work" || c === "family" || c === "hobby" ? c : null;
};

const buildProfile = (users: Rec[]): Profile => {
  const u = users[0] ?? {};
  const prompts = (prefix: string) => ({
    activity: str(u, `prompt${prefix}Activity`),
    goals3Years: str(u, `prompt${prefix}Goals3Years`),
    goals12Months: str(u, `prompt${prefix}Goals12Months`),
  });
  return {
    name: str(u, "name"),
    email: str(u, "email"),
    ownPersonId: str(u, "personId"),
    promptGeneral: str(u, "promptGeneral"),
    contexts: {
      work: prompts("Work"),
      family: prompts("Family"),
      hobby: prompts("Hobby"),
    },
  };
};

const buildPeople = (t: RawTables): Person[] => {
  const details = groupBy(t.PersonDetail, "personId");
  const employments = groupBy(t.PersonAccount, "personId");
  return sortRecs(t.Person).map((p) => ({
    id: req(p, "id"),
    name: req(p, "name"),
    howToSay: str(p, "howToSay"),
    birthday: str(p, "birthday"),
    dateOfDeath: str(p, "dateOfDeath"),
    details: (details.get(req(p, "id")) ?? []).map((d) => ({
      id: req(d, "id"),
      label: req(d, "label"),
      detail: req(d, "detail"),
    })),
    employments: (employments.get(req(p, "id")) ?? []).map((e) => ({
      id: req(e, "id"),
      accountId: req(e, "accountId"),
      position: str(e, "position"),
      startDate: str(e, "startDate"),
      endDate: str(e, "endDate"),
    })),
    ...timestamps(p),
  }));
};

const buildRelationships = (t: RawTables): Relationship[] =>
  sortRecs(t.PersonRelationship)
    .filter((r) => str(r, "personId") && str(r, "relatedPersonId"))
    .map((r) => ({
      id: req(r, "id"),
      personId: req(r, "personId"),
      relatedPersonId: req(r, "relatedPersonId"),
      type: str(r, "typeName"),
      date: str(r, "date"),
      endDate: str(r, "endDate"),
      ...timestamps(r),
    }));

const docSource = (entity: string, r: Rec, warnings: Warning[]): DocSource => ({
  entity,
  id: req(r, "id"),
  warnings,
});

const buildPersonLearnings = (
  t: RawTables,
  warnings: Warning[]
): PersonLearning[] =>
  sortRecs(t.PersonLearning).map((l) => ({
    id: req(l, "id"),
    personId: req(l, "personId"),
    learnedOn: str(l, "learnedOn"),
    status: learningStatus(l),
    prayer: str(l, "prayer"),
    document: jsonFieldToDoc(
      l.learning,
      docSource("person-learnings.json", l, warnings)
    ),
    ...timestamps(l),
  }));

const introductionDoc = (a: Rec, warnings: Warning[]): Doc | null => {
  if (a.introductionJson)
    return jsonFieldToDoc(
      a.introductionJson,
      docSource("accounts.json", a, warnings)
    );
  const text = str(a, "introduction");
  return text ? textToDoc(text) : null;
};

const buildAccounts = (t: RawTables, warnings: Warning[]): Account[] =>
  sortRecs(t.Account).map((a) => ({
    id: req(a, "id"),
    name: req(a, "name"),
    shortName: str(a, "shortName"),
    parentAccountId: str(a, "accountSubsidiariesId"),
    introduction: introductionDoc(a, warnings),
    ...timestamps(a),
  }));

const buildAccountLearnings = (
  t: RawTables,
  warnings: Warning[]
): AccountLearning[] => {
  const people = groupBy(t.AccountLearningPerson, "learningId");
  return sortRecs(t.AccountLearning).map((l) => {
    const document = jsonFieldToDoc(
      l.learning,
      docSource("account-learnings.json", l, warnings)
    );
    const linked = (people.get(req(l, "id")) ?? []).map((p) =>
      req(p, "personId")
    );
    return {
      id: req(l, "id"),
      accountId: req(l, "accountId"),
      learnedOn: str(l, "learnedOn"),
      status: learningStatus(l),
      mentionedPersonIds: [
        ...new Set([...linked, ...collectMentionIds(document)]),
      ],
      document,
      ...timestamps(l),
    };
  });
};

const buildProjects = (t: RawTables): Project[] => {
  const accounts = groupBy(t.AccountProjects, "projectsId");
  return sortRecs(t.Projects).map((p) => ({
    id: req(p, "id"),
    name: req(p, "project"),
    context: contextOf(p) ?? "work",
    done: p.done === true,
    doneOn: str(p, "doneOn"),
    dueOn: str(p, "dueOn"),
    partnerAccountId: str(p, "partnerId"),
    accountIds: (accounts.get(req(p, "id")) ?? []).map((a) =>
      req(a, "accountId")
    ),
    ...timestamps(p),
  }));
};

const buildMeetings = (t: RawTables): Meeting[] => {
  const participants = groupBy(t.MeetingParticipant, "meetingId");
  const activities = groupBy(t.Activity, "meetingActivitiesId");
  return sortRecs(t.Meeting).map((m) => ({
    id: req(m, "id"),
    topic: req(m, "topic"),
    meetingOn: str(m, "meetingOn"),
    context: contextOf(m),
    participantPersonIds: [
      ...new Set(
        (participants.get(req(m, "id")) ?? []).map((p) => req(p, "personId"))
      ),
    ],
    activityIds: (activities.get(req(m, "id")) ?? []).map((a) => req(a, "id")),
    ...timestamps(m),
  }));
};

const formatVersionOf = (a: Rec): 1 | 2 | 3 => {
  const v = a.formatVersion;
  return v === 3 ? 3 : v === 2 ? 2 : 1;
};

const activityDoc = (
  a: Rec,
  blocks: Map<string, Rec[]>,
  todos: Map<string, Rec>,
  source: DocSource
): Doc => {
  const version = formatVersionOf(a);
  if (version === 2) return jsonFieldToDoc(a.notesJson, source);
  if (version === 1) return textToDoc(str(a, "notes"));
  const ownBlocks = blocks.get(req(a, "id")) ?? [];
  const ownTodos = ownBlocks
    .map((b) => str(b, "todoId"))
    .flatMap((id) => (id && todos.get(id) ? [todos.get(id)!] : []));
  return blocksToDoc(
    (a.noteBlockIds as string[] | undefined) ?? [],
    ownBlocks as BlockRecord[],
    ownTodos as TodoRecord[],
    source
  );
};

/**
 * Activities of a deleted meeting are leftovers and are not exported (owner
 * decision 2026-10-10). Activities without a meeting are standalone notes.
 */
const belongsToExistingMeeting =
  (meetingIds: Set<string>) =>
  (a: Rec): boolean => {
    const meetingId = str(a, "meetingActivitiesId");
    return !meetingId || meetingIds.has(meetingId);
  };

const buildActivities = (t: RawTables, warnings: Warning[]): Activity[] => {
  const blocks = groupBy(t.NoteBlock, "activityId");
  const todos = new Map(t.Todo.map((td) => [req(td, "id"), td]));
  const projects = groupBy(t.ProjectActivity, "activityId");
  const meetingIds = new Set(t.Meeting.map((m) => req(m, "id")));
  return sortRecs(t.Activity)
    .filter(belongsToExistingMeeting(meetingIds))
    .map((a) => {
      const document = activityDoc(
        a,
        blocks,
        todos,
        docSource("activities.json", a, warnings)
      );
      return {
        id: req(a, "id"),
        name: str(a, "name"),
        meetingId: str(a, "meetingActivitiesId"),
        projectIds: [
          ...new Set(
            (projects.get(req(a, "id")) ?? []).map((p) => req(p, "projectsId"))
          ),
        ],
        finishedOn: str(a, "finishedOn"),
        sourceFormatVersion: formatVersionOf(a),
        document,
        mentionedPersonIds: collectMentionIds(document),
        fileHashes: [],
        ...timestamps(a),
      };
    });
};

const collectImageBlocks = (t: RawTables): ExportData["imageBlocks"] => {
  const map: ExportData["imageBlocks"] = new Map();
  for (const b of t.NoteBlock) {
    if (str(b, "type") !== "s3image") continue;
    let key: string | null = null;
    try {
      const content =
        typeof b.content === "string" ? JSON.parse(b.content) : b.content;
      key = content?.attrs?.s3Key ?? null;
    } catch {
      continue; // reported when the activity document is built
    }
    if (!key) continue;
    map.set(key, {
      description: str(b, "imageDescription"),
      descriptionUpdatedAt: str(b, "imageDescriptionUpdatedAt"),
    });
  }
  return map;
};

/** Reports ids that point to records which are not part of the export. */
const checkReferences = (data: ExportData): void => {
  const people = new Set(data.people.map((p) => p.id));
  const accounts = new Set(data.accounts.map((a) => a.id));
  const projects = new Set(data.projects.map((p) => p.id));
  const meetings = new Set(data.meetings.map((m) => m.id));
  const check = (
    entity: string,
    id: string,
    set: Set<string>,
    ref: string | null,
    what: string
  ) => {
    if (ref && !set.has(ref))
      data.warnings.push({
        code: "DANGLING_REFERENCE",
        entity,
        id,
        detail: `${what} ${ref}`,
      });
  };
  for (const p of data.people)
    for (const e of p.employments)
      check("people.json", p.id, accounts, e.accountId, "accountId");
  for (const r of data.relationships) {
    check("relationships.json", r.id, people, r.personId, "personId");
    check(
      "relationships.json",
      r.id,
      people,
      r.relatedPersonId,
      "relatedPersonId"
    );
  }
  for (const l of data.personLearnings)
    check("person-learnings.json", l.id, people, l.personId, "personId");
  for (const a of data.accounts)
    check(
      "accounts.json",
      a.id,
      accounts,
      a.parentAccountId,
      "parentAccountId"
    );
  for (const l of data.accountLearnings) {
    check("account-learnings.json", l.id, accounts, l.accountId, "accountId");
    for (const pid of l.mentionedPersonIds)
      check("account-learnings.json", l.id, people, pid, "personId");
  }
  for (const p of data.projects) {
    check("projects.json", p.id, accounts, p.partnerAccountId, "partnerId");
    for (const aid of p.accountIds)
      check("projects.json", p.id, accounts, aid, "accountId");
  }
  for (const m of data.meetings)
    for (const pid of m.participantPersonIds)
      check("meetings.json", m.id, people, pid, "personId");
  for (const a of data.activities) {
    check("activities.json", a.id, meetings, a.meetingId, "meetingId");
    for (const pid of a.projectIds)
      check("activities.json", a.id, projects, pid, "projectId");
    for (const pid of a.mentionedPersonIds)
      check("activities.json", a.id, people, pid, "personId");
  }
  if (data.profile.ownPersonId)
    check(
      "profile.json",
      "profile",
      people,
      data.profile.ownPersonId,
      "ownPersonId"
    );
};

export const buildExport = (t: RawTables): ExportData => {
  const warnings: Warning[] = [];
  const data: ExportData = {
    profile: buildProfile(t.User),
    people: buildPeople(t),
    relationships: buildRelationships(t),
    personLearnings: buildPersonLearnings(t, warnings),
    accounts: buildAccounts(t, warnings),
    accountLearnings: buildAccountLearnings(t, warnings),
    projects: buildProjects(t),
    meetings: buildMeetings(t),
    activities: buildActivities(t, warnings),
    imageBlocks: collectImageBlocks(t),
    warnings,
  };
  checkReferences(data);
  return data;
};

/** Every s3Key used by an image in any document, with the activities using it. */
export const imageUsage = (data: ExportData): Map<string, string[]> => {
  const usage = new Map<string, string[]>();
  const add = (key: string, activityId: string | null) =>
    usage.set(key, [
      ...(usage.get(key) ?? []),
      ...(activityId && !usage.get(key)?.includes(activityId)
        ? [activityId]
        : []),
    ]);
  for (const a of data.activities)
    collectS3Keys(a.document).forEach((k) => add(k, a.id));
  for (const l of [...data.personLearnings, ...data.accountLearnings])
    collectS3Keys(l.document).forEach((k) => add(k, null));
  for (const a of data.accounts)
    if (a.introduction)
      collectS3Keys(a.introduction).forEach((k) => add(k, null));
  return usage;
};

/** All documents of the export, for applying file hashes. */
export const allDocuments = (data: ExportData): Doc[] => [
  ...data.activities.map((a) => a.document),
  ...data.personLearnings.map((l) => l.document),
  ...data.accountLearnings.map((l) => l.document),
  ...data.accounts.flatMap((a) => (a.introduction ? [a.introduction] : [])),
];

export const learningStatusCounts = (data: ExportData) => {
  const count = (ls: { status: LearningStatus }[]) => ({
    new: ls.filter((l) => l.status === "new").length,
    archived: ls.filter((l) => l.status === "archived").length,
  });
  return {
    "person-learnings.json": count(data.personLearnings),
    "account-learnings.json": count(data.accountLearnings),
  };
};
