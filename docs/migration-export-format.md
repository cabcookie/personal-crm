# Migration export format (v1)

Contract between the Personal CRM migration export (this repo, board epic
`9q33.fzpg`) and the importer in nexflowit-app (`zw7g.mn5d`). Personal CRM is
replaced by nexflow.it; this export carries the owner's data across.

- The export is **read-only** and can be repeated any number of times. Until the
  cut-over date it is used for test imports only; the final export is taken after
  writing to Personal CRM has stopped.
- The export is **faithful**: it carries the source data in a normalized shape
  but does not apply nexflow.it semantics (heading remapping, project sections,
  area assignment). Those decisions live in the importer.
- Any change to this contract bumps `formatVersion` in the manifest.

## Archive layout

One ZIP per export, written to `exports/<identityId>/migration/<stamp>.zip` in
the default storage bucket (`<stamp>` is `exportedAt` with `:` and `.` replaced
by `-`). While the export runs, `<stamp>.running.json` exists next to it; a
failed run leaves `<stamp>.error.json` (`{ startedAt, failedAt, message }`)
instead of the ZIP. Exports expire after 90 days with the bucket's `exports/`
lifecycle rule.

```text
manifest.json
data/
  profile.json
  people.json
  relationships.json
  person-learnings.json
  accounts.json
  account-learnings.json
  projects.json
  meetings.json
  activities.json
  files.json
files/
  <sha256>            # raw file content, no extension
```

All `data/*.json` files except `profile.json` contain a JSON array. Encoding is
UTF-8. Records are sorted by `createdAt` ascending, then `id`.

## Conventions

- **IDs** are the original Personal CRM ids (DynamoDB `id`). The importer keys
  idempotency on them (`legacy:<id>` label).
- **Dates** (`YYYY-MM-DD`) and **date-times** (ISO 8601 with `Z`) are passed
  through as stored. Missing values are `null`, never omitted.
- **Rich text** is a normalized TipTap document (`Doc`, see below), never a
  string.
- Only records owned by the exporting user are included.

## manifest.json

```ts
interface Manifest {
  formatVersion: 1;
  exportedAt: string; // date-time
  source: {
    app: "personal-crm";
    gitSha: string | null; // commit of the exporting Lambda, if known
    owner: string; // Cognito owner string of the exported records
  };
  counts: Record<string, number>; // per data file, e.g. { "people.json": 512 }
  // Learnings per status, e.g. { "person-learnings.json": { new: 80, archived: 0 } }
  learningStatusCounts: Record<string, { new: number; archived: number }>;
  checksums: Record<string, string>; // sha256 per data file
  warnings: Warning[];
}

interface Warning {
  code:
    | "UNKNOWN_NODE_TYPE" // node type not listed below, kept verbatim
    | "MISSING_FILE" // s3image points to an object that does not exist
    | "DANGLING_REFERENCE" // id points to a record that is not in the export
    | "UNPARSEABLE_CONTENT"; // JSON field could not be parsed, see `detail`
  entity: string; // data file name
  id: string; // record id
  detail: string;
}
```

## Data files

### profile.json

The user's own profile (model `User`). Feeds areas and goals in nexflow.it.

```ts
interface Profile {
  name: string | null;
  email: string | null;
  ownPersonId: string | null; // the Person record that represents the user
  promptGeneral: string | null; // "who am I", applies to every context
  contexts: {
    work: ContextPrompts;
    family: ContextPrompts;
    hobby: ContextPrompts;
  };
}

interface ContextPrompts {
  activity: string | null; // what the user does in this context
  goals3Years: string | null;
  goals12Months: string | null;
}
```

### people.json

Model `Person` with its owned children `PersonDetail` and `PersonAccount`.

```ts
interface Person {
  id: string;
  name: string;
  howToSay: string | null; // pronunciation; custom field in nexflow.it
  birthday: string | null; // date
  dateOfDeath: string | null; // date
  details: PersonDetail[];
  employments: Employment[]; // the person's vita
  createdAt: string;
  updatedAt: string;
}

interface PersonDetail {
  id: string;
  label:
    | "emailWork"
    | "emailPrivate"
    | "phoneWork"
    | "phonePrivate"
    | "linkedIn"
    | "instagram"
    | "salesforce" // custom field in nexflow.it
    | "amazonalias"; // custom field in nexflow.it
  detail: string;
}

interface Employment {
  id: string; // PersonAccount id
  accountId: string;
  position: string | null;
  startDate: string | null; // date
  endDate: string | null; // date; null = current
}
```

