/**
 * Output types of the migration export, format v1. The contract is documented
 * in docs/migration-export-format.md — keep both in sync.
 */

export type JsonNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JsonNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
  [k: string]: unknown;
};

export type Doc = { type: "doc"; content: JsonNode[] };

export type Context = "work" | "family" | "hobby";

export type WarningCode =
  | "UNKNOWN_NODE_TYPE"
  | "MISSING_FILE"
  | "DANGLING_REFERENCE"
  | "UNPARSEABLE_CONTENT";

export type Warning = {
  code: WarningCode;
  entity: string;
  id: string;
  detail: string;
};

export type Manifest = {
  formatVersion: 1;
  exportedAt: string;
  source: { app: "personal-crm"; gitSha: string | null; owner: string };
  counts: Record<string, number>;
  learningStatusCounts: Record<string, { new: number; archived: number }>;
  checksums: Record<string, string>;
  warnings: Warning[];
};

export type ContextPrompts = {
  activity: string | null;
  goals3Years: string | null;
  goals12Months: string | null;
};

export type Profile = {
  name: string | null;
  email: string | null;
  ownPersonId: string | null;
  promptGeneral: string | null;
  contexts: Record<Context, ContextPrompts>;
};

export type PersonDetail = { id: string; label: string; detail: string };

export type Employment = {
  id: string;
  accountId: string;
  position: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type Person = {
  id: string;
  name: string;
  howToSay: string | null;
  birthday: string | null;
  dateOfDeath: string | null;
  details: PersonDetail[];
  employments: Employment[];
  createdAt: string;
  updatedAt: string;
};

export type Relationship = {
  id: string;
  personId: string;
  relatedPersonId: string;
  type: string | null;
  date: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LearningStatus = "new" | "archived";

export type PersonLearning = {
  id: string;
  personId: string;
  learnedOn: string | null;
  status: LearningStatus;
  prayer: string | null;
  document: Doc;
  createdAt: string;
  updatedAt: string;
};

export type Account = {
  id: string;
  name: string;
  shortName: string | null;
  parentAccountId: string | null;
  introduction: Doc | null;
  createdAt: string;
  updatedAt: string;
};

export type AccountLearning = {
  id: string;
  accountId: string;
  learnedOn: string | null;
  status: LearningStatus;
  mentionedPersonIds: string[];
  document: Doc;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  context: Context;
  done: boolean;
  doneOn: string | null;
  dueOn: string | null;
  partnerAccountId: string | null;
  accountIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Meeting = {
  id: string;
  topic: string;
  meetingOn: string | null;
  context: Context | null;
  participantPersonIds: string[];
  activityIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  name: string | null;
  meetingId: string | null;
  projectIds: string[];
  finishedOn: string | null;
  sourceFormatVersion: 1 | 2 | 3;
  document: Doc;
  mentionedPersonIds: string[];
  fileHashes: string[];
  createdAt: string;
  updatedAt: string;
};

export type FileEntry = {
  hash: string | null;
  s3Key: string;
  name: string;
  mime: string | null;
  size: number | null;
  missing: boolean;
  description: string | null;
  descriptionUpdatedAt: string | null;
  activityIds: string[];
};