### relationships.json

Model `PersonRelationship`. One record per stored relationship; the reverse
direction is not duplicated.

```ts
interface Relationship {
  id: string;
  personId: string;
  relatedPersonId: string;
  // relatedPerson is the <type> of person, e.g. type "parent": relatedPerson is
  // the parent of person. Reverse names: parent <-> child, manager <-> employer;
  // all other types are symmetric.
  type:
    | "parent"
    | "child"
    | "spouse"
    | "fiance"
    | "partner"
    | "friend"
    | "smallgroup"
    | "manager"
    | "employer"
    | null;
  // Anniversary of the relationship (wedding, engagement, friendship, ...);
  // not used for parent/child and manager/employer.
  date: string | null; // date
  endDate: string | null; // date
  createdAt: string;
  updatedAt: string;
}
```

### person-learnings.json

Model `PersonLearning`.

```ts
interface PersonLearning {
  id: string;
  personId: string;
  learnedOn: string | null; // date; fall back to createdAt
  status: "new" | "archived";
  prayer: "NONE" | "PRAYING" | "ANSWERED" | "NOTANSWERED" | null; // custom
  document: Doc;
  createdAt: string;
  updatedAt: string;
}
```

### accounts.json

Model `Account`.

```ts
interface Account {
  id: string;
  name: string;
  shortName: string | null;
  parentAccountId: string | null; // controlling company; custom relation
  introduction: Doc | null; // introductionJson, or introduction as v1 text
  createdAt: string;
  updatedAt: string;
}
```

### account-learnings.json

Model `AccountLearning` with `AccountLearningPerson`.

```ts
interface AccountLearning {
  id: string;
  accountId: string;
  learnedOn: string | null; // date; fall back to createdAt
  status: "new" | "archived";
  // Union of AccountLearningPerson rows and mention nodes in the document.
  mentionedPersonIds: string[];
  document: Doc;
  createdAt: string;
  updatedAt: string;
}
```

### projects.json

Model `Projects` with `AccountProjects`.

```ts
interface Project {
  id: string;
  name: string; // field `project`
  context: "work" | "family" | "hobby";
  done: boolean;
  doneOn: string | null; // date
  dueOn: string | null; // date
  partnerAccountId: string | null; // business partner supporting the project
  accountIds: string[]; // accounts the project is for
  createdAt: string;
  updatedAt: string;
}
```

### meetings.json

Model `Meeting` with `MeetingParticipant`.

```ts
interface Meeting {
  id: string;
  topic: string;
  meetingOn: string | null; // date-time; fall back to createdAt
  context: "work" | "family" | "hobby" | null;
  participantPersonIds: string[];
  activityIds: string[]; // the meeting's activities, by createdAt ascending
  createdAt: string;
  updatedAt: string;
}
```

### activities.json

Model `Activity` with `NoteBlock`, `Todo` and `ProjectActivity`. One record per
activity; inside a meeting there is one activity per project discussion.
Activities whose meeting has been deleted are leftovers and are not exported
(neither their todos nor their images), so `meetingId` always points into
`meetings.json`.

```ts
interface Activity {
  id: string;
  name: string | null; // auto-generated title
  meetingId: string | null;
  projectIds: string[]; // in ProjectActivity creation order
  finishedOn: string | null; // date-time
  sourceFormatVersion: 1 | 2 | 3; // how the notes were stored, for diagnosis
  document: Doc;
  mentionedPersonIds: string[]; // distinct, in document order
  fileHashes: string[]; // distinct, in document order
  createdAt: string;
  updatedAt: string;
}
```

### files.json

Every file referenced by an `image` node in any document.

```ts
interface FileEntry {
  hash: string | null; // sha256 hex; content is files/<hash>; null if missing
  s3Key: string; // original key, e.g. user-files/<identityId>/<name>
  name: string; // last segment of s3Key
  mime: string | null; // S3 ContentType
  size: number | null; // bytes; null when missing
  missing: boolean; // true when the S3 object no longer exists
  description: string | null; // AI image description (NoteBlock.imageDescription)
  descriptionUpdatedAt: string | null;
  activityIds: string[]; // activities using it; empty for learnings/intros
}
```

Identical content stored under several keys yields one `FileEntry` per key with
the same `hash`; the content is stored once.

## Documents (`Doc`)

A ProseMirror/TipTap JSON document:

```ts
interface Doc {
  type: "doc";
  content: Node[];
}
```

### How a document is produced

| Source                          | Rule                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Activity v1 (`notes`)           | Each line becomes a `paragraph`; empty lines become empty paragraphs.                                                                                                                                                                                                                                          |
| Activity v2 (`notesJson`)       | Parsed and cleaned (see below).                                                                                                                                                                                                                                                                                |
| Activity v3 (`noteBlocks`)      | Blocks in `noteBlockIds` order. Consecutive `listItem`, `listItemOrdered` and `taskItem` blocks are wrapped into `bulletList`, `orderedList` (`start: 1`) and `taskList`, as `transform-v3.ts` does. A `taskItem` takes its content from the linked `Todo`. Ids in `noteBlockIds` without a block are skipped. |
| Learnings, account introduction | `learning` / `introductionJson` parsed and cleaned; `introduction` (plain text) like v1. A JSON field that holds plain text instead of a document (older person learnings) is treated like v1 as well; the same applies to v2 notes.                                                                           |

Cleaning removes editor-internal attributes (`blockId`, `recordId`, `src`,
`expiresAt`, `fileKey`, the `doc`-level `projects`) and drops `null`
attributes.

### Node types

| Type                          | Attributes                                     | Notes                                                                                                                      |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `paragraph`                   |                                                |                                                                                                                            |
| `heading`                     | `level`: 1–4                                   | Levels are passed through unchanged.                                                                                       |
| `bulletList`, `orderedList`   | `start` (ordered)                              |                                                                                                                            |
| `listItem`                    |                                                |                                                                                                                            |
| `taskList`                    |                                                |                                                                                                                            |
| `taskItem`                    | `todoId`, `checked`, `doneOn` (date or `null`) | `checked` = Todo status `DONE`.                                                                                            |
| `blockquote`, `codeBlock`     | `language` (code)                              |                                                                                                                            |
| `horizontalRule`, `hardBreak` |                                                |                                                                                                                            |
| `image`                       | `fileHash`, `s3Key`                            | Replaces `s3image`; `fileHash` is `null` when the file is missing or outside the user's `user-files/<identityId>/` prefix. |
| `mention`                     | `id` (personId), `label`                       | `label` is the name at the time of writing.                                                                                |
| `text`                        | `marks`                                        |                                                                                                                            |

Marks: `bold`, `italic`, `strike`, `code`, `highlight`, `link` (`href`).

Any other node type is kept verbatim and reported as `UNKNOWN_NODE_TYPE`.

## Not exported

Discarded by owner decision (2026-10-10): Inbox, Bible notes, WeeklyReview,
SixWeekCycle/Batch, CrmProject and imports, Territory, PayerAccount, MRR
analytics, weekly and daily plans, export tasks and permissions, chat
conversations, Sonic transcripts and usage, embeddings, AI summaries
(`projectSummary`, `tasksSummary`), markdown snapshots and cached headers, and
the project fields `pinned`, `order`, `onHoldTill`, `myNextActions`,
`othersNextActions`, and the account fields `crmId`, `mainColor`, `order`.

## Notes for the importer

Decisions recorded on `zw7g.mn5d`, repeated here for orientation only:

- One meeting becomes one note; each activity becomes a section
  `## Projekt #<project>` (several projects: `## Projekt #A #B`). Headings below
  are remapped H1→H3, H2→H4, H3/H4 → bold paragraph. The same applies to notes
  without a meeting, which take `name` (fallback: date) as title.
- A task gets the first project of its section as parent and mentions the rest.
- `occurred_on`: `meetingOn`, `finishedOn` or `learnedOn`, falling back to
  `createdAt`.
- People belong to no area in nexflow.it either; they are imported without a
  parent (`zw7g.vaz7`). The same holds for organizations (`zw7g.h7bp`).
- All learnings become notes regardless of `status`. The app never sets
  `archived`, so none are expected; `learningStatusCounts` in the manifest shows
  whether that holds.
- `files.json` `description` becomes the file item's description with summary
  status "done".
