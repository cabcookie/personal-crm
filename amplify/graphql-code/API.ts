/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelStringKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export type ModelInboxFilterInput = {
  and?: Array< ModelInboxFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  movedToAccountLearningId?: ModelStringInput | null,
  movedToActivityId?: ModelStringInput | null,
  movedToPersonLearningId?: ModelStringInput | null,
  not?: ModelInboxFilterInput | null,
  note?: ModelStringInput | null,
  noteJson?: ModelStringInput | null,
  or?: Array< ModelInboxFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelInboxStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelInboxStatusInput = {
  eq?: InboxStatus | null,
  ne?: InboxStatus | null,
};

export enum InboxStatus {
  done = "done",
  new = "new",
}


export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelInboxConnection = {
  __typename: "ModelInboxConnection",
  items:  Array<Inbox | null >,
  nextToken?: string | null,
};

export type Inbox = {
  __typename: "Inbox",
  createdAt: string,
  formatVersion?: number | null,
  id: string,
  movedToAccountLearningId?: string | null,
  movedToActivityId?: string | null,
  movedToPersonLearningId?: string | null,
  note?: string | null,
  noteJson?: string | null,
  owner?: string | null,
  status: InboxStatus,
  updatedAt: string,
};

export type ChatNamerReturnType = {
  __typename: "ChatNamerReturnType",
  name?: string | null,
};

export type GenerateTasksSummaryReturnType = {
  __typename: "GenerateTasksSummaryReturnType",
  summary?: string | null,
};

export type Account = {
  __typename: "Account",
  accountSubsidiariesId?: string | null,
  awsAccounts?: ModelAccountPayerAccountConnection | null,
  controller?: Account | null,
  createdAt: string,
  crmId?: string | null,
  formatVersion?: number | null,
  id: string,
  introduction?: string | null,
  introductionJson?: string | null,
  learnings?: ModelAccountLearningConnection | null,
  mainColor?: string | null,
  name: string,
  notionId?: number | null,
  order?: number | null,
  owner?: string | null,
  partnerProjects?: ModelProjectsConnection | null,
  people?: ModelPersonAccountConnection | null,
  projects?: ModelAccountProjectsConnection | null,
  resellingAccounts?: ModelPayerAccountConnection | null,
  shortName?: string | null,
  subsidiaries?: ModelAccountConnection | null,
  territories?: ModelAccountTerritoryConnection | null,
  updatedAt: string,
};

export type ModelAccountPayerAccountConnection = {
  __typename: "ModelAccountPayerAccountConnection",
  items:  Array<AccountPayerAccount | null >,
  nextToken?: string | null,
};

export type AccountPayerAccount = {
  __typename: "AccountPayerAccount",
  account?: Account | null,
  accountId: string,
  awsAccountNumber?: PayerAccount | null,
  awsAccountNumberId: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  updatedAt: string,
};

export type PayerAccount = {
  __typename: "PayerAccount",
  accounts?: ModelAccountPayerAccountConnection | null,
  awsAccountNumber: string,
  createdAt: string,
  financials?: ModelPayerAccountMrrConnection | null,
  isViaReseller?: boolean | null,
  mainContact?: Person | null,
  mainContactId?: string | null,
  notes?: string | null,
  owner?: string | null,
  reseller?: Account | null,
  resellerId?: string | null,
  updatedAt: string,
};

export type ModelPayerAccountMrrConnection = {
  __typename: "ModelPayerAccountMrrConnection",
  items:  Array<PayerAccountMrr | null >,
  nextToken?: string | null,
};

export type PayerAccountMrr = {
  __typename: "PayerAccountMrr",
  awsAccountNumber: string,
  companyName: string,
  createdAt: string,
  id: string,
  isEstimated: boolean,
  isReseller: boolean,
  month?: Month | null,
  monthId: string,
  mrr?: number | null,
  owner?: string | null,
  payerAccount?: PayerAccount | null,
  updatedAt: string,
  upload?: MrrDataUpload | null,
  uploadId: string,
};

export type Month = {
  __typename: "Month",
  createdAt: string,
  id: string,
  latestUpload?: MrrDataUpload | null,
  latestUploadId: string,
  month: string,
  owner?: string | null,
  payerMrrs?: ModelPayerAccountMrrConnection | null,
  updatedAt: string,
};

export type MrrDataUpload = {
  __typename: "MrrDataUpload",
  createdAt: string,
  id: string,
  latestMonths?: ModelMonthConnection | null,
  owner?: string | null,
  payerMrrs?: ModelPayerAccountMrrConnection | null,
  s3Key: string,
  status: AnalyticsImportStatus,
  updatedAt: string,
};

export type ModelMonthConnection = {
  __typename: "ModelMonthConnection",
  items:  Array<Month | null >,
  nextToken?: string | null,
};

export enum AnalyticsImportStatus {
  DONE = "DONE",
  WIP = "WIP",
}


export type Person = {
  __typename: "Person",
  accountLearnings?: ModelAccountLearningPersonConnection | null,
  accounts?: ModelPersonAccountConnection | null,
  birthday?: string | null,
  createdAt: string,
  dateOfDeath?: string | null,
  details?: ModelPersonDetailConnection | null,
  howToSay?: string | null,
  id: string,
  learnings?: ModelPersonLearningConnection | null,
  meetings?: ModelMeetingParticipantConnection | null,
  name: string,
  noteBlocks?: ModelNoteBlockPersonConnection | null,
  notionId?: number | null,
  owner?: string | null,
  payerAccounts?: ModelPayerAccountConnection | null,
  profile?: User | null,
  relationshipsFrom?: ModelPersonRelationshipConnection | null,
  relationshipsTo?: ModelPersonRelationshipConnection | null,
  updatedAt: string,
};

export type ModelAccountLearningPersonConnection = {
  __typename: "ModelAccountLearningPersonConnection",
  items:  Array<AccountLearningPerson | null >,
  nextToken?: string | null,
};

export type AccountLearningPerson = {
  __typename: "AccountLearningPerson",
  createdAt: string,
  id: string,
  learning?: AccountLearning | null,
  learningId: string,
  owner?: string | null,
  person?: Person | null,
  personId: string,
  updatedAt: string,
};

export type AccountLearning = {
  __typename: "AccountLearning",
  account?: Account | null,
  accountId: string,
  createdAt: string,
  id: string,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  peopleMentioned?: ModelAccountLearningPersonConnection | null,
  status: LearningStatus,
  updatedAt: string,
};

export enum LearningStatus {
  archived = "archived",
  new = "new",
}


export type ModelPersonAccountConnection = {
  __typename: "ModelPersonAccountConnection",
  items:  Array<PersonAccount | null >,
  nextToken?: string | null,
};

export type PersonAccount = {
  __typename: "PersonAccount",
  account?: Account | null,
  accountId: string,
  createdAt: string,
  endDate?: string | null,
  id: string,
  owner?: string | null,
  person?: Person | null,
  personId: string,
  position?: string | null,
  startDate?: string | null,
  updatedAt: string,
};

export type ModelPersonDetailConnection = {
  __typename: "ModelPersonDetailConnection",
  items:  Array<PersonDetail | null >,
  nextToken?: string | null,
};

export type PersonDetail = {
  __typename: "PersonDetail",
  createdAt: string,
  detail: string,
  id: string,
  label: PersonDetailsEnum,
  owner?: string | null,
  person?: Person | null,
  personId: string,
  updatedAt: string,
};

export enum PersonDetailsEnum {
  amazonalias = "amazonalias",
  emailPrivate = "emailPrivate",
  emailWork = "emailWork",
  instagram = "instagram",
  linkedIn = "linkedIn",
  phonePrivate = "phonePrivate",
  phoneWork = "phoneWork",
  salesforce = "salesforce",
}


export type ModelPersonLearningConnection = {
  __typename: "ModelPersonLearningConnection",
  items:  Array<PersonLearning | null >,
  nextToken?: string | null,
};

export type PersonLearning = {
  __typename: "PersonLearning",
  createdAt: string,
  id: string,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  person?: Person | null,
  personId: string,
  prayer?: PrayerStatus | null,
  status: LearningStatus,
  updatedAt: string,
};

export enum PrayerStatus {
  ANSWERED = "ANSWERED",
  NONE = "NONE",
  NOTANSWERED = "NOTANSWERED",
  PRAYING = "PRAYING",
}


export type ModelMeetingParticipantConnection = {
  __typename: "ModelMeetingParticipantConnection",
  items:  Array<MeetingParticipant | null >,
  nextToken?: string | null,
};

export type MeetingParticipant = {
  __typename: "MeetingParticipant",
  createdAt: string,
  id: string,
  meeting?: Meeting | null,
  meetingId: string,
  owner?: string | null,
  person?: Person | null,
  personId: string,
  updatedAt: string,
};

export type Meeting = {
  __typename: "Meeting",
  activities?: ModelActivityConnection | null,
  context?: Context | null,
  createdAt: string,
  id: string,
  immediateTasksDone?: boolean | null,
  meetingOn?: string | null,
  notionId?: number | null,
  owner?: string | null,
  participants?: ModelMeetingParticipantConnection | null,
  topic: string,
  updatedAt: string,
};

export type ModelActivityConnection = {
  __typename: "ModelActivityConnection",
  items:  Array<Activity | null >,
  nextToken?: string | null,
};

export type Activity = {
  __typename: "Activity",
  createdAt: string,
  finishedOn?: string | null,
  forMeeting?: Meeting | null,
  forProjects?: ModelProjectActivityConnection | null,
  formatVersion?: number | null,
  id: string,
  meetingActivitiesId?: string | null,
  name?: string | null,
  noteBlockIds?: Array< string > | null,
  noteBlocks?: ModelNoteBlockConnection | null,
  notes?: string | null,
  notesJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
  updatedAt: string,
};

export type ModelProjectActivityConnection = {
  __typename: "ModelProjectActivityConnection",
  items:  Array<ProjectActivity | null >,
  nextToken?: string | null,
};

export type ProjectActivity = {
  __typename: "ProjectActivity",
  activity?: Activity | null,
  activityId: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  projects?: Projects | null,
  projectsId: string,
  updatedAt: string,
};

export type Projects = {
  __typename: "Projects",
  accounts?: ModelAccountProjectsConnection | null,
  activities?: ModelProjectActivityConnection | null,
  batches?: ModelSixWeekBatchProjectsConnection | null,
  context: Context,
  createdAt: string,
  crmProjects?: ModelCrmProjectProjectsConnection | null,
  dayPlans?: ModelDailyPlanProjectConnection | null,
  done?: boolean | null,
  doneOn?: string | null,
  dueOn?: string | null,
  formatVersion?: number | null,
  id: string,
  myNextActions?: string | null,
  myNextActionsJson?: string | null,
  notionId?: number | null,
  onHoldTill?: string | null,
  order?: number | null,
  othersNextActions?: string | null,
  othersNextActionsJson?: string | null,
  owner?: string | null,
  partner?: Account | null,
  partnerId?: string | null,
  pinned: ProjectPinned,
  project: string,
  tasksSummary?: string | null,
  tasksSummaryUpdatedAt?: string | null,
  updatedAt: string,
  weekPlans?: ModelWeeklyPlanProjectConnection | null,
  weeklyReviews?: ModelWeeklyReviewEntryConnection | null,
};

export type ModelAccountProjectsConnection = {
  __typename: "ModelAccountProjectsConnection",
  items:  Array<AccountProjects | null >,
  nextToken?: string | null,
};

export type AccountProjects = {
  __typename: "AccountProjects",
  account?: Account | null,
  accountId: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  projects?: Projects | null,
  projectsId: string,
  updatedAt: string,
};

export type ModelSixWeekBatchProjectsConnection = {
  __typename: "ModelSixWeekBatchProjectsConnection",
  items:  Array<SixWeekBatchProjects | null >,
  nextToken?: string | null,
};

export type SixWeekBatchProjects = {
  __typename: "SixWeekBatchProjects",
  createdAt: string,
  id: string,
  owner?: string | null,
  projects?: Projects | null,
  projectsId: string,
  sixWeekBatch?: SixWeekBatch | null,
  sixWeekBatchId: string,
  updatedAt: string,
};

export type SixWeekBatch = {
  __typename: "SixWeekBatch",
  appetite?: SixWeekBatchAppetite | null,
  context?: Context | null,
  createdAt: string,
  createdOn?: string | null,
  hours?: number | null,
  id: string,
  idea: string,
  noGos?: string | null,
  notionId?: number | null,
  owner?: string | null,
  problem?: string | null,
  projects?: ModelSixWeekBatchProjectsConnection | null,
  risks?: string | null,
  sixWeekCycle?: SixWeekCycle | null,
  sixWeekCycleBatchesId: string,
  solution?: string | null,
  status?: SixWeekBatchStatus | null,
  updatedAt: string,
};

export enum SixWeekBatchAppetite {
  big = "big",
  small = "small",
}


export enum Context {
  family = "family",
  hobby = "hobby",
  work = "work",
}


export type SixWeekCycle = {
  __typename: "SixWeekCycle",
  batches?: ModelSixWeekBatchConnection | null,
  createdAt: string,
  id: string,
  name: string,
  owner?: string | null,
  startDate?: string | null,
  updatedAt: string,
};

export type ModelSixWeekBatchConnection = {
  __typename: "ModelSixWeekBatchConnection",
  items:  Array<SixWeekBatch | null >,
  nextToken?: string | null,
};

export enum SixWeekBatchStatus {
  aborted = "aborted",
  appetite = "appetite",
  declined = "declined",
  finished = "finished",
  idea = "idea",
  inprogress = "inprogress",
}


export type ModelCrmProjectProjectsConnection = {
  __typename: "ModelCrmProjectProjectsConnection",
  items:  Array<CrmProjectProjects | null >,
  nextToken?: string | null,
};

export type CrmProjectProjects = {
  __typename: "CrmProjectProjects",
  createdAt: string,
  crmProject?: CrmProject | null,
  crmProjectId: string,
  id: string,
  owner?: string | null,
  project?: Projects | null,
  projectId: string,
  updatedAt: string,
};

export type CrmProject = {
  __typename: "CrmProject",
  accountName?: string | null,
  annualRecurringRevenue?: number | null,
  closeDate: string,
  confirmHygieneIssuesSolvedTill?: string | null,
  createdAt: string,
  createdDate?: string | null,
  crmId?: string | null,
  id: string,
  isMarketplace?: boolean | null,
  name: string,
  nextStep?: string | null,
  opportunityOwner?: string | null,
  owner?: string | null,
  partnerName?: string | null,
  projects?: ModelCrmProjectProjectsConnection | null,
  stage: string,
  stageChangedDate?: string | null,
  territoryName?: string | null,
  totalContractVolume?: number | null,
  type?: string | null,
  updatedAt: string,
};

export type ModelDailyPlanProjectConnection = {
  __typename: "ModelDailyPlanProjectConnection",
  items:  Array<DailyPlanProject | null >,
  nextToken?: string | null,
};

export type DailyPlanProject = {
  __typename: "DailyPlanProject",
  createdAt: string,
  dailyPlan?: DailyPlan | null,
  dailyPlanId: string,
  id: string,
  maybe?: boolean | null,
  owner?: string | null,
  project?: Projects | null,
  projectId: string,
  updatedAt: string,
};

export type DailyPlan = {
  __typename: "DailyPlan",
  context: Context,
  createdAt: string,
  day: string,
  dayGoal: string,
  id: string,
  owner?: string | null,
  projects?: ModelDailyPlanProjectConnection | null,
  status: DailyPlanStatus,
  todos?: ModelDailyPlanTodoConnection | null,
  updatedAt: string,
};

export enum DailyPlanStatus {
  CANCELLED = "CANCELLED",
  DONE = "DONE",
  OPEN = "OPEN",
  PLANNING = "PLANNING",
}


export type ModelDailyPlanTodoConnection = {
  __typename: "ModelDailyPlanTodoConnection",
  items:  Array<DailyPlanTodo | null >,
  nextToken?: string | null,
};

export type DailyPlanTodo = {
  __typename: "DailyPlanTodo",
  createdAt: string,
  dailyPlan?: DailyPlan | null,
  dailyPlanId: string,
  id: string,
  owner?: string | null,
  postPoned?: boolean | null,
  todo?: Todo | null,
  todoId: string,
  updatedAt: string,
};

export type Todo = {
  __typename: "Todo",
  activity?: NoteBlock | null,
  createdAt: string,
  dailyTodos?: ModelDailyPlanTodoConnection | null,
  doneOn?: string | null,
  id: string,
  owner?: string | null,
  status: TodoStatus,
  todo: string,
  updatedAt: string,
};

export type NoteBlock = {
  __typename: "NoteBlock",
  activity?: Activity | null,
  activityId: string,
  content?: string | null,
  createdAt: string,
  formatVersion: number,
  id: string,
  owner?: string | null,
  people?: ModelNoteBlockPersonConnection | null,
  todo?: Todo | null,
  todoId?: string | null,
  type: string,
  updatedAt: string,
};

export type ModelNoteBlockPersonConnection = {
  __typename: "ModelNoteBlockPersonConnection",
  items:  Array<NoteBlockPerson | null >,
  nextToken?: string | null,
};

export type NoteBlockPerson = {
  __typename: "NoteBlockPerson",
  createdAt: string,
  id: string,
  noteBlock?: NoteBlock | null,
  noteBlockId: string,
  owner?: string | null,
  person?: Person | null,
  personId: string,
  updatedAt: string,
};

export enum TodoStatus {
  DONE = "DONE",
  OPEN = "OPEN",
}


export enum ProjectPinned {
  NOTPINNED = "NOTPINNED",
  PINNED = "PINNED",
}


export type ModelWeeklyPlanProjectConnection = {
  __typename: "ModelWeeklyPlanProjectConnection",
  items:  Array<WeeklyPlanProject | null >,
  nextToken?: string | null,
};

export type WeeklyPlanProject = {
  __typename: "WeeklyPlanProject",
  createdAt: string,
  id: string,
  owner?: string | null,
  project?: Projects | null,
  projectId: string,
  updatedAt: string,
  weekPlan?: WeeklyPlan | null,
  weekPlanId: string,
};

export type WeeklyPlan = {
  __typename: "WeeklyPlan",
  createdAt: string,
  crmUpdateSkipped?: boolean | null,
  financialUpdateSkipped?: boolean | null,
  id: string,
  inboxSkipped?: boolean | null,
  owner?: string | null,
  projects?: ModelWeeklyPlanProjectConnection | null,
  startDate: string,
  status: PlanningStatus,
  updatedAt: string,
};

export enum PlanningStatus {
  CANCELLED = "CANCELLED",
  DONE = "DONE",
  WIP = "WIP",
}


export type ModelWeeklyReviewEntryConnection = {
  __typename: "ModelWeeklyReviewEntryConnection",
  items:  Array<WeeklyReviewEntry | null >,
  nextToken?: string | null,
};

export type WeeklyReviewEntry = {
  __typename: "WeeklyReviewEntry",
  category: WeeklyReviewCategory,
  content?: string | null,
  createdAt: string,
  generatedContent?: string | null,
  id: string,
  isEdited?: boolean | null,
  owner?: string | null,
  project?: Projects | null,
  projectId: string,
  review?: WeeklyReview | null,
  reviewId: string,
  updatedAt: string,
};

export enum WeeklyReviewCategory {
  customer_highlights = "customer_highlights",
  customer_lowlights = "customer_lowlights",
  genai_opportunities = "genai_opportunities",
  market_observations = "market_observations",
  none = "none",
}


export type WeeklyReview = {
  __typename: "WeeklyReview",
  createdAt: string,
  date: string,
  entries?: ModelWeeklyReviewEntryConnection | null,
  id: string,
  owner?: string | null,
  status: WeeklyReviewStatus,
  updatedAt: string,
};

export enum WeeklyReviewStatus {
  completed = "completed",
  draft = "draft",
}


export type ModelNoteBlockConnection = {
  __typename: "ModelNoteBlockConnection",
  items:  Array<NoteBlock | null >,
  nextToken?: string | null,
};

export type ModelPayerAccountConnection = {
  __typename: "ModelPayerAccountConnection",
  items:  Array<PayerAccount | null >,
  nextToken?: string | null,
};

export type User = {
  __typename: "User",
  createdAt: string,
  email?: string | null,
  name?: string | null,
  person?: Person | null,
  personId?: string | null,
  profileId: string,
  profilePicture?: string | null,
  updatedAt: string,
};

export type ModelPersonRelationshipConnection = {
  __typename: "ModelPersonRelationshipConnection",
  items:  Array<PersonRelationship | null >,
  nextToken?: string | null,
};

export type PersonRelationship = {
  __typename: "PersonRelationship",
  createdAt: string,
  date?: string | null,
  endDate?: string | null,
  id: string,
  owner?: string | null,
  person?: Person | null,
  personId?: string | null,
  relatedPerson?: Person | null,
  relatedPersonId?: string | null,
  typeName?: RelationshipTypeEnum | null,
  updatedAt: string,
};

export enum RelationshipTypeEnum {
  child = "child",
  employer = "employer",
  fiance = "fiance",
  friend = "friend",
  manager = "manager",
  parent = "parent",
  partner = "partner",
  smallgroup = "smallgroup",
  spouse = "spouse",
}


export type ModelAccountLearningConnection = {
  __typename: "ModelAccountLearningConnection",
  items:  Array<AccountLearning | null >,
  nextToken?: string | null,
};

export type ModelProjectsConnection = {
  __typename: "ModelProjectsConnection",
  items:  Array<Projects | null >,
  nextToken?: string | null,
};

export type ModelAccountConnection = {
  __typename: "ModelAccountConnection",
  items:  Array<Account | null >,
  nextToken?: string | null,
};

export type ModelAccountTerritoryConnection = {
  __typename: "ModelAccountTerritoryConnection",
  items:  Array<AccountTerritory | null >,
  nextToken?: string | null,
};

export type AccountTerritory = {
  __typename: "AccountTerritory",
  account?: Account | null,
  accountId: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  territory?: Territory | null,
  territoryId: string,
  updatedAt: string,
};

export type Territory = {
  __typename: "Territory",
  accounts?: ModelAccountTerritoryConnection | null,
  createdAt: string,
  crmId?: string | null,
  id: string,
  name?: string | null,
  owner?: string | null,
  responsibilities?: ModelTerritoryResponsibilityConnection | null,
  updatedAt: string,
};

export type ModelTerritoryResponsibilityConnection = {
  __typename: "ModelTerritoryResponsibilityConnection",
  items:  Array<TerritoryResponsibility | null >,
  nextToken?: string | null,
};

export type TerritoryResponsibility = {
  __typename: "TerritoryResponsibility",
  createdAt: string,
  id: string,
  owner?: string | null,
  quota?: number | null,
  startDate: string,
  territory?: Territory | null,
  territoryId: string,
  updatedAt: string,
};

export type BookOfBible = {
  __typename: "BookOfBible",
  alias: string,
  book: string,
  chapters?: ModelNotesBibleChapterConnection | null,
  createdAt: string,
  id: string,
  noOfChapters?: number | null,
  notionId?: number | null,
  owner?: string | null,
  section: Section,
  updatedAt: string,
};

export type ModelNotesBibleChapterConnection = {
  __typename: "ModelNotesBibleChapterConnection",
  items:  Array<NotesBibleChapter | null >,
  nextToken?: string | null,
};

export type NotesBibleChapter = {
  __typename: "NotesBibleChapter",
  book?: BookOfBible | null,
  bookId: string,
  chapter: number,
  createdAt: string,
  formatVersion?: number | null,
  id: string,
  note?: string | null,
  noteJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
  updatedAt: string,
};

export enum Section {
  NEW = "NEW",
  OLD = "OLD",
}


export type ConversationGeneralChat = {
  __typename: "ConversationGeneralChat",
  createdAt: string,
  id: string,
  messages?: ModelConversationMessageGeneralChatConnection | null,
  metadata?: string | null,
  name?: string | null,
  owner?: string | null,
  updatedAt: string,
};

export type ModelConversationMessageGeneralChatConnection = {
  __typename: "ModelConversationMessageGeneralChatConnection",
  items:  Array<ConversationMessageGeneralChat | null >,
  nextToken?: string | null,
};

export type ConversationMessageGeneralChat = {
  __typename: "ConversationMessageGeneralChat",
  aiContext?: string | null,
  associatedUserMessageId?: string | null,
  content?:  Array<AmplifyAIContentBlock | null > | null,
  conversation?: ConversationGeneralChat | null,
  conversationId: string,
  createdAt: string,
  id: string,
  owner?: string | null,
  role?: AmplifyAIConversationParticipantRole | null,
  toolConfiguration?: AmplifyAIToolConfiguration | null,
  updatedAt: string,
};

export type AmplifyAIConversationMessage = {
  __typename: "AmplifyAIConversationMessage",
  aiContext?: string | null,
  associatedUserMessageId?: string | null,
  content?:  Array<AmplifyAIContentBlock | null > | null,
  conversationId: string,
  createdAt?: string | null,
  id: string,
  owner?: string | null,
  role?: AmplifyAIConversationParticipantRole | null,
  toolConfiguration?: AmplifyAIToolConfiguration | null,
  updatedAt?: string | null,
};

export type AmplifyAIContentBlock = {
  __typename: "AmplifyAIContentBlock",
  document?: AmplifyAIDocumentBlock | null,
  image?: AmplifyAIImageBlock | null,
  text?: string | null,
  toolResult?: AmplifyAIToolResultBlock | null,
  toolUse?: AmplifyAIToolUseBlock | null,
};

export type AmplifyAIDocumentBlock = {
  __typename: "AmplifyAIDocumentBlock",
  format: string,
  name: string,
  source: AmplifyAIDocumentBlockSource,
};

export type AmplifyAIDocumentBlockSource = {
  __typename: "AmplifyAIDocumentBlockSource",
  bytes?: string | null,
};

export type AmplifyAIImageBlock = {
  __typename: "AmplifyAIImageBlock",
  format: string,
  source: AmplifyAIImageBlockSource,
};

export type AmplifyAIImageBlockSource = {
  __typename: "AmplifyAIImageBlockSource",
  bytes?: string | null,
};

export type AmplifyAIToolResultBlock = {
  __typename: "AmplifyAIToolResultBlock",
  content:  Array<AmplifyAIToolResultContentBlock >,
  status?: string | null,
  toolUseId: string,
};

export type AmplifyAIToolResultContentBlock = {
  __typename: "AmplifyAIToolResultContentBlock",
  document?: AmplifyAIDocumentBlock | null,
  image?: AmplifyAIImageBlock | null,
  json?: string | null,
  text?: string | null,
};

export type AmplifyAIToolUseBlock = {
  __typename: "AmplifyAIToolUseBlock",
  input: string,
  name: string,
  toolUseId: string,
};

export enum AmplifyAIConversationParticipantRole {
  assistant = "assistant",
  user = "user",
}


export type AmplifyAIToolConfiguration = {
  __typename: "AmplifyAIToolConfiguration",
  tools?:  Array<AmplifyAITool | null > | null,
};

export type AmplifyAITool = {
  __typename: "AmplifyAITool",
  toolSpec?: AmplifyAIToolSpecification | null,
};

export type AmplifyAIToolSpecification = {
  __typename: "AmplifyAIToolSpecification",
  description?: string | null,
  inputSchema: AmplifyAIToolInputSchema,
  name: string,
};

export type AmplifyAIToolInputSchema = {
  __typename: "AmplifyAIToolInputSchema",
  json?: string | null,
};

export type CrmProjectImport = {
  __typename: "CrmProjectImport",
  createdAt: string,
  id: string,
  owner?: string | null,
  s3Key: string,
  status: CrmProjectImportStatus,
  updatedAt: string,
};

export enum CrmProjectImportStatus {
  DONE = "DONE",
  WIP = "WIP",
}


export type CurrentContext = {
  __typename: "CurrentContext",
  context: Context,
  createdAt: string,
  id: string,
  owner?: string | null,
  updatedAt: string,
};

export type ExportTask = {
  __typename: "ExportTask",
  createdAt: string,
  dataSource: ExportTaskDataSource,
  endDate: string,
  error?: string | null,
  id: string,
  itemId: string,
  itemName?: string | null,
  owner?: string | null,
  result?: string | null,
  startDate: string,
  status: ExportStatus,
  ttl?: number | null,
  updatedAt: string,
};

export enum ExportTaskDataSource {
  account = "account",
  project = "project",
}


export enum ExportStatus {
  COMPLETED = "COMPLETED",
  CREATED = "CREATED",
  GENERATED = "GENERATED",
}


export type ModelAccountLearningFilterInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountLearningFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  learnedOn?: ModelStringInput | null,
  learning?: ModelStringInput | null,
  not?: ModelAccountLearningFilterInput | null,
  or?: Array< ModelAccountLearningFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelLearningStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelLearningStatusInput = {
  eq?: LearningStatus | null,
  ne?: LearningStatus | null,
};

export type ModelAccountLearningPersonFilterInput = {
  and?: Array< ModelAccountLearningPersonFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  learningId?: ModelIDInput | null,
  not?: ModelAccountLearningPersonFilterInput | null,
  or?: Array< ModelAccountLearningPersonFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAccountPayerAccountFilterInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountPayerAccountFilterInput | null > | null,
  awsAccountNumberId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelAccountPayerAccountFilterInput | null,
  or?: Array< ModelAccountPayerAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAccountProjectsFilterInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountProjectsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelAccountProjectsFilterInput | null,
  or?: Array< ModelAccountProjectsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAccountTerritoryFilterInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountTerritoryFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelAccountTerritoryFilterInput | null,
  or?: Array< ModelAccountTerritoryFilterInput | null > | null,
  owner?: ModelStringInput | null,
  territoryId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAccountFilterInput = {
  accountSubsidiariesId?: ModelIDInput | null,
  and?: Array< ModelAccountFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  introduction?: ModelStringInput | null,
  introductionJson?: ModelStringInput | null,
  mainColor?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelAccountFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelAccountFilterInput | null > | null,
  order?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  shortName?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelActivityFilterInput = {
  and?: Array< ModelActivityFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  finishedOn?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  meetingActivitiesId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelActivityFilterInput | null,
  noteBlockIds?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  notesJson?: ModelStringInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBookOfBibleFilterInput = {
  alias?: ModelStringInput | null,
  and?: Array< ModelBookOfBibleFilterInput | null > | null,
  book?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  noOfChapters?: ModelIntInput | null,
  not?: ModelBookOfBibleFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelBookOfBibleFilterInput | null > | null,
  owner?: ModelStringInput | null,
  section?: ModelSectionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSectionInput = {
  eq?: Section | null,
  ne?: Section | null,
};

export type ModelBookOfBibleConnection = {
  __typename: "ModelBookOfBibleConnection",
  items:  Array<BookOfBible | null >,
  nextToken?: string | null,
};

export type ModelCrmProjectImportFilterInput = {
  and?: Array< ModelCrmProjectImportFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelCrmProjectImportFilterInput | null,
  or?: Array< ModelCrmProjectImportFilterInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  status?: ModelCrmProjectImportStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCrmProjectImportStatusInput = {
  eq?: CrmProjectImportStatus | null,
  ne?: CrmProjectImportStatus | null,
};

export type ModelCrmProjectImportConnection = {
  __typename: "ModelCrmProjectImportConnection",
  items:  Array<CrmProjectImport | null >,
  nextToken?: string | null,
};

export type ModelProjectsFilterInput = {
  and?: Array< ModelProjectsFilterInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  done?: ModelBooleanInput | null,
  doneOn?: ModelStringInput | null,
  dueOn?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  myNextActions?: ModelStringInput | null,
  myNextActionsJson?: ModelStringInput | null,
  not?: ModelProjectsFilterInput | null,
  notionId?: ModelIntInput | null,
  onHoldTill?: ModelStringInput | null,
  or?: Array< ModelProjectsFilterInput | null > | null,
  order?: ModelFloatInput | null,
  othersNextActions?: ModelStringInput | null,
  othersNextActionsJson?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  partnerId?: ModelIDInput | null,
  pinned?: ModelProjectPinnedInput | null,
  project?: ModelStringInput | null,
  tasksSummary?: ModelStringInput | null,
  tasksSummaryUpdatedAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelContextInput = {
  eq?: Context | null,
  ne?: Context | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelProjectPinnedInput = {
  eq?: ProjectPinned | null,
  ne?: ProjectPinned | null,
};

export type ModelNoteBlockPersonFilterInput = {
  and?: Array< ModelNoteBlockPersonFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelNoteBlockPersonFilterInput | null,
  noteBlockId?: ModelIDInput | null,
  or?: Array< ModelNoteBlockPersonFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDailyPlanProjectFilterInput = {
  and?: Array< ModelDailyPlanProjectFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dailyPlanId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  maybe?: ModelBooleanInput | null,
  not?: ModelDailyPlanProjectFilterInput | null,
  or?: Array< ModelDailyPlanProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDailyPlanFilterInput = {
  and?: Array< ModelDailyPlanFilterInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  day?: ModelStringInput | null,
  dayGoal?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelDailyPlanFilterInput | null,
  or?: Array< ModelDailyPlanFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelDailyPlanStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDailyPlanStatusInput = {
  eq?: DailyPlanStatus | null,
  ne?: DailyPlanStatus | null,
};

export type ModelDailyPlanConnection = {
  __typename: "ModelDailyPlanConnection",
  items:  Array<DailyPlan | null >,
  nextToken?: string | null,
};

export type ModelDailyPlanTodoFilterInput = {
  and?: Array< ModelDailyPlanTodoFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dailyPlanId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  not?: ModelDailyPlanTodoFilterInput | null,
  or?: Array< ModelDailyPlanTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  postPoned?: ModelBooleanInput | null,
  todoId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelWeeklyReviewFilterInput = {
  and?: Array< ModelWeeklyReviewFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelWeeklyReviewFilterInput | null,
  or?: Array< ModelWeeklyReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelWeeklyReviewStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelWeeklyReviewStatusInput = {
  eq?: WeeklyReviewStatus | null,
  ne?: WeeklyReviewStatus | null,
};

export type ModelWeeklyReviewConnection = {
  __typename: "ModelWeeklyReviewConnection",
  items:  Array<WeeklyReview | null >,
  nextToken?: string | null,
};

export type ModelConversationGeneralChatFilterInput = {
  and?: Array< ModelConversationGeneralChatFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  metadata?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelConversationGeneralChatFilterInput | null,
  or?: Array< ModelConversationGeneralChatFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelConversationGeneralChatConnection = {
  __typename: "ModelConversationGeneralChatConnection",
  items:  Array<ConversationGeneralChat | null >,
  nextToken?: string | null,
};

export type ModelConversationMessageGeneralChatFilterInput = {
  aiContext?: ModelStringInput | null,
  and?: Array< ModelConversationMessageGeneralChatFilterInput | null > | null,
  associatedUserMessageId?: ModelIDInput | null,
  conversationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelConversationMessageGeneralChatFilterInput | null,
  or?: Array< ModelConversationMessageGeneralChatFilterInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelAmplifyAIConversationParticipantRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAmplifyAIConversationParticipantRoleInput = {
  eq?: AmplifyAIConversationParticipantRole | null,
  ne?: AmplifyAIConversationParticipantRole | null,
};

export type ModelCrmProjectProjectsFilterInput = {
  and?: Array< ModelCrmProjectProjectsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmProjectId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  not?: ModelCrmProjectProjectsFilterInput | null,
  or?: Array< ModelCrmProjectProjectsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCrmProjectFilterInput = {
  accountName?: ModelStringInput | null,
  and?: Array< ModelCrmProjectFilterInput | null > | null,
  annualRecurringRevenue?: ModelIntInput | null,
  closeDate?: ModelStringInput | null,
  confirmHygieneIssuesSolvedTill?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  createdDate?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isMarketplace?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  nextStep?: ModelStringInput | null,
  not?: ModelCrmProjectFilterInput | null,
  opportunityOwner?: ModelStringInput | null,
  or?: Array< ModelCrmProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  partnerName?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  stageChangedDate?: ModelStringInput | null,
  territoryName?: ModelStringInput | null,
  totalContractVolume?: ModelIntInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCrmProjectConnection = {
  __typename: "ModelCrmProjectConnection",
  items:  Array<CrmProject | null >,
  nextToken?: string | null,
};

export type ModelCurrentContextFilterInput = {
  and?: Array< ModelCurrentContextFilterInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelCurrentContextFilterInput | null,
  or?: Array< ModelCurrentContextFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCurrentContextConnection = {
  __typename: "ModelCurrentContextConnection",
  items:  Array<CurrentContext | null >,
  nextToken?: string | null,
};

export type ModelExportTaskFilterInput = {
  and?: Array< ModelExportTaskFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dataSource?: ModelExportTaskDataSourceInput | null,
  endDate?: ModelStringInput | null,
  error?: ModelStringInput | null,
  id?: ModelIDInput | null,
  itemId?: ModelStringInput | null,
  itemName?: ModelStringInput | null,
  not?: ModelExportTaskFilterInput | null,
  or?: Array< ModelExportTaskFilterInput | null > | null,
  owner?: ModelStringInput | null,
  result?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  status?: ModelExportStatusInput | null,
  ttl?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelExportTaskDataSourceInput = {
  eq?: ExportTaskDataSource | null,
  ne?: ExportTaskDataSource | null,
};

export type ModelExportStatusInput = {
  eq?: ExportStatus | null,
  ne?: ExportStatus | null,
};

export type ModelExportTaskConnection = {
  __typename: "ModelExportTaskConnection",
  items:  Array<ExportTask | null >,
  nextToken?: string | null,
};

export type ModelMeetingParticipantFilterInput = {
  and?: Array< ModelMeetingParticipantFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  meetingId?: ModelIDInput | null,
  not?: ModelMeetingParticipantFilterInput | null,
  or?: Array< ModelMeetingParticipantFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelMeetingFilterInput = {
  and?: Array< ModelMeetingFilterInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  immediateTasksDone?: ModelBooleanInput | null,
  meetingOn?: ModelStringInput | null,
  not?: ModelMeetingFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelMeetingFilterInput | null > | null,
  owner?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelMeetingConnection = {
  __typename: "ModelMeetingConnection",
  items:  Array<Meeting | null >,
  nextToken?: string | null,
};

export type ModelMonthFilterInput = {
  and?: Array< ModelMonthFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  latestUploadId?: ModelIDInput | null,
  month?: ModelStringInput | null,
  not?: ModelMonthFilterInput | null,
  or?: Array< ModelMonthFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelMrrDataUploadFilterInput = {
  and?: Array< ModelMrrDataUploadFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelMrrDataUploadFilterInput | null,
  or?: Array< ModelMrrDataUploadFilterInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  status?: ModelAnalyticsImportStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAnalyticsImportStatusInput = {
  eq?: AnalyticsImportStatus | null,
  ne?: AnalyticsImportStatus | null,
};

export type ModelMrrDataUploadConnection = {
  __typename: "ModelMrrDataUploadConnection",
  items:  Array<MrrDataUpload | null >,
  nextToken?: string | null,
};

export type ModelNoteBlockFilterInput = {
  activityId?: ModelIDInput | null,
  and?: Array< ModelNoteBlockFilterInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  not?: ModelNoteBlockFilterInput | null,
  or?: Array< ModelNoteBlockFilterInput | null > | null,
  owner?: ModelStringInput | null,
  todoId?: ModelIDInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelNotesBibleChapterFilterInput = {
  and?: Array< ModelNotesBibleChapterFilterInput | null > | null,
  bookId?: ModelIDInput | null,
  chapter?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  not?: ModelNotesBibleChapterFilterInput | null,
  note?: ModelStringInput | null,
  noteJson?: ModelStringInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelNotesBibleChapterFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPayerAccountMrrFilterInput = {
  and?: Array< ModelPayerAccountMrrFilterInput | null > | null,
  awsAccountNumber?: ModelIDInput | null,
  companyName?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isEstimated?: ModelBooleanInput | null,
  isReseller?: ModelBooleanInput | null,
  monthId?: ModelIDInput | null,
  mrr?: ModelIntInput | null,
  not?: ModelPayerAccountMrrFilterInput | null,
  or?: Array< ModelPayerAccountMrrFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  uploadId?: ModelIDInput | null,
};

export type ModelPayerAccountFilterInput = {
  and?: Array< ModelPayerAccountFilterInput | null > | null,
  awsAccountNumber?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isViaReseller?: ModelBooleanInput | null,
  mainContactId?: ModelIDInput | null,
  not?: ModelPayerAccountFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelPayerAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  resellerId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPersonFilterInput = {
  and?: Array< ModelPersonFilterInput | null > | null,
  birthday?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dateOfDeath?: ModelStringInput | null,
  howToSay?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelPersonFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelPersonFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPersonConnection = {
  __typename: "ModelPersonConnection",
  items:  Array<Person | null >,
  nextToken?: string | null,
};

export type ModelPersonAccountFilterInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelPersonAccountFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPersonAccountFilterInput | null,
  or?: Array< ModelPersonAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  position?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPersonDetailFilterInput = {
  and?: Array< ModelPersonDetailFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  detail?: ModelStringInput | null,
  id?: ModelIDInput | null,
  label?: ModelPersonDetailsEnumInput | null,
  not?: ModelPersonDetailFilterInput | null,
  or?: Array< ModelPersonDetailFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPersonDetailsEnumInput = {
  eq?: PersonDetailsEnum | null,
  ne?: PersonDetailsEnum | null,
};

export type ModelPersonLearningFilterInput = {
  and?: Array< ModelPersonLearningFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  learnedOn?: ModelStringInput | null,
  learning?: ModelStringInput | null,
  not?: ModelPersonLearningFilterInput | null,
  or?: Array< ModelPersonLearningFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  prayer?: ModelPrayerStatusInput | null,
  status?: ModelLearningStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPrayerStatusInput = {
  eq?: PrayerStatus | null,
  ne?: PrayerStatus | null,
};

export type ModelPersonRelationshipFilterInput = {
  and?: Array< ModelPersonRelationshipFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPersonRelationshipFilterInput | null,
  or?: Array< ModelPersonRelationshipFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  relatedPersonId?: ModelIDInput | null,
  typeName?: ModelRelationshipTypeEnumInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelRelationshipTypeEnumInput = {
  eq?: RelationshipTypeEnum | null,
  ne?: RelationshipTypeEnum | null,
};

export type ModelProjectActivityFilterInput = {
  activityId?: ModelIDInput | null,
  and?: Array< ModelProjectActivityFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelProjectActivityFilterInput | null,
  or?: Array< ModelProjectActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSixWeekBatchProjectsFilterInput = {
  and?: Array< ModelSixWeekBatchProjectsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelSixWeekBatchProjectsFilterInput | null,
  or?: Array< ModelSixWeekBatchProjectsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelIDInput | null,
  sixWeekBatchId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSixWeekBatchFilterInput = {
  and?: Array< ModelSixWeekBatchFilterInput | null > | null,
  appetite?: ModelSixWeekBatchAppetiteInput | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  createdOn?: ModelStringInput | null,
  hours?: ModelIntInput | null,
  id?: ModelIDInput | null,
  idea?: ModelStringInput | null,
  noGos?: ModelStringInput | null,
  not?: ModelSixWeekBatchFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelSixWeekBatchFilterInput | null > | null,
  owner?: ModelStringInput | null,
  problem?: ModelStringInput | null,
  risks?: ModelStringInput | null,
  sixWeekCycleBatchesId?: ModelIDInput | null,
  solution?: ModelStringInput | null,
  status?: ModelSixWeekBatchStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSixWeekBatchAppetiteInput = {
  eq?: SixWeekBatchAppetite | null,
  ne?: SixWeekBatchAppetite | null,
};

export type ModelSixWeekBatchStatusInput = {
  eq?: SixWeekBatchStatus | null,
  ne?: SixWeekBatchStatus | null,
};

export type ModelSixWeekCycleFilterInput = {
  and?: Array< ModelSixWeekCycleFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelSixWeekCycleFilterInput | null,
  or?: Array< ModelSixWeekCycleFilterInput | null > | null,
  owner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSixWeekCycleConnection = {
  __typename: "ModelSixWeekCycleConnection",
  items:  Array<SixWeekCycle | null >,
  nextToken?: string | null,
};

export type ModelTerritoryFilterInput = {
  and?: Array< ModelTerritoryFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelTerritoryFilterInput | null,
  or?: Array< ModelTerritoryFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTerritoryConnection = {
  __typename: "ModelTerritoryConnection",
  items:  Array<Territory | null >,
  nextToken?: string | null,
};

export type ModelTerritoryResponsibilityFilterInput = {
  and?: Array< ModelTerritoryResponsibilityFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTerritoryResponsibilityFilterInput | null,
  or?: Array< ModelTerritoryResponsibilityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  quota?: ModelIntInput | null,
  startDate?: ModelStringInput | null,
  territoryId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTodoFilterInput = {
  and?: Array< ModelTodoFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  doneOn?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelTodoFilterInput | null,
  or?: Array< ModelTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelTodoStatusInput | null,
  todo?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTodoStatusInput = {
  eq?: TodoStatus | null,
  ne?: TodoStatus | null,
};

export type ModelTodoConnection = {
  __typename: "ModelTodoConnection",
  items:  Array<Todo | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  and?: Array< ModelUserFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  personId?: ModelIDInput | null,
  profileId?: ModelStringInput | null,
  profilePicture?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelWeeklyPlanFilterInput = {
  and?: Array< ModelWeeklyPlanFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmUpdateSkipped?: ModelBooleanInput | null,
  financialUpdateSkipped?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  inboxSkipped?: ModelBooleanInput | null,
  not?: ModelWeeklyPlanFilterInput | null,
  or?: Array< ModelWeeklyPlanFilterInput | null > | null,
  owner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  status?: ModelPlanningStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPlanningStatusInput = {
  eq?: PlanningStatus | null,
  ne?: PlanningStatus | null,
};

export type ModelWeeklyPlanConnection = {
  __typename: "ModelWeeklyPlanConnection",
  items:  Array<WeeklyPlan | null >,
  nextToken?: string | null,
};

export type ModelWeeklyPlanProjectFilterInput = {
  and?: Array< ModelWeeklyPlanProjectFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelWeeklyPlanProjectFilterInput | null,
  or?: Array< ModelWeeklyPlanProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  weekPlanId?: ModelIDInput | null,
};

export type ModelWeeklyReviewEntryFilterInput = {
  and?: Array< ModelWeeklyReviewEntryFilterInput | null > | null,
  category?: ModelWeeklyReviewCategoryInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  generatedContent?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isEdited?: ModelBooleanInput | null,
  not?: ModelWeeklyReviewEntryFilterInput | null,
  or?: Array< ModelWeeklyReviewEntryFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  reviewId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelWeeklyReviewCategoryInput = {
  eq?: WeeklyReviewCategory | null,
  ne?: WeeklyReviewCategory | null,
};

export type RewriteProjectNotesReturnType = {
  __typename: "RewriteProjectNotesReturnType",
  response?: string | null,
};

export type ModelAccountConditionInput = {
  accountSubsidiariesId?: ModelIDInput | null,
  and?: Array< ModelAccountConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  introduction?: ModelStringInput | null,
  introductionJson?: ModelStringInput | null,
  mainColor?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelAccountConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelAccountConditionInput | null > | null,
  order?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  shortName?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountInput = {
  accountSubsidiariesId?: string | null,
  crmId?: string | null,
  formatVersion?: number | null,
  id?: string | null,
  introduction?: string | null,
  introductionJson?: string | null,
  mainColor?: string | null,
  name: string,
  notionId?: number | null,
  order?: number | null,
  owner?: string | null,
  shortName?: string | null,
};

export type ModelAccountLearningConditionInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountLearningConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  learnedOn?: ModelStringInput | null,
  learning?: ModelStringInput | null,
  not?: ModelAccountLearningConditionInput | null,
  or?: Array< ModelAccountLearningConditionInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelLearningStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountLearningInput = {
  accountId: string,
  id?: string | null,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  status: LearningStatus,
};

export type ModelAccountLearningPersonConditionInput = {
  and?: Array< ModelAccountLearningPersonConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  learningId?: ModelIDInput | null,
  not?: ModelAccountLearningPersonConditionInput | null,
  or?: Array< ModelAccountLearningPersonConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountLearningPersonInput = {
  id?: string | null,
  learningId: string,
  owner?: string | null,
  personId: string,
};

export type ModelAccountPayerAccountConditionInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountPayerAccountConditionInput | null > | null,
  awsAccountNumberId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelAccountPayerAccountConditionInput | null,
  or?: Array< ModelAccountPayerAccountConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountPayerAccountInput = {
  accountId: string,
  awsAccountNumberId: string,
  id?: string | null,
  owner?: string | null,
};

export type ModelAccountProjectsConditionInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountProjectsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelAccountProjectsConditionInput | null,
  or?: Array< ModelAccountProjectsConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountProjectsInput = {
  accountId: string,
  id?: string | null,
  owner?: string | null,
  projectsId: string,
};

export type ModelAccountTerritoryConditionInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelAccountTerritoryConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelAccountTerritoryConditionInput | null,
  or?: Array< ModelAccountTerritoryConditionInput | null > | null,
  owner?: ModelStringInput | null,
  territoryId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountTerritoryInput = {
  accountId: string,
  id?: string | null,
  owner?: string | null,
  territoryId: string,
};

export type ModelActivityConditionInput = {
  and?: Array< ModelActivityConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  finishedOn?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  meetingActivitiesId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelActivityConditionInput | null,
  noteBlockIds?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  notesJson?: ModelStringInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelActivityConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateActivityInput = {
  finishedOn?: string | null,
  formatVersion?: number | null,
  id?: string | null,
  meetingActivitiesId?: string | null,
  name?: string | null,
  noteBlockIds?: Array< string > | null,
  notes?: string | null,
  notesJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type CreateConversationMessageGeneralChatAssistantInput = {
  associatedUserMessageId?: string | null,
  content?: Array< AmplifyAIContentBlockInput | null > | null,
  conversationId?: string | null,
};

export type AmplifyAIContentBlockInput = {
  document?: AmplifyAIDocumentBlockInput | null,
  image?: AmplifyAIImageBlockInput | null,
  text?: string | null,
  toolResult?: AmplifyAIToolResultBlockInput | null,
  toolUse?: AmplifyAIToolUseBlockInput | null,
};

export type AmplifyAIDocumentBlockInput = {
  format: string,
  name: string,
  source: AmplifyAIDocumentBlockSourceInput,
};

export type AmplifyAIDocumentBlockSourceInput = {
  bytes?: string | null,
};

export type AmplifyAIImageBlockInput = {
  format: string,
  source: AmplifyAIImageBlockSourceInput,
};

export type AmplifyAIImageBlockSourceInput = {
  bytes?: string | null,
};

export type AmplifyAIToolResultBlockInput = {
  content: Array< AmplifyAIToolResultContentBlockInput >,
  status?: string | null,
  toolUseId: string,
};

export type AmplifyAIToolResultContentBlockInput = {
  document?: AmplifyAIDocumentBlockInput | null,
  image?: AmplifyAIImageBlockInput | null,
  json?: string | null,
  text?: string | null,
};

export type AmplifyAIToolUseBlockInput = {
  input: string,
  name: string,
  toolUseId: string,
};

export type CreateConversationMessageGeneralChatAssistantStreamingInput = {
  accumulatedTurnContent?: Array< AmplifyAIContentBlockInput | null > | null,
  associatedUserMessageId: string,
  contentBlockDeltaIndex?: number | null,
  contentBlockDoneAtIndex?: number | null,
  contentBlockIndex?: number | null,
  contentBlockText?: string | null,
  contentBlockToolUse?: string | null,
  conversationId: string,
  errors?: Array< AmplifyAIConversationTurnErrorInput | null > | null,
  p?: string | null,
  stopReason?: string | null,
};

export type AmplifyAIConversationTurnErrorInput = {
  errorType: string,
  message: string,
};

export type AmplifyAIConversationMessageStreamPart = {
  __typename: "AmplifyAIConversationMessageStreamPart",
  associatedUserMessageId: string,
  contentBlockDeltaIndex?: number | null,
  contentBlockDoneAtIndex?: number | null,
  contentBlockIndex?: number | null,
  contentBlockText?: string | null,
  contentBlockToolUse?: AmplifyAIToolUseBlock | null,
  conversationId: string,
  errors?:  Array<AmplifyAIConversationTurnError | null > | null,
  id: string,
  owner?: string | null,
  p?: string | null,
  stopReason?: string | null,
};

export type AmplifyAIConversationTurnError = {
  __typename: "AmplifyAIConversationTurnError",
  errorType: string,
  message: string,
};

export type ModelBookOfBibleConditionInput = {
  alias?: ModelStringInput | null,
  and?: Array< ModelBookOfBibleConditionInput | null > | null,
  book?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  noOfChapters?: ModelIntInput | null,
  not?: ModelBookOfBibleConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelBookOfBibleConditionInput | null > | null,
  owner?: ModelStringInput | null,
  section?: ModelSectionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateBookOfBibleInput = {
  alias: string,
  book: string,
  id?: string | null,
  noOfChapters?: number | null,
  notionId?: number | null,
  section: Section,
};

export type ModelConversationGeneralChatConditionInput = {
  and?: Array< ModelConversationGeneralChatConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  metadata?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelConversationGeneralChatConditionInput | null,
  or?: Array< ModelConversationGeneralChatConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateConversationGeneralChatInput = {
  id?: string | null,
  metadata?: string | null,
  name?: string | null,
};

export type ModelConversationMessageGeneralChatConditionInput = {
  aiContext?: ModelStringInput | null,
  and?: Array< ModelConversationMessageGeneralChatConditionInput | null > | null,
  associatedUserMessageId?: ModelIDInput | null,
  conversationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelConversationMessageGeneralChatConditionInput | null,
  or?: Array< ModelConversationMessageGeneralChatConditionInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelAmplifyAIConversationParticipantRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateConversationMessageGeneralChatInput = {
  aiContext?: string | null,
  associatedUserMessageId?: string | null,
  content?: Array< AmplifyAIContentBlockInput | null > | null,
  conversationId: string,
  id?: string | null,
  role?: AmplifyAIConversationParticipantRole | null,
  toolConfiguration?: AmplifyAIToolConfigurationInput | null,
};

export type AmplifyAIToolConfigurationInput = {
  tools?: Array< AmplifyAIToolInput | null > | null,
};

export type AmplifyAIToolInput = {
  toolSpec?: AmplifyAIToolSpecificationInput | null,
};

export type AmplifyAIToolSpecificationInput = {
  description?: string | null,
  inputSchema: AmplifyAIToolInputSchemaInput,
  name: string,
};

export type AmplifyAIToolInputSchemaInput = {
  json?: string | null,
};

export type ModelCrmProjectConditionInput = {
  accountName?: ModelStringInput | null,
  and?: Array< ModelCrmProjectConditionInput | null > | null,
  annualRecurringRevenue?: ModelIntInput | null,
  closeDate?: ModelStringInput | null,
  confirmHygieneIssuesSolvedTill?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  createdDate?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  isMarketplace?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  nextStep?: ModelStringInput | null,
  not?: ModelCrmProjectConditionInput | null,
  opportunityOwner?: ModelStringInput | null,
  or?: Array< ModelCrmProjectConditionInput | null > | null,
  owner?: ModelStringInput | null,
  partnerName?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  stageChangedDate?: ModelStringInput | null,
  territoryName?: ModelStringInput | null,
  totalContractVolume?: ModelIntInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCrmProjectInput = {
  accountName?: string | null,
  annualRecurringRevenue?: number | null,
  closeDate: string,
  confirmHygieneIssuesSolvedTill?: string | null,
  createdDate?: string | null,
  crmId?: string | null,
  id?: string | null,
  isMarketplace?: boolean | null,
  name: string,
  nextStep?: string | null,
  opportunityOwner?: string | null,
  owner?: string | null,
  partnerName?: string | null,
  stage: string,
  stageChangedDate?: string | null,
  territoryName?: string | null,
  totalContractVolume?: number | null,
  type?: string | null,
};

export type ModelCrmProjectImportConditionInput = {
  and?: Array< ModelCrmProjectImportConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelCrmProjectImportConditionInput | null,
  or?: Array< ModelCrmProjectImportConditionInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  status?: ModelCrmProjectImportStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCrmProjectImportInput = {
  createdAt?: string | null,
  id?: string | null,
  owner?: string | null,
  s3Key: string,
  status: CrmProjectImportStatus,
};

export type ModelCrmProjectProjectsConditionInput = {
  and?: Array< ModelCrmProjectProjectsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmProjectId?: ModelIDInput | null,
  not?: ModelCrmProjectProjectsConditionInput | null,
  or?: Array< ModelCrmProjectProjectsConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCrmProjectProjectsInput = {
  crmProjectId: string,
  id?: string | null,
  owner?: string | null,
  projectId: string,
};

export type ModelCurrentContextConditionInput = {
  and?: Array< ModelCurrentContextConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelCurrentContextConditionInput | null,
  or?: Array< ModelCurrentContextConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCurrentContextInput = {
  context: Context,
  id?: string | null,
  owner?: string | null,
};

export type ModelDailyPlanConditionInput = {
  and?: Array< ModelDailyPlanConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  day?: ModelStringInput | null,
  dayGoal?: ModelStringInput | null,
  not?: ModelDailyPlanConditionInput | null,
  or?: Array< ModelDailyPlanConditionInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelDailyPlanStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDailyPlanInput = {
  context: Context,
  day: string,
  dayGoal: string,
  id?: string | null,
  owner?: string | null,
  status: DailyPlanStatus,
};

export type ModelDailyPlanProjectConditionInput = {
  and?: Array< ModelDailyPlanProjectConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dailyPlanId?: ModelIDInput | null,
  maybe?: ModelBooleanInput | null,
  not?: ModelDailyPlanProjectConditionInput | null,
  or?: Array< ModelDailyPlanProjectConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDailyPlanProjectInput = {
  dailyPlanId: string,
  id?: string | null,
  maybe?: boolean | null,
  owner?: string | null,
  projectId: string,
  updatedAt?: string | null,
};

export type ModelDailyPlanTodoConditionInput = {
  and?: Array< ModelDailyPlanTodoConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dailyPlanId?: ModelIDInput | null,
  not?: ModelDailyPlanTodoConditionInput | null,
  or?: Array< ModelDailyPlanTodoConditionInput | null > | null,
  owner?: ModelStringInput | null,
  postPoned?: ModelBooleanInput | null,
  todoId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDailyPlanTodoInput = {
  dailyPlanId: string,
  id?: string | null,
  owner?: string | null,
  postPoned?: boolean | null,
  todoId: string,
  updatedAt?: string | null,
};

export type ModelExportTaskConditionInput = {
  and?: Array< ModelExportTaskConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dataSource?: ModelExportTaskDataSourceInput | null,
  endDate?: ModelStringInput | null,
  error?: ModelStringInput | null,
  itemId?: ModelStringInput | null,
  itemName?: ModelStringInput | null,
  not?: ModelExportTaskConditionInput | null,
  or?: Array< ModelExportTaskConditionInput | null > | null,
  owner?: ModelStringInput | null,
  result?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  status?: ModelExportStatusInput | null,
  ttl?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateExportTaskInput = {
  dataSource: ExportTaskDataSource,
  endDate: string,
  error?: string | null,
  id?: string | null,
  itemId: string,
  itemName?: string | null,
  owner?: string | null,
  result?: string | null,
  startDate: string,
  status: ExportStatus,
  ttl?: number | null,
};

export type ModelInboxConditionInput = {
  and?: Array< ModelInboxConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  movedToAccountLearningId?: ModelStringInput | null,
  movedToActivityId?: ModelStringInput | null,
  movedToPersonLearningId?: ModelStringInput | null,
  not?: ModelInboxConditionInput | null,
  note?: ModelStringInput | null,
  noteJson?: ModelStringInput | null,
  or?: Array< ModelInboxConditionInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelInboxStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateInboxInput = {
  createdAt?: string | null,
  formatVersion?: number | null,
  id?: string | null,
  movedToAccountLearningId?: string | null,
  movedToActivityId?: string | null,
  movedToPersonLearningId?: string | null,
  note?: string | null,
  noteJson?: string | null,
  owner?: string | null,
  status: InboxStatus,
};

export type ModelMeetingConditionInput = {
  and?: Array< ModelMeetingConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  immediateTasksDone?: ModelBooleanInput | null,
  meetingOn?: ModelStringInput | null,
  not?: ModelMeetingConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelMeetingConditionInput | null > | null,
  owner?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMeetingInput = {
  context?: Context | null,
  id?: string | null,
  immediateTasksDone?: boolean | null,
  meetingOn?: string | null,
  notionId?: number | null,
  owner?: string | null,
  topic: string,
};

export type ModelMeetingParticipantConditionInput = {
  and?: Array< ModelMeetingParticipantConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  meetingId?: ModelIDInput | null,
  not?: ModelMeetingParticipantConditionInput | null,
  or?: Array< ModelMeetingParticipantConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMeetingParticipantInput = {
  createdAt?: string | null,
  id?: string | null,
  meetingId: string,
  owner?: string | null,
  personId: string,
};

export type ModelMonthConditionInput = {
  and?: Array< ModelMonthConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  latestUploadId?: ModelIDInput | null,
  month?: ModelStringInput | null,
  not?: ModelMonthConditionInput | null,
  or?: Array< ModelMonthConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMonthInput = {
  id?: string | null,
  latestUploadId: string,
  month: string,
  owner?: string | null,
};

export type ModelMrrDataUploadConditionInput = {
  and?: Array< ModelMrrDataUploadConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelMrrDataUploadConditionInput | null,
  or?: Array< ModelMrrDataUploadConditionInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  status?: ModelAnalyticsImportStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMrrDataUploadInput = {
  createdAt?: string | null,
  id?: string | null,
  owner?: string | null,
  s3Key: string,
  status: AnalyticsImportStatus,
};

export type ModelNoteBlockConditionInput = {
  activityId?: ModelIDInput | null,
  and?: Array< ModelNoteBlockConditionInput | null > | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  not?: ModelNoteBlockConditionInput | null,
  or?: Array< ModelNoteBlockConditionInput | null > | null,
  owner?: ModelStringInput | null,
  todoId?: ModelIDInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateNoteBlockInput = {
  activityId: string,
  content?: string | null,
  formatVersion: number,
  id?: string | null,
  owner?: string | null,
  todoId?: string | null,
  type: string,
};

export type ModelNoteBlockPersonConditionInput = {
  and?: Array< ModelNoteBlockPersonConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelNoteBlockPersonConditionInput | null,
  noteBlockId?: ModelIDInput | null,
  or?: Array< ModelNoteBlockPersonConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateNoteBlockPersonInput = {
  createdAt?: string | null,
  id?: string | null,
  noteBlockId: string,
  owner?: string | null,
  personId: string,
};

export type ModelNotesBibleChapterConditionInput = {
  and?: Array< ModelNotesBibleChapterConditionInput | null > | null,
  bookId?: ModelIDInput | null,
  chapter?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  not?: ModelNotesBibleChapterConditionInput | null,
  note?: ModelStringInput | null,
  noteJson?: ModelStringInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelNotesBibleChapterConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateNotesBibleChapterInput = {
  bookId: string,
  chapter: number,
  formatVersion?: number | null,
  id?: string | null,
  note?: string | null,
  noteJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type ModelPayerAccountConditionInput = {
  and?: Array< ModelPayerAccountConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  isViaReseller?: ModelBooleanInput | null,
  mainContactId?: ModelIDInput | null,
  not?: ModelPayerAccountConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelPayerAccountConditionInput | null > | null,
  owner?: ModelStringInput | null,
  resellerId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePayerAccountInput = {
  awsAccountNumber: string,
  isViaReseller?: boolean | null,
  mainContactId?: string | null,
  notes?: string | null,
  owner?: string | null,
  resellerId?: string | null,
};

export type ModelPayerAccountMrrConditionInput = {
  and?: Array< ModelPayerAccountMrrConditionInput | null > | null,
  awsAccountNumber?: ModelIDInput | null,
  companyName?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  isEstimated?: ModelBooleanInput | null,
  isReseller?: ModelBooleanInput | null,
  monthId?: ModelIDInput | null,
  mrr?: ModelIntInput | null,
  not?: ModelPayerAccountMrrConditionInput | null,
  or?: Array< ModelPayerAccountMrrConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  uploadId?: ModelIDInput | null,
};

export type CreatePayerAccountMrrInput = {
  awsAccountNumber: string,
  companyName: string,
  id?: string | null,
  isEstimated: boolean,
  isReseller: boolean,
  monthId: string,
  mrr?: number | null,
  owner?: string | null,
  uploadId: string,
};

export type ModelPersonConditionInput = {
  and?: Array< ModelPersonConditionInput | null > | null,
  birthday?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dateOfDeath?: ModelStringInput | null,
  howToSay?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelPersonConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelPersonConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePersonInput = {
  birthday?: string | null,
  dateOfDeath?: string | null,
  howToSay?: string | null,
  id?: string | null,
  name: string,
  notionId?: number | null,
  owner?: string | null,
};

export type ModelPersonAccountConditionInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelPersonAccountConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  not?: ModelPersonAccountConditionInput | null,
  or?: Array< ModelPersonAccountConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  position?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePersonAccountInput = {
  accountId: string,
  endDate?: string | null,
  id?: string | null,
  owner?: string | null,
  personId: string,
  position?: string | null,
  startDate?: string | null,
};

export type ModelPersonDetailConditionInput = {
  and?: Array< ModelPersonDetailConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  detail?: ModelStringInput | null,
  label?: ModelPersonDetailsEnumInput | null,
  not?: ModelPersonDetailConditionInput | null,
  or?: Array< ModelPersonDetailConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePersonDetailInput = {
  detail: string,
  id?: string | null,
  label: PersonDetailsEnum,
  owner?: string | null,
  personId: string,
};

export type ModelPersonLearningConditionInput = {
  and?: Array< ModelPersonLearningConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  learnedOn?: ModelStringInput | null,
  learning?: ModelStringInput | null,
  not?: ModelPersonLearningConditionInput | null,
  or?: Array< ModelPersonLearningConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  prayer?: ModelPrayerStatusInput | null,
  status?: ModelLearningStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePersonLearningInput = {
  id?: string | null,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  personId: string,
  prayer?: PrayerStatus | null,
  status: LearningStatus,
};

export type ModelPersonRelationshipConditionInput = {
  and?: Array< ModelPersonRelationshipConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  not?: ModelPersonRelationshipConditionInput | null,
  or?: Array< ModelPersonRelationshipConditionInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelIDInput | null,
  relatedPersonId?: ModelIDInput | null,
  typeName?: ModelRelationshipTypeEnumInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePersonRelationshipInput = {
  date?: string | null,
  endDate?: string | null,
  id?: string | null,
  owner?: string | null,
  personId?: string | null,
  relatedPersonId?: string | null,
  typeName?: RelationshipTypeEnum | null,
};

export type ModelProjectActivityConditionInput = {
  activityId?: ModelIDInput | null,
  and?: Array< ModelProjectActivityConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelProjectActivityConditionInput | null,
  or?: Array< ModelProjectActivityConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateProjectActivityInput = {
  activityId: string,
  id?: string | null,
  owner?: string | null,
  projectsId: string,
};

export type ModelProjectsConditionInput = {
  and?: Array< ModelProjectsConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  done?: ModelBooleanInput | null,
  doneOn?: ModelStringInput | null,
  dueOn?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  myNextActions?: ModelStringInput | null,
  myNextActionsJson?: ModelStringInput | null,
  not?: ModelProjectsConditionInput | null,
  notionId?: ModelIntInput | null,
  onHoldTill?: ModelStringInput | null,
  or?: Array< ModelProjectsConditionInput | null > | null,
  order?: ModelFloatInput | null,
  othersNextActions?: ModelStringInput | null,
  othersNextActionsJson?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  partnerId?: ModelIDInput | null,
  pinned?: ModelProjectPinnedInput | null,
  project?: ModelStringInput | null,
  tasksSummary?: ModelStringInput | null,
  tasksSummaryUpdatedAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateProjectsInput = {
  context: Context,
  done?: boolean | null,
  doneOn?: string | null,
  dueOn?: string | null,
  formatVersion?: number | null,
  id?: string | null,
  myNextActions?: string | null,
  myNextActionsJson?: string | null,
  notionId?: number | null,
  onHoldTill?: string | null,
  order?: number | null,
  othersNextActions?: string | null,
  othersNextActionsJson?: string | null,
  owner?: string | null,
  partnerId?: string | null,
  pinned: ProjectPinned,
  project: string,
  tasksSummary?: string | null,
  tasksSummaryUpdatedAt?: string | null,
};

export type ModelSixWeekBatchConditionInput = {
  and?: Array< ModelSixWeekBatchConditionInput | null > | null,
  appetite?: ModelSixWeekBatchAppetiteInput | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  createdOn?: ModelStringInput | null,
  hours?: ModelIntInput | null,
  idea?: ModelStringInput | null,
  noGos?: ModelStringInput | null,
  not?: ModelSixWeekBatchConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelSixWeekBatchConditionInput | null > | null,
  owner?: ModelStringInput | null,
  problem?: ModelStringInput | null,
  risks?: ModelStringInput | null,
  sixWeekCycleBatchesId?: ModelIDInput | null,
  solution?: ModelStringInput | null,
  status?: ModelSixWeekBatchStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSixWeekBatchInput = {
  appetite?: SixWeekBatchAppetite | null,
  context?: Context | null,
  createdOn?: string | null,
  hours?: number | null,
  id?: string | null,
  idea: string,
  noGos?: string | null,
  notionId?: number | null,
  owner?: string | null,
  problem?: string | null,
  risks?: string | null,
  sixWeekCycleBatchesId: string,
  solution?: string | null,
  status?: SixWeekBatchStatus | null,
};

export type ModelSixWeekBatchProjectsConditionInput = {
  and?: Array< ModelSixWeekBatchProjectsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelSixWeekBatchProjectsConditionInput | null,
  or?: Array< ModelSixWeekBatchProjectsConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelIDInput | null,
  sixWeekBatchId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSixWeekBatchProjectsInput = {
  id?: string | null,
  owner?: string | null,
  projectsId: string,
  sixWeekBatchId: string,
};

export type ModelSixWeekCycleConditionInput = {
  and?: Array< ModelSixWeekCycleConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelSixWeekCycleConditionInput | null,
  or?: Array< ModelSixWeekCycleConditionInput | null > | null,
  owner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSixWeekCycleInput = {
  id?: string | null,
  name: string,
  owner?: string | null,
  startDate?: string | null,
};

export type ModelTerritoryConditionInput = {
  and?: Array< ModelTerritoryConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelTerritoryConditionInput | null,
  or?: Array< ModelTerritoryConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTerritoryInput = {
  crmId?: string | null,
  id?: string | null,
  name?: string | null,
  owner?: string | null,
};

export type ModelTerritoryResponsibilityConditionInput = {
  and?: Array< ModelTerritoryResponsibilityConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTerritoryResponsibilityConditionInput | null,
  or?: Array< ModelTerritoryResponsibilityConditionInput | null > | null,
  owner?: ModelStringInput | null,
  quota?: ModelIntInput | null,
  startDate?: ModelStringInput | null,
  territoryId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTerritoryResponsibilityInput = {
  id?: string | null,
  owner?: string | null,
  quota?: number | null,
  startDate: string,
  territoryId: string,
};

export type ModelTodoConditionInput = {
  and?: Array< ModelTodoConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  doneOn?: ModelStringInput | null,
  not?: ModelTodoConditionInput | null,
  or?: Array< ModelTodoConditionInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelTodoStatusInput | null,
  todo?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTodoInput = {
  doneOn?: string | null,
  id?: string | null,
  owner?: string | null,
  status: TodoStatus,
  todo: string,
};

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  personId?: ModelIDInput | null,
  profileId?: ModelStringInput | null,
  profilePicture?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  email?: string | null,
  name?: string | null,
  personId?: string | null,
  profileId: string,
  profilePicture?: string | null,
};

export type ModelWeeklyPlanConditionInput = {
  and?: Array< ModelWeeklyPlanConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmUpdateSkipped?: ModelBooleanInput | null,
  financialUpdateSkipped?: ModelBooleanInput | null,
  inboxSkipped?: ModelBooleanInput | null,
  not?: ModelWeeklyPlanConditionInput | null,
  or?: Array< ModelWeeklyPlanConditionInput | null > | null,
  owner?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  status?: ModelPlanningStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateWeeklyPlanInput = {
  crmUpdateSkipped?: boolean | null,
  financialUpdateSkipped?: boolean | null,
  id?: string | null,
  inboxSkipped?: boolean | null,
  owner?: string | null,
  startDate: string,
  status: PlanningStatus,
};

export type ModelWeeklyPlanProjectConditionInput = {
  and?: Array< ModelWeeklyPlanProjectConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelWeeklyPlanProjectConditionInput | null,
  or?: Array< ModelWeeklyPlanProjectConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  weekPlanId?: ModelIDInput | null,
};

export type CreateWeeklyPlanProjectInput = {
  id?: string | null,
  owner?: string | null,
  projectId: string,
  weekPlanId: string,
};

export type ModelWeeklyReviewConditionInput = {
  and?: Array< ModelWeeklyReviewConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  not?: ModelWeeklyReviewConditionInput | null,
  or?: Array< ModelWeeklyReviewConditionInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelWeeklyReviewStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateWeeklyReviewInput = {
  createdAt?: string | null,
  date: string,
  id?: string | null,
  owner?: string | null,
  status: WeeklyReviewStatus,
};

export type ModelWeeklyReviewEntryConditionInput = {
  and?: Array< ModelWeeklyReviewEntryConditionInput | null > | null,
  category?: ModelWeeklyReviewCategoryInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  generatedContent?: ModelStringInput | null,
  isEdited?: ModelBooleanInput | null,
  not?: ModelWeeklyReviewEntryConditionInput | null,
  or?: Array< ModelWeeklyReviewEntryConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelIDInput | null,
  reviewId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateWeeklyReviewEntryInput = {
  category: WeeklyReviewCategory,
  content?: string | null,
  generatedContent?: string | null,
  id?: string | null,
  isEdited?: boolean | null,
  owner?: string | null,
  projectId: string,
  reviewId: string,
};

export type DeleteAccountInput = {
  id: string,
};

export type DeleteAccountLearningInput = {
  id: string,
};

export type DeleteAccountLearningPersonInput = {
  id: string,
};

export type DeleteAccountPayerAccountInput = {
  id: string,
};

export type DeleteAccountProjectsInput = {
  id: string,
};

export type DeleteAccountTerritoryInput = {
  id: string,
};

export type DeleteActivityInput = {
  id: string,
};

export type DeleteBookOfBibleInput = {
  id: string,
};

export type DeleteConversationGeneralChatInput = {
  id: string,
};

export type DeleteConversationMessageGeneralChatInput = {
  id: string,
};

export type DeleteCrmProjectInput = {
  id: string,
};

export type DeleteCrmProjectImportInput = {
  id: string,
};

export type DeleteCrmProjectProjectsInput = {
  id: string,
};

export type DeleteCurrentContextInput = {
  id: string,
};

export type DeleteDailyPlanInput = {
  id: string,
};

export type DeleteDailyPlanProjectInput = {
  id: string,
};

export type DeleteDailyPlanTodoInput = {
  id: string,
};

export type DeleteExportTaskInput = {
  id: string,
};

export type DeleteInboxInput = {
  id: string,
};

export type DeleteMeetingInput = {
  id: string,
};

export type DeleteMeetingParticipantInput = {
  id: string,
};

export type DeleteMonthInput = {
  id: string,
};

export type DeleteMrrDataUploadInput = {
  id: string,
};

export type DeleteNoteBlockInput = {
  id: string,
};

export type DeleteNoteBlockPersonInput = {
  id: string,
};

export type DeleteNotesBibleChapterInput = {
  id: string,
};

export type DeletePayerAccountInput = {
  awsAccountNumber: string,
};

export type DeletePayerAccountMrrInput = {
  id: string,
};

export type DeletePersonInput = {
  id: string,
};

export type DeletePersonAccountInput = {
  id: string,
};

export type DeletePersonDetailInput = {
  id: string,
};

export type DeletePersonLearningInput = {
  id: string,
};

export type DeletePersonRelationshipInput = {
  id: string,
};

export type DeleteProjectActivityInput = {
  id: string,
};

export type DeleteProjectsInput = {
  id: string,
};

export type DeleteSixWeekBatchInput = {
  id: string,
};

export type DeleteSixWeekBatchProjectsInput = {
  id: string,
};

export type DeleteSixWeekCycleInput = {
  id: string,
};

export type DeleteTerritoryInput = {
  id: string,
};

export type DeleteTerritoryResponsibilityInput = {
  id: string,
};

export type DeleteTodoInput = {
  id: string,
};

export type DeleteUserInput = {
  profileId: string,
};

export type DeleteWeeklyPlanInput = {
  id: string,
};

export type DeleteWeeklyPlanProjectInput = {
  id: string,
};

export type DeleteWeeklyReviewInput = {
  id: string,
};

export type DeleteWeeklyReviewEntryInput = {
  id: string,
};

export type UpdateAccountInput = {
  accountSubsidiariesId?: string | null,
  crmId?: string | null,
  formatVersion?: number | null,
  id: string,
  introduction?: string | null,
  introductionJson?: string | null,
  mainColor?: string | null,
  name?: string | null,
  notionId?: number | null,
  order?: number | null,
  owner?: string | null,
  shortName?: string | null,
};

export type UpdateAccountLearningInput = {
  accountId?: string | null,
  id: string,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  status?: LearningStatus | null,
};

export type UpdateAccountLearningPersonInput = {
  id: string,
  learningId?: string | null,
  owner?: string | null,
  personId?: string | null,
};

export type UpdateAccountPayerAccountInput = {
  accountId?: string | null,
  awsAccountNumberId?: string | null,
  id: string,
  owner?: string | null,
};

export type UpdateAccountProjectsInput = {
  accountId?: string | null,
  id: string,
  owner?: string | null,
  projectsId?: string | null,
};

export type UpdateAccountTerritoryInput = {
  accountId?: string | null,
  id: string,
  owner?: string | null,
  territoryId?: string | null,
};

export type UpdateActivityInput = {
  finishedOn?: string | null,
  formatVersion?: number | null,
  id: string,
  meetingActivitiesId?: string | null,
  name?: string | null,
  noteBlockIds?: Array< string > | null,
  notes?: string | null,
  notesJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type UpdateBookOfBibleInput = {
  alias?: string | null,
  book?: string | null,
  id: string,
  noOfChapters?: number | null,
  notionId?: number | null,
  section?: Section | null,
};

export type UpdateConversationGeneralChatInput = {
  id: string,
  metadata?: string | null,
  name?: string | null,
};

export type UpdateCrmProjectInput = {
  accountName?: string | null,
  annualRecurringRevenue?: number | null,
  closeDate?: string | null,
  confirmHygieneIssuesSolvedTill?: string | null,
  createdDate?: string | null,
  crmId?: string | null,
  id: string,
  isMarketplace?: boolean | null,
  name?: string | null,
  nextStep?: string | null,
  opportunityOwner?: string | null,
  owner?: string | null,
  partnerName?: string | null,
  stage?: string | null,
  stageChangedDate?: string | null,
  territoryName?: string | null,
  totalContractVolume?: number | null,
  type?: string | null,
};

export type UpdateCrmProjectImportInput = {
  createdAt?: string | null,
  id: string,
  owner?: string | null,
  s3Key?: string | null,
  status?: CrmProjectImportStatus | null,
};

export type UpdateCrmProjectProjectsInput = {
  crmProjectId?: string | null,
  id: string,
  owner?: string | null,
  projectId?: string | null,
};

export type UpdateCurrentContextInput = {
  context?: Context | null,
  id: string,
  owner?: string | null,
};

export type UpdateDailyPlanInput = {
  context?: Context | null,
  day?: string | null,
  dayGoal?: string | null,
  id: string,
  owner?: string | null,
  status?: DailyPlanStatus | null,
};

export type UpdateDailyPlanProjectInput = {
  dailyPlanId?: string | null,
  id: string,
  maybe?: boolean | null,
  owner?: string | null,
  projectId?: string | null,
  updatedAt?: string | null,
};

export type UpdateDailyPlanTodoInput = {
  dailyPlanId?: string | null,
  id: string,
  owner?: string | null,
  postPoned?: boolean | null,
  todoId?: string | null,
  updatedAt?: string | null,
};

export type UpdateExportTaskInput = {
  dataSource?: ExportTaskDataSource | null,
  endDate?: string | null,
  error?: string | null,
  id: string,
  itemId?: string | null,
  itemName?: string | null,
  owner?: string | null,
  result?: string | null,
  startDate?: string | null,
  status?: ExportStatus | null,
  ttl?: number | null,
};

export type UpdateInboxInput = {
  createdAt?: string | null,
  formatVersion?: number | null,
  id: string,
  movedToAccountLearningId?: string | null,
  movedToActivityId?: string | null,
  movedToPersonLearningId?: string | null,
  note?: string | null,
  noteJson?: string | null,
  owner?: string | null,
  status?: InboxStatus | null,
};

export type UpdateMeetingInput = {
  context?: Context | null,
  id: string,
  immediateTasksDone?: boolean | null,
  meetingOn?: string | null,
  notionId?: number | null,
  owner?: string | null,
  topic?: string | null,
};

export type UpdateMeetingParticipantInput = {
  createdAt?: string | null,
  id: string,
  meetingId?: string | null,
  owner?: string | null,
  personId?: string | null,
};

export type UpdateMonthInput = {
  id: string,
  latestUploadId?: string | null,
  month?: string | null,
  owner?: string | null,
};

export type UpdateMrrDataUploadInput = {
  createdAt?: string | null,
  id: string,
  owner?: string | null,
  s3Key?: string | null,
  status?: AnalyticsImportStatus | null,
};

export type UpdateNoteBlockInput = {
  activityId?: string | null,
  content?: string | null,
  formatVersion?: number | null,
  id: string,
  owner?: string | null,
  todoId?: string | null,
  type?: string | null,
};

export type UpdateNoteBlockPersonInput = {
  createdAt?: string | null,
  id: string,
  noteBlockId?: string | null,
  owner?: string | null,
  personId?: string | null,
};

export type UpdateNotesBibleChapterInput = {
  bookId?: string | null,
  chapter?: number | null,
  formatVersion?: number | null,
  id: string,
  note?: string | null,
  noteJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type UpdatePayerAccountInput = {
  awsAccountNumber: string,
  isViaReseller?: boolean | null,
  mainContactId?: string | null,
  notes?: string | null,
  owner?: string | null,
  resellerId?: string | null,
};

export type UpdatePayerAccountMrrInput = {
  awsAccountNumber?: string | null,
  companyName?: string | null,
  id: string,
  isEstimated?: boolean | null,
  isReseller?: boolean | null,
  monthId?: string | null,
  mrr?: number | null,
  owner?: string | null,
  uploadId?: string | null,
};

export type UpdatePersonInput = {
  birthday?: string | null,
  dateOfDeath?: string | null,
  howToSay?: string | null,
  id: string,
  name?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type UpdatePersonAccountInput = {
  accountId?: string | null,
  endDate?: string | null,
  id: string,
  owner?: string | null,
  personId?: string | null,
  position?: string | null,
  startDate?: string | null,
};

export type UpdatePersonDetailInput = {
  detail?: string | null,
  id: string,
  label?: PersonDetailsEnum | null,
  owner?: string | null,
  personId?: string | null,
};

export type UpdatePersonLearningInput = {
  id: string,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  personId?: string | null,
  prayer?: PrayerStatus | null,
  status?: LearningStatus | null,
};

export type UpdatePersonRelationshipInput = {
  date?: string | null,
  endDate?: string | null,
  id: string,
  owner?: string | null,
  personId?: string | null,
  relatedPersonId?: string | null,
  typeName?: RelationshipTypeEnum | null,
};

export type UpdateProjectActivityInput = {
  activityId?: string | null,
  id: string,
  owner?: string | null,
  projectsId?: string | null,
};

export type UpdateProjectsInput = {
  context?: Context | null,
  done?: boolean | null,
  doneOn?: string | null,
  dueOn?: string | null,
  formatVersion?: number | null,
  id: string,
  myNextActions?: string | null,
  myNextActionsJson?: string | null,
  notionId?: number | null,
  onHoldTill?: string | null,
  order?: number | null,
  othersNextActions?: string | null,
  othersNextActionsJson?: string | null,
  owner?: string | null,
  partnerId?: string | null,
  pinned?: ProjectPinned | null,
  project?: string | null,
  tasksSummary?: string | null,
  tasksSummaryUpdatedAt?: string | null,
};

export type UpdateSixWeekBatchInput = {
  appetite?: SixWeekBatchAppetite | null,
  context?: Context | null,
  createdOn?: string | null,
  hours?: number | null,
  id: string,
  idea?: string | null,
  noGos?: string | null,
  notionId?: number | null,
  owner?: string | null,
  problem?: string | null,
  risks?: string | null,
  sixWeekCycleBatchesId?: string | null,
  solution?: string | null,
  status?: SixWeekBatchStatus | null,
};

export type UpdateSixWeekBatchProjectsInput = {
  id: string,
  owner?: string | null,
  projectsId?: string | null,
  sixWeekBatchId?: string | null,
};

export type UpdateSixWeekCycleInput = {
  id: string,
  name?: string | null,
  owner?: string | null,
  startDate?: string | null,
};

export type UpdateTerritoryInput = {
  crmId?: string | null,
  id: string,
  name?: string | null,
  owner?: string | null,
};

export type UpdateTerritoryResponsibilityInput = {
  id: string,
  owner?: string | null,
  quota?: number | null,
  startDate?: string | null,
  territoryId?: string | null,
};

export type UpdateTodoInput = {
  doneOn?: string | null,
  id: string,
  owner?: string | null,
  status?: TodoStatus | null,
  todo?: string | null,
};

export type UpdateUserInput = {
  email?: string | null,
  name?: string | null,
  personId?: string | null,
  profileId: string,
  profilePicture?: string | null,
};

export type UpdateWeeklyPlanInput = {
  crmUpdateSkipped?: boolean | null,
  financialUpdateSkipped?: boolean | null,
  id: string,
  inboxSkipped?: boolean | null,
  owner?: string | null,
  startDate?: string | null,
  status?: PlanningStatus | null,
};

export type UpdateWeeklyPlanProjectInput = {
  id: string,
  owner?: string | null,
  projectId?: string | null,
  weekPlanId?: string | null,
};

export type UpdateWeeklyReviewInput = {
  createdAt?: string | null,
  date?: string | null,
  id: string,
  owner?: string | null,
  status?: WeeklyReviewStatus | null,
};

export type UpdateWeeklyReviewEntryInput = {
  category?: WeeklyReviewCategory | null,
  content?: string | null,
  generatedContent?: string | null,
  id: string,
  isEdited?: boolean | null,
  owner?: string | null,
  projectId?: string | null,
  reviewId?: string | null,
};

export type ModelSubscriptionAccountFilterInput = {
  accountSubsidiariesId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionAccountFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  crmId?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  introduction?: ModelSubscriptionStringInput | null,
  introductionJson?: ModelSubscriptionStringInput | null,
  mainColor?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionAccountFilterInput | null > | null,
  order?: ModelSubscriptionIntInput | null,
  owner?: ModelStringInput | null,
  shortName?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionAccountLearningFilterInput = {
  accountId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionAccountLearningFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  learnedOn?: ModelSubscriptionStringInput | null,
  learning?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAccountLearningFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionAccountLearningPersonFilterInput = {
  and?: Array< ModelSubscriptionAccountLearningPersonFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  learningId?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionAccountLearningPersonFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionAccountPayerAccountFilterInput = {
  accountId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionAccountPayerAccountFilterInput | null > | null,
  awsAccountNumberId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionAccountPayerAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionAccountProjectsFilterInput = {
  accountId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionAccountProjectsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionAccountProjectsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionAccountTerritoryFilterInput = {
  accountId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionAccountTerritoryFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionAccountTerritoryFilterInput | null > | null,
  owner?: ModelStringInput | null,
  territoryId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionActivityFilterInput = {
  and?: Array< ModelSubscriptionActivityFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  finishedOn?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  meetingActivitiesId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  noteBlockIds?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  notesJson?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBookOfBibleFilterInput = {
  alias?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBookOfBibleFilterInput | null > | null,
  book?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  noOfChapters?: ModelSubscriptionIntInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionBookOfBibleFilterInput | null > | null,
  owner?: ModelStringInput | null,
  section?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionConversationMessageGeneralChatFilterInput = {
  aiContext?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionConversationMessageGeneralChatFilterInput | null > | null,
  associatedUserMessageId?: ModelSubscriptionIDInput | null,
  conversationId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionConversationMessageGeneralChatFilterInput | null > | null,
  owner?: ModelStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionCrmProjectFilterInput = {
  accountName?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCrmProjectFilterInput | null > | null,
  annualRecurringRevenue?: ModelSubscriptionIntInput | null,
  closeDate?: ModelSubscriptionStringInput | null,
  confirmHygieneIssuesSolvedTill?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  createdDate?: ModelSubscriptionStringInput | null,
  crmId?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isMarketplace?: ModelSubscriptionBooleanInput | null,
  name?: ModelSubscriptionStringInput | null,
  nextStep?: ModelSubscriptionStringInput | null,
  opportunityOwner?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCrmProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  partnerName?: ModelSubscriptionStringInput | null,
  stage?: ModelSubscriptionStringInput | null,
  stageChangedDate?: ModelSubscriptionStringInput | null,
  territoryName?: ModelSubscriptionStringInput | null,
  totalContractVolume?: ModelSubscriptionIntInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionCrmProjectImportFilterInput = {
  and?: Array< ModelSubscriptionCrmProjectImportFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionCrmProjectImportFilterInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionCrmProjectProjectsFilterInput = {
  and?: Array< ModelSubscriptionCrmProjectProjectsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  crmProjectId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionCrmProjectProjectsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionCurrentContextFilterInput = {
  and?: Array< ModelSubscriptionCurrentContextFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionCurrentContextFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionDailyPlanFilterInput = {
  and?: Array< ModelSubscriptionDailyPlanFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  day?: ModelSubscriptionStringInput | null,
  dayGoal?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionDailyPlanFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionDailyPlanProjectFilterInput = {
  and?: Array< ModelSubscriptionDailyPlanProjectFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dailyPlanId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  maybe?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionDailyPlanProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionDailyPlanTodoFilterInput = {
  and?: Array< ModelSubscriptionDailyPlanTodoFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dailyPlanId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionDailyPlanTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  postPoned?: ModelSubscriptionBooleanInput | null,
  todoId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionExportTaskFilterInput = {
  and?: Array< ModelSubscriptionExportTaskFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dataSource?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  error?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  itemId?: ModelSubscriptionStringInput | null,
  itemName?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionExportTaskFilterInput | null > | null,
  owner?: ModelStringInput | null,
  result?: ModelSubscriptionStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  ttl?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionInboxFilterInput = {
  and?: Array< ModelSubscriptionInboxFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  movedToAccountLearningId?: ModelSubscriptionStringInput | null,
  movedToActivityId?: ModelSubscriptionStringInput | null,
  movedToPersonLearningId?: ModelSubscriptionStringInput | null,
  note?: ModelSubscriptionStringInput | null,
  noteJson?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionInboxFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMeetingFilterInput = {
  and?: Array< ModelSubscriptionMeetingFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  immediateTasksDone?: ModelSubscriptionBooleanInput | null,
  meetingOn?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionMeetingFilterInput | null > | null,
  owner?: ModelStringInput | null,
  topic?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMeetingParticipantFilterInput = {
  and?: Array< ModelSubscriptionMeetingParticipantFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  meetingId?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionMeetingParticipantFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMonthFilterInput = {
  and?: Array< ModelSubscriptionMonthFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  latestUploadId?: ModelSubscriptionIDInput | null,
  month?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMonthFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMrrDataUploadFilterInput = {
  and?: Array< ModelSubscriptionMrrDataUploadFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionMrrDataUploadFilterInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionNoteBlockFilterInput = {
  activityId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionNoteBlockFilterInput | null > | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionNoteBlockFilterInput | null > | null,
  owner?: ModelStringInput | null,
  todoId?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionNoteBlockPersonFilterInput = {
  and?: Array< ModelSubscriptionNoteBlockPersonFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  noteBlockId?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionNoteBlockPersonFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionNotesBibleChapterFilterInput = {
  and?: Array< ModelSubscriptionNotesBibleChapterFilterInput | null > | null,
  bookId?: ModelSubscriptionIDInput | null,
  chapter?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  note?: ModelSubscriptionStringInput | null,
  noteJson?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionNotesBibleChapterFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPayerAccountFilterInput = {
  and?: Array< ModelSubscriptionPayerAccountFilterInput | null > | null,
  awsAccountNumber?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isViaReseller?: ModelSubscriptionBooleanInput | null,
  mainContactId?: ModelSubscriptionIDInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPayerAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  resellerId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPayerAccountMrrFilterInput = {
  and?: Array< ModelSubscriptionPayerAccountMrrFilterInput | null > | null,
  awsAccountNumber?: ModelSubscriptionIDInput | null,
  companyName?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isEstimated?: ModelSubscriptionBooleanInput | null,
  isReseller?: ModelSubscriptionBooleanInput | null,
  monthId?: ModelSubscriptionIDInput | null,
  mrr?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionPayerAccountMrrFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  uploadId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionPersonFilterInput = {
  and?: Array< ModelSubscriptionPersonFilterInput | null > | null,
  birthday?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dateOfDeath?: ModelSubscriptionStringInput | null,
  howToSay?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionPersonFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPersonAccountFilterInput = {
  accountId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionPersonAccountFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPersonAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  position?: ModelSubscriptionStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPersonDetailFilterInput = {
  and?: Array< ModelSubscriptionPersonDetailFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  detail?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  label?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPersonDetailFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPersonLearningFilterInput = {
  and?: Array< ModelSubscriptionPersonLearningFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  learnedOn?: ModelSubscriptionStringInput | null,
  learning?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPersonLearningFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  prayer?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPersonRelationshipFilterInput = {
  and?: Array< ModelSubscriptionPersonRelationshipFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPersonRelationshipFilterInput | null > | null,
  owner?: ModelStringInput | null,
  personId?: ModelSubscriptionIDInput | null,
  relatedPersonId?: ModelSubscriptionIDInput | null,
  typeName?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionProjectActivityFilterInput = {
  activityId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionProjectActivityFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionProjectActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionProjectsFilterInput = {
  and?: Array< ModelSubscriptionProjectsFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  done?: ModelSubscriptionBooleanInput | null,
  doneOn?: ModelSubscriptionStringInput | null,
  dueOn?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  myNextActions?: ModelSubscriptionStringInput | null,
  myNextActionsJson?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  onHoldTill?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionProjectsFilterInput | null > | null,
  order?: ModelSubscriptionFloatInput | null,
  othersNextActions?: ModelSubscriptionStringInput | null,
  othersNextActionsJson?: ModelSubscriptionStringInput | null,
  owner?: ModelStringInput | null,
  partnerId?: ModelSubscriptionIDInput | null,
  pinned?: ModelSubscriptionStringInput | null,
  project?: ModelSubscriptionStringInput | null,
  tasksSummary?: ModelSubscriptionStringInput | null,
  tasksSummaryUpdatedAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionSixWeekBatchFilterInput = {
  and?: Array< ModelSubscriptionSixWeekBatchFilterInput | null > | null,
  appetite?: ModelSubscriptionStringInput | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  createdOn?: ModelSubscriptionStringInput | null,
  hours?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  idea?: ModelSubscriptionStringInput | null,
  noGos?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionSixWeekBatchFilterInput | null > | null,
  owner?: ModelStringInput | null,
  problem?: ModelSubscriptionStringInput | null,
  risks?: ModelSubscriptionStringInput | null,
  sixWeekCycleBatchesId?: ModelSubscriptionIDInput | null,
  solution?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionSixWeekBatchProjectsFilterInput = {
  and?: Array< ModelSubscriptionSixWeekBatchProjectsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionSixWeekBatchProjectsFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsId?: ModelSubscriptionIDInput | null,
  sixWeekBatchId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionSixWeekCycleFilterInput = {
  and?: Array< ModelSubscriptionSixWeekCycleFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionSixWeekCycleFilterInput | null > | null,
  owner?: ModelStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTerritoryFilterInput = {
  and?: Array< ModelSubscriptionTerritoryFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  crmId?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionTerritoryFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTerritoryResponsibilityFilterInput = {
  and?: Array< ModelSubscriptionTerritoryResponsibilityFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTerritoryResponsibilityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  quota?: ModelSubscriptionIntInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  territoryId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTodoFilterInput = {
  and?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  doneOn?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  todo?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  personId?: ModelSubscriptionIDInput | null,
  profileId?: ModelStringInput | null,
  profilePicture?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionWeeklyPlanFilterInput = {
  and?: Array< ModelSubscriptionWeeklyPlanFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  crmUpdateSkipped?: ModelSubscriptionBooleanInput | null,
  financialUpdateSkipped?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  inboxSkipped?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionWeeklyPlanFilterInput | null > | null,
  owner?: ModelStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionWeeklyPlanProjectFilterInput = {
  and?: Array< ModelSubscriptionWeeklyPlanProjectFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionWeeklyPlanProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  weekPlanId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionWeeklyReviewFilterInput = {
  and?: Array< ModelSubscriptionWeeklyReviewFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionWeeklyReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionWeeklyReviewEntryFilterInput = {
  and?: Array< ModelSubscriptionWeeklyReviewEntryFilterInput | null > | null,
  category?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  generatedContent?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isEdited?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionWeeklyReviewEntryFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectId?: ModelSubscriptionIDInput | null,
  reviewId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ByStatusQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelInboxFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: InboxStatus,
};

export type ByStatusQuery = {
  byStatus?:  {
    __typename: "ModelInboxConnection",
    items:  Array< {
      __typename: "Inbox",
      createdAt: string,
      formatVersion?: number | null,
      id: string,
      movedToAccountLearningId?: string | null,
      movedToActivityId?: string | null,
      movedToPersonLearningId?: string | null,
      note?: string | null,
      noteJson?: string | null,
      owner?: string | null,
      status: InboxStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CategorizeProjectQueryVariables = {
  notes?: string | null,
  projectName?: string | null,
};

export type CategorizeProjectQuery = {
  categorizeProject?: Array< string | null > | null,
};

export type ChatNamerQueryVariables = {
  content?: string | null,
};

export type ChatNamerQuery = {
  chatNamer?:  {
    __typename: "ChatNamerReturnType",
    name?: string | null,
  } | null,
};

export type GenerateTasksSummaryQueryVariables = {
  tasks?: string | null,
};

export type GenerateTasksSummaryQuery = {
  generateTasksSummary?:  {
    __typename: "GenerateTasksSummaryReturnType",
    summary?: string | null,
  } | null,
};

export type GenerateWeeklyNarrativeQueryVariables = {
  accountNames?: Array< string | null > | null,
  category?: string | null,
  notes?: string | null,
  projectName?: string | null,
};

export type GenerateWeeklyNarrativeQuery = {
  generateWeeklyNarrative?: string | null,
};

export type GetAccountQueryVariables = {
  id: string,
};

export type GetAccountQuery = {
  getAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetAccountLearningQueryVariables = {
  id: string,
};

export type GetAccountLearningQuery = {
  getAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type GetAccountLearningPersonQueryVariables = {
  id: string,
};

export type GetAccountLearningPersonQuery = {
  getAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type GetAccountPayerAccountQueryVariables = {
  id: string,
};

export type GetAccountPayerAccountQuery = {
  getAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetAccountProjectsQueryVariables = {
  id: string,
};

export type GetAccountProjectsQuery = {
  getAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type GetAccountTerritoryQueryVariables = {
  id: string,
};

export type GetAccountTerritoryQuery = {
  getAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type GetActivityQueryVariables = {
  id: string,
};

export type GetActivityQuery = {
  getActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetBookOfBibleQueryVariables = {
  id: string,
};

export type GetBookOfBibleQuery = {
  getBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type GetConversationGeneralChatQueryVariables = {
  id: string,
};

export type GetConversationGeneralChatQuery = {
  getConversationGeneralChat?:  {
    __typename: "ConversationGeneralChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageGeneralChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetConversationMessageGeneralChatQueryVariables = {
  id: string,
};

export type GetConversationMessageGeneralChatQuery = {
  getConversationMessageGeneralChat?:  {
    __typename: "ConversationMessageGeneralChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationGeneralChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type GetCrmProjectQueryVariables = {
  id: string,
};

export type GetCrmProjectQuery = {
  getCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type GetCrmProjectImportQueryVariables = {
  id: string,
};

export type GetCrmProjectImportQuery = {
  getCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type GetCrmProjectProjectsQueryVariables = {
  id: string,
};

export type GetCrmProjectProjectsQuery = {
  getCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type GetCurrentContextQueryVariables = {
  id: string,
};

export type GetCurrentContextQuery = {
  getCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetDailyPlanQueryVariables = {
  id: string,
};

export type GetDailyPlanQuery = {
  getDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetDailyPlanProjectQueryVariables = {
  id: string,
};

export type GetDailyPlanProjectQuery = {
  getDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type GetDailyPlanTodoQueryVariables = {
  id: string,
};

export type GetDailyPlanTodoQuery = {
  getDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type GetExportTaskQueryVariables = {
  id: string,
};

export type GetExportTaskQuery = {
  getExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type GetInboxQueryVariables = {
  id: string,
};

export type GetInboxQuery = {
  getInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type GetMeetingQueryVariables = {
  id: string,
};

export type GetMeetingQuery = {
  getMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type GetMeetingParticipantQueryVariables = {
  id: string,
};

export type GetMeetingParticipantQuery = {
  getMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type GetMonthQueryVariables = {
  id: string,
};

export type GetMonthQuery = {
  getMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetMrrDataUploadQueryVariables = {
  id: string,
};

export type GetMrrDataUploadQuery = {
  getMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type GetNoteBlockQueryVariables = {
  id: string,
};

export type GetNoteBlockQuery = {
  getNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type GetNoteBlockPersonQueryVariables = {
  id: string,
};

export type GetNoteBlockPersonQuery = {
  getNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type GetNotesBibleChapterQueryVariables = {
  id: string,
};

export type GetNotesBibleChapterQuery = {
  getNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetPayerAccountQueryVariables = {
  awsAccountNumber: string,
};

export type GetPayerAccountQuery = {
  getPayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type GetPayerAccountMrrQueryVariables = {
  id: string,
};

export type GetPayerAccountMrrQuery = {
  getPayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type GetPersonQueryVariables = {
  id: string,
};

export type GetPersonQuery = {
  getPerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetPersonAccountQueryVariables = {
  id: string,
};

export type GetPersonAccountQuery = {
  getPersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type GetPersonDetailQueryVariables = {
  id: string,
};

export type GetPersonDetailQuery = {
  getPersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type GetPersonLearningQueryVariables = {
  id: string,
};

export type GetPersonLearningQuery = {
  getPersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type GetPersonRelationshipQueryVariables = {
  id: string,
};

export type GetPersonRelationshipQuery = {
  getPersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type GetProjectActivityQueryVariables = {
  id: string,
};

export type GetProjectActivityQuery = {
  getProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type GetProjectsQueryVariables = {
  id: string,
};

export type GetProjectsQuery = {
  getProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetSixWeekBatchQueryVariables = {
  id: string,
};

export type GetSixWeekBatchQuery = {
  getSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type GetSixWeekBatchProjectsQueryVariables = {
  id: string,
};

export type GetSixWeekBatchProjectsQuery = {
  getSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type GetSixWeekCycleQueryVariables = {
  id: string,
};

export type GetSixWeekCycleQuery = {
  getSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type GetTerritoryQueryVariables = {
  id: string,
};

export type GetTerritoryQuery = {
  getTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetTerritoryResponsibilityQueryVariables = {
  id: string,
};

export type GetTerritoryResponsibilityQuery = {
  getTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type GetTodoQueryVariables = {
  id: string,
};

export type GetTodoQuery = {
  getTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  profileId: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type GetWeeklyPlanQueryVariables = {
  id: string,
};

export type GetWeeklyPlanQuery = {
  getWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type GetWeeklyPlanProjectQueryVariables = {
  id: string,
};

export type GetWeeklyPlanProjectQuery = {
  getWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type GetWeeklyReviewQueryVariables = {
  id: string,
};

export type GetWeeklyReviewQuery = {
  getWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type GetWeeklyReviewEntryQueryVariables = {
  id: string,
};

export type GetWeeklyReviewEntryQuery = {
  getWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};

export type ListAccountLearningByAccountIdQueryVariables = {
  accountId: string,
  filter?: ModelAccountLearningFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAccountLearningByAccountIdQuery = {
  listAccountLearningByAccountId?:  {
    __typename: "ModelAccountLearningConnection",
    items:  Array< {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountLearningPeopleQueryVariables = {
  filter?: ModelAccountLearningPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountLearningPeopleQuery = {
  listAccountLearningPeople?:  {
    __typename: "ModelAccountLearningPersonConnection",
    items:  Array< {
      __typename: "AccountLearningPerson",
      createdAt: string,
      id: string,
      learningId: string,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountLearningPersonByLearningIdQueryVariables = {
  filter?: ModelAccountLearningPersonFilterInput | null,
  learningId: string,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAccountLearningPersonByLearningIdQuery = {
  listAccountLearningPersonByLearningId?:  {
    __typename: "ModelAccountLearningPersonConnection",
    items:  Array< {
      __typename: "AccountLearningPerson",
      createdAt: string,
      id: string,
      learningId: string,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountLearningsQueryVariables = {
  filter?: ModelAccountLearningFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountLearningsQuery = {
  listAccountLearnings?:  {
    __typename: "ModelAccountLearningConnection",
    items:  Array< {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountPayerAccountByAwsAccountNumberIdQueryVariables = {
  awsAccountNumberId: string,
  filter?: ModelAccountPayerAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAccountPayerAccountByAwsAccountNumberIdQuery = {
  listAccountPayerAccountByAwsAccountNumberId?:  {
    __typename: "ModelAccountPayerAccountConnection",
    items:  Array< {
      __typename: "AccountPayerAccount",
      accountId: string,
      awsAccountNumberId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountPayerAccountsQueryVariables = {
  filter?: ModelAccountPayerAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountPayerAccountsQuery = {
  listAccountPayerAccounts?:  {
    __typename: "ModelAccountPayerAccountConnection",
    items:  Array< {
      __typename: "AccountPayerAccount",
      accountId: string,
      awsAccountNumberId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountProjectsQueryVariables = {
  filter?: ModelAccountProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountProjectsQuery = {
  listAccountProjects?:  {
    __typename: "ModelAccountProjectsConnection",
    items:  Array< {
      __typename: "AccountProjects",
      accountId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      projectsId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountProjectsByAccountIdQueryVariables = {
  accountId: string,
  filter?: ModelAccountProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAccountProjectsByAccountIdQuery = {
  listAccountProjectsByAccountId?:  {
    __typename: "ModelAccountProjectsConnection",
    items:  Array< {
      __typename: "AccountProjects",
      accountId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      projectsId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountProjectsByProjectsIdQueryVariables = {
  filter?: ModelAccountProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  projectsId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListAccountProjectsByProjectsIdQuery = {
  listAccountProjectsByProjectsId?:  {
    __typename: "ModelAccountProjectsConnection",
    items:  Array< {
      __typename: "AccountProjects",
      accountId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      projectsId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountTerritoriesQueryVariables = {
  filter?: ModelAccountTerritoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountTerritoriesQuery = {
  listAccountTerritories?:  {
    __typename: "ModelAccountTerritoryConnection",
    items:  Array< {
      __typename: "AccountTerritory",
      accountId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      territoryId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAccountsQueryVariables = {
  filter?: ModelAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAccountsQuery = {
  listAccounts?:  {
    __typename: "ModelAccountConnection",
    items:  Array< {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListActivitiesQueryVariables = {
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActivitiesQuery = {
  listActivities?:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListBookOfBiblesQueryVariables = {
  filter?: ModelBookOfBibleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBookOfBiblesQuery = {
  listBookOfBibles?:  {
    __typename: "ModelBookOfBibleConnection",
    items:  Array< {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByImportStatusQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelCrmProjectImportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: CrmProjectImportStatus,
};

export type ListByImportStatusQuery = {
  listByImportStatus?:  {
    __typename: "ModelCrmProjectImportConnection",
    items:  Array< {
      __typename: "CrmProjectImport",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: CrmProjectImportStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByPartnerIdQueryVariables = {
  filter?: ModelProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  partnerId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListByPartnerIdQuery = {
  listByPartnerId?:  {
    __typename: "ModelProjectsConnection",
    items:  Array< {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByPersonIdQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelNoteBlockPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  personId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListByPersonIdQuery = {
  listByPersonId?:  {
    __typename: "ModelNoteBlockPersonConnection",
    items:  Array< {
      __typename: "NoteBlockPerson",
      createdAt: string,
      id: string,
      noteBlockId: string,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByPinnedStateQueryVariables = {
  filter?: ModelProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  pinned: ProjectPinned,
  sortDirection?: ModelSortDirection | null,
};

export type ListByPinnedStateQuery = {
  listByPinnedState?:  {
    __typename: "ModelProjectsConnection",
    items:  Array< {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByProjectIdQueryVariables = {
  filter?: ModelDailyPlanProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  projectId: string,
  sortDirection?: ModelSortDirection | null,
  updatedAt?: ModelStringKeyConditionInput | null,
};

export type ListByProjectIdQuery = {
  listByProjectId?:  {
    __typename: "ModelDailyPlanProjectConnection",
    items:  Array< {
      __typename: "DailyPlanProject",
      createdAt: string,
      dailyPlanId: string,
      id: string,
      maybe?: boolean | null,
      owner?: string | null,
      projectId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByStatusQueryVariables = {
  day?: ModelStringKeyConditionInput | null,
  filter?: ModelDailyPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: DailyPlanStatus,
};

export type ListByStatusQuery = {
  listByStatus?:  {
    __typename: "ModelDailyPlanConnection",
    items:  Array< {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByTodoIdQueryVariables = {
  filter?: ModelDailyPlanTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  todoId: string,
  updatedAt?: ModelStringKeyConditionInput | null,
};

export type ListByTodoIdQuery = {
  listByTodoId?:  {
    __typename: "ModelDailyPlanTodoConnection",
    items:  Array< {
      __typename: "DailyPlanTodo",
      createdAt: string,
      dailyPlanId: string,
      id: string,
      owner?: string | null,
      postPoned?: boolean | null,
      todoId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByWbrStatusQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelWeeklyReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: WeeklyReviewStatus,
};

export type ListByWbrStatusQuery = {
  listByWbrStatus?:  {
    __typename: "ModelWeeklyReviewConnection",
    items:  Array< {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListConversationGeneralChatsQueryVariables = {
  filter?: ModelConversationGeneralChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConversationGeneralChatsQuery = {
  listConversationGeneralChats?:  {
    __typename: "ModelConversationGeneralChatConnection",
    items:  Array< {
      __typename: "ConversationGeneralChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListConversationMessageGeneralChatsQueryVariables = {
  filter?: ModelConversationMessageGeneralChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConversationMessageGeneralChatsQuery = {
  listConversationMessageGeneralChats?:  {
    __typename: "ModelConversationMessageGeneralChatConnection",
    items:  Array< {
      __typename: "ConversationMessageGeneralChat",
      aiContext?: string | null,
      associatedUserMessageId?: string | null,
      conversationId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      role?: AmplifyAIConversationParticipantRole | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCrmProjectImportsQueryVariables = {
  filter?: ModelCrmProjectImportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCrmProjectImportsQuery = {
  listCrmProjectImports?:  {
    __typename: "ModelCrmProjectImportConnection",
    items:  Array< {
      __typename: "CrmProjectImport",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: CrmProjectImportStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCrmProjectProjectsQueryVariables = {
  filter?: ModelCrmProjectProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCrmProjectProjectsQuery = {
  listCrmProjectProjects?:  {
    __typename: "ModelCrmProjectProjectsConnection",
    items:  Array< {
      __typename: "CrmProjectProjects",
      createdAt: string,
      crmProjectId: string,
      id: string,
      owner?: string | null,
      projectId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCrmProjectsQueryVariables = {
  filter?: ModelCrmProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCrmProjectsQuery = {
  listCrmProjects?:  {
    __typename: "ModelCrmProjectConnection",
    items:  Array< {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCurrentContextsQueryVariables = {
  filter?: ModelCurrentContextFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCurrentContextsQuery = {
  listCurrentContexts?:  {
    __typename: "ModelCurrentContextConnection",
    items:  Array< {
      __typename: "CurrentContext",
      context: Context,
      createdAt: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDailyPlanProjectsQueryVariables = {
  filter?: ModelDailyPlanProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDailyPlanProjectsQuery = {
  listDailyPlanProjects?:  {
    __typename: "ModelDailyPlanProjectConnection",
    items:  Array< {
      __typename: "DailyPlanProject",
      createdAt: string,
      dailyPlanId: string,
      id: string,
      maybe?: boolean | null,
      owner?: string | null,
      projectId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDailyPlanTodosQueryVariables = {
  filter?: ModelDailyPlanTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDailyPlanTodosQuery = {
  listDailyPlanTodos?:  {
    __typename: "ModelDailyPlanTodoConnection",
    items:  Array< {
      __typename: "DailyPlanTodo",
      createdAt: string,
      dailyPlanId: string,
      id: string,
      owner?: string | null,
      postPoned?: boolean | null,
      todoId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDailyPlansQueryVariables = {
  filter?: ModelDailyPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDailyPlansQuery = {
  listDailyPlans?:  {
    __typename: "ModelDailyPlanConnection",
    items:  Array< {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListExportTaskByStatusAndEndDateQueryVariables = {
  endDate?: ModelStringKeyConditionInput | null,
  filter?: ModelExportTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: ExportStatus,
};

export type ListExportTaskByStatusAndEndDateQuery = {
  listExportTaskByStatusAndEndDate?:  {
    __typename: "ModelExportTaskConnection",
    items:  Array< {
      __typename: "ExportTask",
      createdAt: string,
      dataSource: ExportTaskDataSource,
      endDate: string,
      error?: string | null,
      id: string,
      itemId: string,
      itemName?: string | null,
      owner?: string | null,
      result?: string | null,
      startDate: string,
      status: ExportStatus,
      ttl?: number | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListExportTasksQueryVariables = {
  filter?: ModelExportTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListExportTasksQuery = {
  listExportTasks?:  {
    __typename: "ModelExportTaskConnection",
    items:  Array< {
      __typename: "ExportTask",
      createdAt: string,
      dataSource: ExportTaskDataSource,
      endDate: string,
      error?: string | null,
      id: string,
      itemId: string,
      itemName?: string | null,
      owner?: string | null,
      result?: string | null,
      startDate: string,
      status: ExportStatus,
      ttl?: number | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListInboxesQueryVariables = {
  filter?: ModelInboxFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInboxesQuery = {
  listInboxes?:  {
    __typename: "ModelInboxConnection",
    items:  Array< {
      __typename: "Inbox",
      createdAt: string,
      formatVersion?: number | null,
      id: string,
      movedToAccountLearningId?: string | null,
      movedToActivityId?: string | null,
      movedToPersonLearningId?: string | null,
      note?: string | null,
      noteJson?: string | null,
      owner?: string | null,
      status: InboxStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMeetingParticipantByPersonIdAndCreatedAtQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelMeetingParticipantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  personId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListMeetingParticipantByPersonIdAndCreatedAtQuery = {
  listMeetingParticipantByPersonIdAndCreatedAt?:  {
    __typename: "ModelMeetingParticipantConnection",
    items:  Array< {
      __typename: "MeetingParticipant",
      createdAt: string,
      id: string,
      meetingId: string,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMeetingParticipantsQueryVariables = {
  filter?: ModelMeetingParticipantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMeetingParticipantsQuery = {
  listMeetingParticipants?:  {
    __typename: "ModelMeetingParticipantConnection",
    items:  Array< {
      __typename: "MeetingParticipant",
      createdAt: string,
      id: string,
      meetingId: string,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMeetingsQueryVariables = {
  filter?: ModelMeetingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMeetingsQuery = {
  listMeetings?:  {
    __typename: "ModelMeetingConnection",
    items:  Array< {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMonthByLatestUploadIdAndMonthQueryVariables = {
  filter?: ModelMonthFilterInput | null,
  latestUploadId: string,
  limit?: number | null,
  month?: ModelStringKeyConditionInput | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListMonthByLatestUploadIdAndMonthQuery = {
  listMonthByLatestUploadIdAndMonth?:  {
    __typename: "ModelMonthConnection",
    items:  Array< {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMonthsQueryVariables = {
  filter?: ModelMonthFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMonthsQuery = {
  listMonths?:  {
    __typename: "ModelMonthConnection",
    items:  Array< {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMrrDataUploadByStatusAndCreatedAtQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelMrrDataUploadFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: AnalyticsImportStatus,
};

export type ListMrrDataUploadByStatusAndCreatedAtQuery = {
  listMrrDataUploadByStatusAndCreatedAt?:  {
    __typename: "ModelMrrDataUploadConnection",
    items:  Array< {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMrrDataUploadsQueryVariables = {
  filter?: ModelMrrDataUploadFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMrrDataUploadsQuery = {
  listMrrDataUploads?:  {
    __typename: "ModelMrrDataUploadConnection",
    items:  Array< {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNoteBlockByTypeQueryVariables = {
  filter?: ModelNoteBlockFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  type: string,
};

export type ListNoteBlockByTypeQuery = {
  listNoteBlockByType?:  {
    __typename: "ModelNoteBlockConnection",
    items:  Array< {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNoteBlockPeopleQueryVariables = {
  filter?: ModelNoteBlockPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNoteBlockPeopleQuery = {
  listNoteBlockPeople?:  {
    __typename: "ModelNoteBlockPersonConnection",
    items:  Array< {
      __typename: "NoteBlockPerson",
      createdAt: string,
      id: string,
      noteBlockId: string,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNoteBlocksQueryVariables = {
  filter?: ModelNoteBlockFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNoteBlocksQuery = {
  listNoteBlocks?:  {
    __typename: "ModelNoteBlockConnection",
    items:  Array< {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNotesBibleChaptersQueryVariables = {
  filter?: ModelNotesBibleChapterFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNotesBibleChaptersQuery = {
  listNotesBibleChapters?:  {
    __typename: "ModelNotesBibleChapterConnection",
    items:  Array< {
      __typename: "NotesBibleChapter",
      bookId: string,
      chapter: number,
      createdAt: string,
      formatVersion?: number | null,
      id: string,
      note?: string | null,
      noteJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPayerAccountMrrByUploadIdQueryVariables = {
  filter?: ModelPayerAccountMrrFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  uploadId: string,
};

export type ListPayerAccountMrrByUploadIdQuery = {
  listPayerAccountMrrByUploadId?:  {
    __typename: "ModelPayerAccountMrrConnection",
    items:  Array< {
      __typename: "PayerAccountMrr",
      awsAccountNumber: string,
      companyName: string,
      createdAt: string,
      id: string,
      isEstimated: boolean,
      isReseller: boolean,
      monthId: string,
      mrr?: number | null,
      owner?: string | null,
      updatedAt: string,
      uploadId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPayerAccountMrrsQueryVariables = {
  filter?: ModelPayerAccountMrrFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPayerAccountMrrsQuery = {
  listPayerAccountMrrs?:  {
    __typename: "ModelPayerAccountMrrConnection",
    items:  Array< {
      __typename: "PayerAccountMrr",
      awsAccountNumber: string,
      companyName: string,
      createdAt: string,
      id: string,
      isEstimated: boolean,
      isReseller: boolean,
      monthId: string,
      mrr?: number | null,
      owner?: string | null,
      updatedAt: string,
      uploadId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPayerAccountsQueryVariables = {
  awsAccountNumber?: string | null,
  filter?: ModelPayerAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPayerAccountsQuery = {
  listPayerAccounts?:  {
    __typename: "ModelPayerAccountConnection",
    items:  Array< {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPeopleQueryVariables = {
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPeopleQuery = {
  listPeople?:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPersonAccountByAccountIdQueryVariables = {
  accountId: string,
  filter?: ModelPersonAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPersonAccountByAccountIdQuery = {
  listPersonAccountByAccountId?:  {
    __typename: "ModelPersonAccountConnection",
    items:  Array< {
      __typename: "PersonAccount",
      accountId: string,
      createdAt: string,
      endDate?: string | null,
      id: string,
      owner?: string | null,
      personId: string,
      position?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPersonAccountsQueryVariables = {
  filter?: ModelPersonAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPersonAccountsQuery = {
  listPersonAccounts?:  {
    __typename: "ModelPersonAccountConnection",
    items:  Array< {
      __typename: "PersonAccount",
      accountId: string,
      createdAt: string,
      endDate?: string | null,
      id: string,
      owner?: string | null,
      personId: string,
      position?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPersonDetailsQueryVariables = {
  filter?: ModelPersonDetailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPersonDetailsQuery = {
  listPersonDetails?:  {
    __typename: "ModelPersonDetailConnection",
    items:  Array< {
      __typename: "PersonDetail",
      createdAt: string,
      detail: string,
      id: string,
      label: PersonDetailsEnum,
      owner?: string | null,
      personId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPersonLearningByPersonIdQueryVariables = {
  filter?: ModelPersonLearningFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  personId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListPersonLearningByPersonIdQuery = {
  listPersonLearningByPersonId?:  {
    __typename: "ModelPersonLearningConnection",
    items:  Array< {
      __typename: "PersonLearning",
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      personId: string,
      prayer?: PrayerStatus | null,
      status: LearningStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPersonLearningsQueryVariables = {
  filter?: ModelPersonLearningFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPersonLearningsQuery = {
  listPersonLearnings?:  {
    __typename: "ModelPersonLearningConnection",
    items:  Array< {
      __typename: "PersonLearning",
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      personId: string,
      prayer?: PrayerStatus | null,
      status: LearningStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPersonRelationshipsQueryVariables = {
  filter?: ModelPersonRelationshipFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPersonRelationshipsQuery = {
  listPersonRelationships?:  {
    __typename: "ModelPersonRelationshipConnection",
    items:  Array< {
      __typename: "PersonRelationship",
      createdAt: string,
      date?: string | null,
      endDate?: string | null,
      id: string,
      owner?: string | null,
      personId?: string | null,
      relatedPersonId?: string | null,
      typeName?: RelationshipTypeEnum | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProjectActivitiesQueryVariables = {
  filter?: ModelProjectActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectActivitiesQuery = {
  listProjectActivities?:  {
    __typename: "ModelProjectActivityConnection",
    items:  Array< {
      __typename: "ProjectActivity",
      activityId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      projectsId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProjectActivityByProjectsIdQueryVariables = {
  filter?: ModelProjectActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  projectsId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListProjectActivityByProjectsIdQuery = {
  listProjectActivityByProjectsId?:  {
    __typename: "ModelProjectActivityConnection",
    items:  Array< {
      __typename: "ProjectActivity",
      activityId: string,
      createdAt: string,
      id: string,
      owner?: string | null,
      projectsId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProjectsQueryVariables = {
  filter?: ModelProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectsQuery = {
  listProjects?:  {
    __typename: "ModelProjectsConnection",
    items:  Array< {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSixWeekBatchProjectsQueryVariables = {
  filter?: ModelSixWeekBatchProjectsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSixWeekBatchProjectsQuery = {
  listSixWeekBatchProjects?:  {
    __typename: "ModelSixWeekBatchProjectsConnection",
    items:  Array< {
      __typename: "SixWeekBatchProjects",
      createdAt: string,
      id: string,
      owner?: string | null,
      projectsId: string,
      sixWeekBatchId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSixWeekBatchesQueryVariables = {
  filter?: ModelSixWeekBatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSixWeekBatchesQuery = {
  listSixWeekBatches?:  {
    __typename: "ModelSixWeekBatchConnection",
    items:  Array< {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSixWeekCyclesQueryVariables = {
  filter?: ModelSixWeekCycleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSixWeekCyclesQuery = {
  listSixWeekCycles?:  {
    __typename: "ModelSixWeekCycleConnection",
    items:  Array< {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTerritoriesQueryVariables = {
  filter?: ModelTerritoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTerritoriesQuery = {
  listTerritories?:  {
    __typename: "ModelTerritoryConnection",
    items:  Array< {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTerritoryResponsibilitiesQueryVariables = {
  filter?: ModelTerritoryResponsibilityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTerritoryResponsibilitiesQuery = {
  listTerritoryResponsibilities?:  {
    __typename: "ModelTerritoryResponsibilityConnection",
    items:  Array< {
      __typename: "TerritoryResponsibility",
      createdAt: string,
      id: string,
      owner?: string | null,
      quota?: number | null,
      startDate: string,
      territoryId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTodoByStatusQueryVariables = {
  filter?: ModelTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: TodoStatus,
};

export type ListTodoByStatusQuery = {
  listTodoByStatus?:  {
    __typename: "ModelTodoConnection",
    items:  Array< {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTodosQueryVariables = {
  filter?: ModelTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodosQuery = {
  listTodos?:  {
    __typename: "ModelTodoConnection",
    items:  Array< {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  profileId?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListWbrByWeekQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  date: string,
  filter?: ModelWeeklyReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListWbrByWeekQuery = {
  listWbrByWeek?:  {
    __typename: "ModelWeeklyReviewConnection",
    items:  Array< {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListWeeklyPlanByStatusQueryVariables = {
  filter?: ModelWeeklyPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: PlanningStatus,
};

export type ListWeeklyPlanByStatusQuery = {
  listWeeklyPlanByStatus?:  {
    __typename: "ModelWeeklyPlanConnection",
    items:  Array< {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListWeeklyPlanProjectsQueryVariables = {
  filter?: ModelWeeklyPlanProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWeeklyPlanProjectsQuery = {
  listWeeklyPlanProjects?:  {
    __typename: "ModelWeeklyPlanProjectConnection",
    items:  Array< {
      __typename: "WeeklyPlanProject",
      createdAt: string,
      id: string,
      owner?: string | null,
      projectId: string,
      updatedAt: string,
      weekPlanId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListWeeklyPlansQueryVariables = {
  filter?: ModelWeeklyPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWeeklyPlansQuery = {
  listWeeklyPlans?:  {
    __typename: "ModelWeeklyPlanConnection",
    items:  Array< {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListWeeklyReviewEntriesQueryVariables = {
  filter?: ModelWeeklyReviewEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWeeklyReviewEntriesQuery = {
  listWeeklyReviewEntries?:  {
    __typename: "ModelWeeklyReviewEntryConnection",
    items:  Array< {
      __typename: "WeeklyReviewEntry",
      category: WeeklyReviewCategory,
      content?: string | null,
      createdAt: string,
      generatedContent?: string | null,
      id: string,
      isEdited?: boolean | null,
      owner?: string | null,
      projectId: string,
      reviewId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListWeeklyReviewsQueryVariables = {
  filter?: ModelWeeklyReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWeeklyReviewsQuery = {
  listWeeklyReviews?:  {
    __typename: "ModelWeeklyReviewConnection",
    items:  Array< {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RewriteProjectNotesQueryVariables = {
  content?: string | null,
};

export type RewriteProjectNotesQuery = {
  rewriteProjectNotes?:  {
    __typename: "RewriteProjectNotesReturnType",
    response?: string | null,
  } | null,
};

export type UpdateNarrativeQueryVariables = {
  category?: string | null,
  existingNarrative?: string | null,
  userFeedback?: string | null,
};

export type UpdateNarrativeQuery = {
  updateNarrative?: string | null,
};

export type CreateAccountMutationVariables = {
  condition?: ModelAccountConditionInput | null,
  input: CreateAccountInput,
};

export type CreateAccountMutation = {
  createAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateAccountLearningMutationVariables = {
  condition?: ModelAccountLearningConditionInput | null,
  input: CreateAccountLearningInput,
};

export type CreateAccountLearningMutation = {
  createAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type CreateAccountLearningPersonMutationVariables = {
  condition?: ModelAccountLearningPersonConditionInput | null,
  input: CreateAccountLearningPersonInput,
};

export type CreateAccountLearningPersonMutation = {
  createAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type CreateAccountPayerAccountMutationVariables = {
  condition?: ModelAccountPayerAccountConditionInput | null,
  input: CreateAccountPayerAccountInput,
};

export type CreateAccountPayerAccountMutation = {
  createAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateAccountProjectsMutationVariables = {
  condition?: ModelAccountProjectsConditionInput | null,
  input: CreateAccountProjectsInput,
};

export type CreateAccountProjectsMutation = {
  createAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type CreateAccountTerritoryMutationVariables = {
  condition?: ModelAccountTerritoryConditionInput | null,
  input: CreateAccountTerritoryInput,
};

export type CreateAccountTerritoryMutation = {
  createAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type CreateActivityMutationVariables = {
  condition?: ModelActivityConditionInput | null,
  input: CreateActivityInput,
};

export type CreateActivityMutation = {
  createActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateAssistantResponseGeneralChatMutationVariables = {
  input: CreateConversationMessageGeneralChatAssistantInput,
};

export type CreateAssistantResponseGeneralChatMutation = {
  createAssistantResponseGeneralChat?:  {
    __typename: "ConversationMessageGeneralChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationGeneralChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateAssistantResponseStreamGeneralChatMutationVariables = {
  input: CreateConversationMessageGeneralChatAssistantStreamingInput,
};

export type CreateAssistantResponseStreamGeneralChatMutation = {
  createAssistantResponseStreamGeneralChat?:  {
    __typename: "AmplifyAIConversationMessageStreamPart",
    associatedUserMessageId: string,
    contentBlockDeltaIndex?: number | null,
    contentBlockDoneAtIndex?: number | null,
    contentBlockIndex?: number | null,
    contentBlockText?: string | null,
    contentBlockToolUse?:  {
      __typename: "AmplifyAIToolUseBlock",
      input: string,
      name: string,
      toolUseId: string,
    } | null,
    conversationId: string,
    errors?:  Array< {
      __typename: "AmplifyAIConversationTurnError",
      errorType: string,
      message: string,
    } | null > | null,
    id: string,
    owner?: string | null,
    p?: string | null,
    stopReason?: string | null,
  } | null,
};

export type CreateBookOfBibleMutationVariables = {
  condition?: ModelBookOfBibleConditionInput | null,
  input: CreateBookOfBibleInput,
};

export type CreateBookOfBibleMutation = {
  createBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type CreateConversationGeneralChatMutationVariables = {
  condition?: ModelConversationGeneralChatConditionInput | null,
  input: CreateConversationGeneralChatInput,
};

export type CreateConversationGeneralChatMutation = {
  createConversationGeneralChat?:  {
    __typename: "ConversationGeneralChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageGeneralChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateConversationMessageGeneralChatMutationVariables = {
  condition?: ModelConversationMessageGeneralChatConditionInput | null,
  input: CreateConversationMessageGeneralChatInput,
};

export type CreateConversationMessageGeneralChatMutation = {
  createConversationMessageGeneralChat?:  {
    __typename: "ConversationMessageGeneralChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationGeneralChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateCrmProjectMutationVariables = {
  condition?: ModelCrmProjectConditionInput | null,
  input: CreateCrmProjectInput,
};

export type CreateCrmProjectMutation = {
  createCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateCrmProjectImportMutationVariables = {
  condition?: ModelCrmProjectImportConditionInput | null,
  input: CreateCrmProjectImportInput,
};

export type CreateCrmProjectImportMutation = {
  createCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type CreateCrmProjectProjectsMutationVariables = {
  condition?: ModelCrmProjectProjectsConditionInput | null,
  input: CreateCrmProjectProjectsInput,
};

export type CreateCrmProjectProjectsMutation = {
  createCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type CreateCurrentContextMutationVariables = {
  condition?: ModelCurrentContextConditionInput | null,
  input: CreateCurrentContextInput,
};

export type CreateCurrentContextMutation = {
  createCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateDailyPlanMutationVariables = {
  condition?: ModelDailyPlanConditionInput | null,
  input: CreateDailyPlanInput,
};

export type CreateDailyPlanMutation = {
  createDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateDailyPlanProjectMutationVariables = {
  condition?: ModelDailyPlanProjectConditionInput | null,
  input: CreateDailyPlanProjectInput,
};

export type CreateDailyPlanProjectMutation = {
  createDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type CreateDailyPlanTodoMutationVariables = {
  condition?: ModelDailyPlanTodoConditionInput | null,
  input: CreateDailyPlanTodoInput,
};

export type CreateDailyPlanTodoMutation = {
  createDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type CreateExportTaskMutationVariables = {
  condition?: ModelExportTaskConditionInput | null,
  input: CreateExportTaskInput,
};

export type CreateExportTaskMutation = {
  createExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type CreateInboxMutationVariables = {
  condition?: ModelInboxConditionInput | null,
  input: CreateInboxInput,
};

export type CreateInboxMutation = {
  createInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type CreateMeetingMutationVariables = {
  condition?: ModelMeetingConditionInput | null,
  input: CreateMeetingInput,
};

export type CreateMeetingMutation = {
  createMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type CreateMeetingParticipantMutationVariables = {
  condition?: ModelMeetingParticipantConditionInput | null,
  input: CreateMeetingParticipantInput,
};

export type CreateMeetingParticipantMutation = {
  createMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type CreateMonthMutationVariables = {
  condition?: ModelMonthConditionInput | null,
  input: CreateMonthInput,
};

export type CreateMonthMutation = {
  createMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateMrrDataUploadMutationVariables = {
  condition?: ModelMrrDataUploadConditionInput | null,
  input: CreateMrrDataUploadInput,
};

export type CreateMrrDataUploadMutation = {
  createMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type CreateNoteBlockMutationVariables = {
  condition?: ModelNoteBlockConditionInput | null,
  input: CreateNoteBlockInput,
};

export type CreateNoteBlockMutation = {
  createNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type CreateNoteBlockPersonMutationVariables = {
  condition?: ModelNoteBlockPersonConditionInput | null,
  input: CreateNoteBlockPersonInput,
};

export type CreateNoteBlockPersonMutation = {
  createNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type CreateNotesBibleChapterMutationVariables = {
  condition?: ModelNotesBibleChapterConditionInput | null,
  input: CreateNotesBibleChapterInput,
};

export type CreateNotesBibleChapterMutation = {
  createNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePayerAccountMutationVariables = {
  condition?: ModelPayerAccountConditionInput | null,
  input: CreatePayerAccountInput,
};

export type CreatePayerAccountMutation = {
  createPayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePayerAccountMrrMutationVariables = {
  condition?: ModelPayerAccountMrrConditionInput | null,
  input: CreatePayerAccountMrrInput,
};

export type CreatePayerAccountMrrMutation = {
  createPayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type CreatePersonMutationVariables = {
  condition?: ModelPersonConditionInput | null,
  input: CreatePersonInput,
};

export type CreatePersonMutation = {
  createPerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreatePersonAccountMutationVariables = {
  condition?: ModelPersonAccountConditionInput | null,
  input: CreatePersonAccountInput,
};

export type CreatePersonAccountMutation = {
  createPersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePersonDetailMutationVariables = {
  condition?: ModelPersonDetailConditionInput | null,
  input: CreatePersonDetailInput,
};

export type CreatePersonDetailMutation = {
  createPersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type CreatePersonLearningMutationVariables = {
  condition?: ModelPersonLearningConditionInput | null,
  input: CreatePersonLearningInput,
};

export type CreatePersonLearningMutation = {
  createPersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type CreatePersonRelationshipMutationVariables = {
  condition?: ModelPersonRelationshipConditionInput | null,
  input: CreatePersonRelationshipInput,
};

export type CreatePersonRelationshipMutation = {
  createPersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type CreateProjectActivityMutationVariables = {
  condition?: ModelProjectActivityConditionInput | null,
  input: CreateProjectActivityInput,
};

export type CreateProjectActivityMutation = {
  createProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type CreateProjectsMutationVariables = {
  condition?: ModelProjectsConditionInput | null,
  input: CreateProjectsInput,
};

export type CreateProjectsMutation = {
  createProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateSixWeekBatchMutationVariables = {
  condition?: ModelSixWeekBatchConditionInput | null,
  input: CreateSixWeekBatchInput,
};

export type CreateSixWeekBatchMutation = {
  createSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type CreateSixWeekBatchProjectsMutationVariables = {
  condition?: ModelSixWeekBatchProjectsConditionInput | null,
  input: CreateSixWeekBatchProjectsInput,
};

export type CreateSixWeekBatchProjectsMutation = {
  createSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type CreateSixWeekCycleMutationVariables = {
  condition?: ModelSixWeekCycleConditionInput | null,
  input: CreateSixWeekCycleInput,
};

export type CreateSixWeekCycleMutation = {
  createSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateTerritoryMutationVariables = {
  condition?: ModelTerritoryConditionInput | null,
  input: CreateTerritoryInput,
};

export type CreateTerritoryMutation = {
  createTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateTerritoryResponsibilityMutationVariables = {
  condition?: ModelTerritoryResponsibilityConditionInput | null,
  input: CreateTerritoryResponsibilityInput,
};

export type CreateTerritoryResponsibilityMutation = {
  createTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type CreateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: CreateTodoInput,
};

export type CreateTodoMutation = {
  createTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateWeeklyPlanMutationVariables = {
  condition?: ModelWeeklyPlanConditionInput | null,
  input: CreateWeeklyPlanInput,
};

export type CreateWeeklyPlanMutation = {
  createWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type CreateWeeklyPlanProjectMutationVariables = {
  condition?: ModelWeeklyPlanProjectConditionInput | null,
  input: CreateWeeklyPlanProjectInput,
};

export type CreateWeeklyPlanProjectMutation = {
  createWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type CreateWeeklyReviewMutationVariables = {
  condition?: ModelWeeklyReviewConditionInput | null,
  input: CreateWeeklyReviewInput,
};

export type CreateWeeklyReviewMutation = {
  createWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type CreateWeeklyReviewEntryMutationVariables = {
  condition?: ModelWeeklyReviewEntryConditionInput | null,
  input: CreateWeeklyReviewEntryInput,
};

export type CreateWeeklyReviewEntryMutation = {
  createWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};

export type DeleteAccountMutationVariables = {
  condition?: ModelAccountConditionInput | null,
  input: DeleteAccountInput,
};

export type DeleteAccountMutation = {
  deleteAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteAccountLearningMutationVariables = {
  condition?: ModelAccountLearningConditionInput | null,
  input: DeleteAccountLearningInput,
};

export type DeleteAccountLearningMutation = {
  deleteAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type DeleteAccountLearningPersonMutationVariables = {
  condition?: ModelAccountLearningPersonConditionInput | null,
  input: DeleteAccountLearningPersonInput,
};

export type DeleteAccountLearningPersonMutation = {
  deleteAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type DeleteAccountPayerAccountMutationVariables = {
  condition?: ModelAccountPayerAccountConditionInput | null,
  input: DeleteAccountPayerAccountInput,
};

export type DeleteAccountPayerAccountMutation = {
  deleteAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteAccountProjectsMutationVariables = {
  condition?: ModelAccountProjectsConditionInput | null,
  input: DeleteAccountProjectsInput,
};

export type DeleteAccountProjectsMutation = {
  deleteAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type DeleteAccountTerritoryMutationVariables = {
  condition?: ModelAccountTerritoryConditionInput | null,
  input: DeleteAccountTerritoryInput,
};

export type DeleteAccountTerritoryMutation = {
  deleteAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type DeleteActivityMutationVariables = {
  condition?: ModelActivityConditionInput | null,
  input: DeleteActivityInput,
};

export type DeleteActivityMutation = {
  deleteActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteBookOfBibleMutationVariables = {
  condition?: ModelBookOfBibleConditionInput | null,
  input: DeleteBookOfBibleInput,
};

export type DeleteBookOfBibleMutation = {
  deleteBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type DeleteConversationGeneralChatMutationVariables = {
  condition?: ModelConversationGeneralChatConditionInput | null,
  input: DeleteConversationGeneralChatInput,
};

export type DeleteConversationGeneralChatMutation = {
  deleteConversationGeneralChat?:  {
    __typename: "ConversationGeneralChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageGeneralChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteConversationMessageGeneralChatMutationVariables = {
  condition?: ModelConversationMessageGeneralChatConditionInput | null,
  input: DeleteConversationMessageGeneralChatInput,
};

export type DeleteConversationMessageGeneralChatMutation = {
  deleteConversationMessageGeneralChat?:  {
    __typename: "ConversationMessageGeneralChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationGeneralChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteCrmProjectMutationVariables = {
  condition?: ModelCrmProjectConditionInput | null,
  input: DeleteCrmProjectInput,
};

export type DeleteCrmProjectMutation = {
  deleteCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteCrmProjectImportMutationVariables = {
  condition?: ModelCrmProjectImportConditionInput | null,
  input: DeleteCrmProjectImportInput,
};

export type DeleteCrmProjectImportMutation = {
  deleteCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type DeleteCrmProjectProjectsMutationVariables = {
  condition?: ModelCrmProjectProjectsConditionInput | null,
  input: DeleteCrmProjectProjectsInput,
};

export type DeleteCrmProjectProjectsMutation = {
  deleteCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type DeleteCurrentContextMutationVariables = {
  condition?: ModelCurrentContextConditionInput | null,
  input: DeleteCurrentContextInput,
};

export type DeleteCurrentContextMutation = {
  deleteCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteDailyPlanMutationVariables = {
  condition?: ModelDailyPlanConditionInput | null,
  input: DeleteDailyPlanInput,
};

export type DeleteDailyPlanMutation = {
  deleteDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteDailyPlanProjectMutationVariables = {
  condition?: ModelDailyPlanProjectConditionInput | null,
  input: DeleteDailyPlanProjectInput,
};

export type DeleteDailyPlanProjectMutation = {
  deleteDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type DeleteDailyPlanTodoMutationVariables = {
  condition?: ModelDailyPlanTodoConditionInput | null,
  input: DeleteDailyPlanTodoInput,
};

export type DeleteDailyPlanTodoMutation = {
  deleteDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type DeleteExportTaskMutationVariables = {
  condition?: ModelExportTaskConditionInput | null,
  input: DeleteExportTaskInput,
};

export type DeleteExportTaskMutation = {
  deleteExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type DeleteInboxMutationVariables = {
  condition?: ModelInboxConditionInput | null,
  input: DeleteInboxInput,
};

export type DeleteInboxMutation = {
  deleteInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type DeleteMeetingMutationVariables = {
  condition?: ModelMeetingConditionInput | null,
  input: DeleteMeetingInput,
};

export type DeleteMeetingMutation = {
  deleteMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type DeleteMeetingParticipantMutationVariables = {
  condition?: ModelMeetingParticipantConditionInput | null,
  input: DeleteMeetingParticipantInput,
};

export type DeleteMeetingParticipantMutation = {
  deleteMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type DeleteMonthMutationVariables = {
  condition?: ModelMonthConditionInput | null,
  input: DeleteMonthInput,
};

export type DeleteMonthMutation = {
  deleteMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteMrrDataUploadMutationVariables = {
  condition?: ModelMrrDataUploadConditionInput | null,
  input: DeleteMrrDataUploadInput,
};

export type DeleteMrrDataUploadMutation = {
  deleteMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type DeleteNoteBlockMutationVariables = {
  condition?: ModelNoteBlockConditionInput | null,
  input: DeleteNoteBlockInput,
};

export type DeleteNoteBlockMutation = {
  deleteNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type DeleteNoteBlockPersonMutationVariables = {
  condition?: ModelNoteBlockPersonConditionInput | null,
  input: DeleteNoteBlockPersonInput,
};

export type DeleteNoteBlockPersonMutation = {
  deleteNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type DeleteNotesBibleChapterMutationVariables = {
  condition?: ModelNotesBibleChapterConditionInput | null,
  input: DeleteNotesBibleChapterInput,
};

export type DeleteNotesBibleChapterMutation = {
  deleteNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePayerAccountMutationVariables = {
  condition?: ModelPayerAccountConditionInput | null,
  input: DeletePayerAccountInput,
};

export type DeletePayerAccountMutation = {
  deletePayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePayerAccountMrrMutationVariables = {
  condition?: ModelPayerAccountMrrConditionInput | null,
  input: DeletePayerAccountMrrInput,
};

export type DeletePayerAccountMrrMutation = {
  deletePayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type DeletePersonMutationVariables = {
  condition?: ModelPersonConditionInput | null,
  input: DeletePersonInput,
};

export type DeletePersonMutation = {
  deletePerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeletePersonAccountMutationVariables = {
  condition?: ModelPersonAccountConditionInput | null,
  input: DeletePersonAccountInput,
};

export type DeletePersonAccountMutation = {
  deletePersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePersonDetailMutationVariables = {
  condition?: ModelPersonDetailConditionInput | null,
  input: DeletePersonDetailInput,
};

export type DeletePersonDetailMutation = {
  deletePersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type DeletePersonLearningMutationVariables = {
  condition?: ModelPersonLearningConditionInput | null,
  input: DeletePersonLearningInput,
};

export type DeletePersonLearningMutation = {
  deletePersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type DeletePersonRelationshipMutationVariables = {
  condition?: ModelPersonRelationshipConditionInput | null,
  input: DeletePersonRelationshipInput,
};

export type DeletePersonRelationshipMutation = {
  deletePersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type DeleteProjectActivityMutationVariables = {
  condition?: ModelProjectActivityConditionInput | null,
  input: DeleteProjectActivityInput,
};

export type DeleteProjectActivityMutation = {
  deleteProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type DeleteProjectsMutationVariables = {
  condition?: ModelProjectsConditionInput | null,
  input: DeleteProjectsInput,
};

export type DeleteProjectsMutation = {
  deleteProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteSixWeekBatchMutationVariables = {
  condition?: ModelSixWeekBatchConditionInput | null,
  input: DeleteSixWeekBatchInput,
};

export type DeleteSixWeekBatchMutation = {
  deleteSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type DeleteSixWeekBatchProjectsMutationVariables = {
  condition?: ModelSixWeekBatchProjectsConditionInput | null,
  input: DeleteSixWeekBatchProjectsInput,
};

export type DeleteSixWeekBatchProjectsMutation = {
  deleteSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type DeleteSixWeekCycleMutationVariables = {
  condition?: ModelSixWeekCycleConditionInput | null,
  input: DeleteSixWeekCycleInput,
};

export type DeleteSixWeekCycleMutation = {
  deleteSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteTerritoryMutationVariables = {
  condition?: ModelTerritoryConditionInput | null,
  input: DeleteTerritoryInput,
};

export type DeleteTerritoryMutation = {
  deleteTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteTerritoryResponsibilityMutationVariables = {
  condition?: ModelTerritoryResponsibilityConditionInput | null,
  input: DeleteTerritoryResponsibilityInput,
};

export type DeleteTerritoryResponsibilityMutation = {
  deleteTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type DeleteTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: DeleteTodoInput,
};

export type DeleteTodoMutation = {
  deleteTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteWeeklyPlanMutationVariables = {
  condition?: ModelWeeklyPlanConditionInput | null,
  input: DeleteWeeklyPlanInput,
};

export type DeleteWeeklyPlanMutation = {
  deleteWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type DeleteWeeklyPlanProjectMutationVariables = {
  condition?: ModelWeeklyPlanProjectConditionInput | null,
  input: DeleteWeeklyPlanProjectInput,
};

export type DeleteWeeklyPlanProjectMutation = {
  deleteWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type DeleteWeeklyReviewMutationVariables = {
  condition?: ModelWeeklyReviewConditionInput | null,
  input: DeleteWeeklyReviewInput,
};

export type DeleteWeeklyReviewMutation = {
  deleteWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type DeleteWeeklyReviewEntryMutationVariables = {
  condition?: ModelWeeklyReviewEntryConditionInput | null,
  input: DeleteWeeklyReviewEntryInput,
};

export type DeleteWeeklyReviewEntryMutation = {
  deleteWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};

export type GeneralChatMutationVariables = {
  aiContext?: string | null,
  content?: Array< AmplifyAIContentBlockInput | null > | null,
  conversationId: string,
  toolConfiguration?: AmplifyAIToolConfigurationInput | null,
};

export type GeneralChatMutation = {
  generalChat: ( {
      __typename: "ConversationMessageGeneralChat",
      aiContext?: string | null,
      associatedUserMessageId?: string | null,
      content?:  Array< {
        __typename: "AmplifyAIContentBlock",
        text?: string | null,
      } | null > | null,
      conversationId: string,
      createdAt?: string | null,
      id: string,
      owner?: string | null,
      role?: AmplifyAIConversationParticipantRole | null,
      toolConfiguration?:  {
        __typename: "AmplifyAIToolConfiguration",
      } | null,
      updatedAt?: string | null,
      conversation?:  {
        __typename: "ConversationGeneralChat",
        createdAt: string,
        id: string,
        metadata?: string | null,
        name?: string | null,
        owner?: string | null,
        updatedAt: string,
      } | null,
    }
  ) | null,
};

export type UpdateAccountMutationVariables = {
  condition?: ModelAccountConditionInput | null,
  input: UpdateAccountInput,
};

export type UpdateAccountMutation = {
  updateAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateAccountLearningMutationVariables = {
  condition?: ModelAccountLearningConditionInput | null,
  input: UpdateAccountLearningInput,
};

export type UpdateAccountLearningMutation = {
  updateAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type UpdateAccountLearningPersonMutationVariables = {
  condition?: ModelAccountLearningPersonConditionInput | null,
  input: UpdateAccountLearningPersonInput,
};

export type UpdateAccountLearningPersonMutation = {
  updateAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type UpdateAccountPayerAccountMutationVariables = {
  condition?: ModelAccountPayerAccountConditionInput | null,
  input: UpdateAccountPayerAccountInput,
};

export type UpdateAccountPayerAccountMutation = {
  updateAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateAccountProjectsMutationVariables = {
  condition?: ModelAccountProjectsConditionInput | null,
  input: UpdateAccountProjectsInput,
};

export type UpdateAccountProjectsMutation = {
  updateAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type UpdateAccountTerritoryMutationVariables = {
  condition?: ModelAccountTerritoryConditionInput | null,
  input: UpdateAccountTerritoryInput,
};

export type UpdateAccountTerritoryMutation = {
  updateAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type UpdateActivityMutationVariables = {
  condition?: ModelActivityConditionInput | null,
  input: UpdateActivityInput,
};

export type UpdateActivityMutation = {
  updateActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateBookOfBibleMutationVariables = {
  condition?: ModelBookOfBibleConditionInput | null,
  input: UpdateBookOfBibleInput,
};

export type UpdateBookOfBibleMutation = {
  updateBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type UpdateConversationGeneralChatMutationVariables = {
  condition?: ModelConversationGeneralChatConditionInput | null,
  input: UpdateConversationGeneralChatInput,
};

export type UpdateConversationGeneralChatMutation = {
  updateConversationGeneralChat?:  {
    __typename: "ConversationGeneralChat",
    createdAt: string,
    id: string,
    messages?:  {
      __typename: "ModelConversationMessageGeneralChatConnection",
      nextToken?: string | null,
    } | null,
    metadata?: string | null,
    name?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateCrmProjectMutationVariables = {
  condition?: ModelCrmProjectConditionInput | null,
  input: UpdateCrmProjectInput,
};

export type UpdateCrmProjectMutation = {
  updateCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateCrmProjectImportMutationVariables = {
  condition?: ModelCrmProjectImportConditionInput | null,
  input: UpdateCrmProjectImportInput,
};

export type UpdateCrmProjectImportMutation = {
  updateCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type UpdateCrmProjectProjectsMutationVariables = {
  condition?: ModelCrmProjectProjectsConditionInput | null,
  input: UpdateCrmProjectProjectsInput,
};

export type UpdateCrmProjectProjectsMutation = {
  updateCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type UpdateCurrentContextMutationVariables = {
  condition?: ModelCurrentContextConditionInput | null,
  input: UpdateCurrentContextInput,
};

export type UpdateCurrentContextMutation = {
  updateCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateDailyPlanMutationVariables = {
  condition?: ModelDailyPlanConditionInput | null,
  input: UpdateDailyPlanInput,
};

export type UpdateDailyPlanMutation = {
  updateDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateDailyPlanProjectMutationVariables = {
  condition?: ModelDailyPlanProjectConditionInput | null,
  input: UpdateDailyPlanProjectInput,
};

export type UpdateDailyPlanProjectMutation = {
  updateDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type UpdateDailyPlanTodoMutationVariables = {
  condition?: ModelDailyPlanTodoConditionInput | null,
  input: UpdateDailyPlanTodoInput,
};

export type UpdateDailyPlanTodoMutation = {
  updateDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type UpdateExportTaskMutationVariables = {
  condition?: ModelExportTaskConditionInput | null,
  input: UpdateExportTaskInput,
};

export type UpdateExportTaskMutation = {
  updateExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type UpdateInboxMutationVariables = {
  condition?: ModelInboxConditionInput | null,
  input: UpdateInboxInput,
};

export type UpdateInboxMutation = {
  updateInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type UpdateMeetingMutationVariables = {
  condition?: ModelMeetingConditionInput | null,
  input: UpdateMeetingInput,
};

export type UpdateMeetingMutation = {
  updateMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type UpdateMeetingParticipantMutationVariables = {
  condition?: ModelMeetingParticipantConditionInput | null,
  input: UpdateMeetingParticipantInput,
};

export type UpdateMeetingParticipantMutation = {
  updateMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type UpdateMonthMutationVariables = {
  condition?: ModelMonthConditionInput | null,
  input: UpdateMonthInput,
};

export type UpdateMonthMutation = {
  updateMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateMrrDataUploadMutationVariables = {
  condition?: ModelMrrDataUploadConditionInput | null,
  input: UpdateMrrDataUploadInput,
};

export type UpdateMrrDataUploadMutation = {
  updateMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type UpdateNoteBlockMutationVariables = {
  condition?: ModelNoteBlockConditionInput | null,
  input: UpdateNoteBlockInput,
};

export type UpdateNoteBlockMutation = {
  updateNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type UpdateNoteBlockPersonMutationVariables = {
  condition?: ModelNoteBlockPersonConditionInput | null,
  input: UpdateNoteBlockPersonInput,
};

export type UpdateNoteBlockPersonMutation = {
  updateNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type UpdateNotesBibleChapterMutationVariables = {
  condition?: ModelNotesBibleChapterConditionInput | null,
  input: UpdateNotesBibleChapterInput,
};

export type UpdateNotesBibleChapterMutation = {
  updateNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePayerAccountMutationVariables = {
  condition?: ModelPayerAccountConditionInput | null,
  input: UpdatePayerAccountInput,
};

export type UpdatePayerAccountMutation = {
  updatePayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePayerAccountMrrMutationVariables = {
  condition?: ModelPayerAccountMrrConditionInput | null,
  input: UpdatePayerAccountMrrInput,
};

export type UpdatePayerAccountMrrMutation = {
  updatePayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type UpdatePersonMutationVariables = {
  condition?: ModelPersonConditionInput | null,
  input: UpdatePersonInput,
};

export type UpdatePersonMutation = {
  updatePerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdatePersonAccountMutationVariables = {
  condition?: ModelPersonAccountConditionInput | null,
  input: UpdatePersonAccountInput,
};

export type UpdatePersonAccountMutation = {
  updatePersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePersonDetailMutationVariables = {
  condition?: ModelPersonDetailConditionInput | null,
  input: UpdatePersonDetailInput,
};

export type UpdatePersonDetailMutation = {
  updatePersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type UpdatePersonLearningMutationVariables = {
  condition?: ModelPersonLearningConditionInput | null,
  input: UpdatePersonLearningInput,
};

export type UpdatePersonLearningMutation = {
  updatePersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type UpdatePersonRelationshipMutationVariables = {
  condition?: ModelPersonRelationshipConditionInput | null,
  input: UpdatePersonRelationshipInput,
};

export type UpdatePersonRelationshipMutation = {
  updatePersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type UpdateProjectActivityMutationVariables = {
  condition?: ModelProjectActivityConditionInput | null,
  input: UpdateProjectActivityInput,
};

export type UpdateProjectActivityMutation = {
  updateProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type UpdateProjectsMutationVariables = {
  condition?: ModelProjectsConditionInput | null,
  input: UpdateProjectsInput,
};

export type UpdateProjectsMutation = {
  updateProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateSixWeekBatchMutationVariables = {
  condition?: ModelSixWeekBatchConditionInput | null,
  input: UpdateSixWeekBatchInput,
};

export type UpdateSixWeekBatchMutation = {
  updateSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type UpdateSixWeekBatchProjectsMutationVariables = {
  condition?: ModelSixWeekBatchProjectsConditionInput | null,
  input: UpdateSixWeekBatchProjectsInput,
};

export type UpdateSixWeekBatchProjectsMutation = {
  updateSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type UpdateSixWeekCycleMutationVariables = {
  condition?: ModelSixWeekCycleConditionInput | null,
  input: UpdateSixWeekCycleInput,
};

export type UpdateSixWeekCycleMutation = {
  updateSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateTerritoryMutationVariables = {
  condition?: ModelTerritoryConditionInput | null,
  input: UpdateTerritoryInput,
};

export type UpdateTerritoryMutation = {
  updateTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateTerritoryResponsibilityMutationVariables = {
  condition?: ModelTerritoryResponsibilityConditionInput | null,
  input: UpdateTerritoryResponsibilityInput,
};

export type UpdateTerritoryResponsibilityMutation = {
  updateTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type UpdateTodoMutationVariables = {
  condition?: ModelTodoConditionInput | null,
  input: UpdateTodoInput,
};

export type UpdateTodoMutation = {
  updateTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateWeeklyPlanMutationVariables = {
  condition?: ModelWeeklyPlanConditionInput | null,
  input: UpdateWeeklyPlanInput,
};

export type UpdateWeeklyPlanMutation = {
  updateWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type UpdateWeeklyPlanProjectMutationVariables = {
  condition?: ModelWeeklyPlanProjectConditionInput | null,
  input: UpdateWeeklyPlanProjectInput,
};

export type UpdateWeeklyPlanProjectMutation = {
  updateWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type UpdateWeeklyReviewMutationVariables = {
  condition?: ModelWeeklyReviewConditionInput | null,
  input: UpdateWeeklyReviewInput,
};

export type UpdateWeeklyReviewMutation = {
  updateWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type UpdateWeeklyReviewEntryMutationVariables = {
  condition?: ModelWeeklyReviewEntryConditionInput | null,
  input: UpdateWeeklyReviewEntryInput,
};

export type UpdateWeeklyReviewEntryMutation = {
  updateWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountSubscription = {
  onCreateAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountLearningSubscriptionVariables = {
  filter?: ModelSubscriptionAccountLearningFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountLearningSubscription = {
  onCreateAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountLearningPersonSubscriptionVariables = {
  filter?: ModelSubscriptionAccountLearningPersonFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountLearningPersonSubscription = {
  onCreateAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountPayerAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountPayerAccountFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountPayerAccountSubscription = {
  onCreateAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionAccountProjectsFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountProjectsSubscription = {
  onCreateAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAccountTerritorySubscriptionVariables = {
  filter?: ModelSubscriptionAccountTerritoryFilterInput | null,
  owner?: string | null,
};

export type OnCreateAccountTerritorySubscription = {
  onCreateAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
  owner?: string | null,
};

export type OnCreateActivitySubscription = {
  onCreateActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateAssistantResponseGeneralChatSubscriptionVariables = {
  conversationId?: string | null,
};

export type OnCreateAssistantResponseGeneralChatSubscription = {
  onCreateAssistantResponseGeneralChat?:  {
    __typename: "AmplifyAIConversationMessageStreamPart",
    associatedUserMessageId: string,
    contentBlockDeltaIndex?: number | null,
    contentBlockDoneAtIndex?: number | null,
    contentBlockIndex?: number | null,
    contentBlockText?: string | null,
    contentBlockToolUse?:  {
      __typename: "AmplifyAIToolUseBlock",
      input: string,
      name: string,
      toolUseId: string,
    } | null,
    conversationId: string,
    errors?:  Array< {
      __typename: "AmplifyAIConversationTurnError",
      errorType: string,
      message: string,
    } | null > | null,
    id: string,
    owner?: string | null,
    p?: string | null,
    stopReason?: string | null,
  } | null,
};

export type OnCreateBookOfBibleSubscriptionVariables = {
  filter?: ModelSubscriptionBookOfBibleFilterInput | null,
  owner?: string | null,
};

export type OnCreateBookOfBibleSubscription = {
  onCreateBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type OnCreateConversationMessageGeneralChatSubscriptionVariables = {
  filter?: ModelSubscriptionConversationMessageGeneralChatFilterInput | null,
  owner?: string | null,
};

export type OnCreateConversationMessageGeneralChatSubscription = {
  onCreateConversationMessageGeneralChat?:  {
    __typename: "ConversationMessageGeneralChat",
    aiContext?: string | null,
    associatedUserMessageId?: string | null,
    content?:  Array< {
      __typename: "AmplifyAIContentBlock",
      text?: string | null,
    } | null > | null,
    conversation?:  {
      __typename: "ConversationGeneralChat",
      createdAt: string,
      id: string,
      metadata?: string | null,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    conversationId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    role?: AmplifyAIConversationParticipantRole | null,
    toolConfiguration?:  {
      __typename: "AmplifyAIToolConfiguration",
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateCrmProjectSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectFilterInput | null,
  owner?: string | null,
};

export type OnCreateCrmProjectSubscription = {
  onCreateCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateCrmProjectImportSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectImportFilterInput | null,
  owner?: string | null,
};

export type OnCreateCrmProjectImportSubscription = {
  onCreateCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateCrmProjectProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectProjectsFilterInput | null,
  owner?: string | null,
};

export type OnCreateCrmProjectProjectsSubscription = {
  onCreateCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCurrentContextSubscriptionVariables = {
  filter?: ModelSubscriptionCurrentContextFilterInput | null,
  owner?: string | null,
};

export type OnCreateCurrentContextSubscription = {
  onCreateCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateDailyPlanSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanFilterInput | null,
  owner?: string | null,
};

export type OnCreateDailyPlanSubscription = {
  onCreateDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateDailyPlanProjectSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanProjectFilterInput | null,
  owner?: string | null,
};

export type OnCreateDailyPlanProjectSubscription = {
  onCreateDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDailyPlanTodoSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanTodoFilterInput | null,
  owner?: string | null,
};

export type OnCreateDailyPlanTodoSubscription = {
  onCreateDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateExportTaskSubscriptionVariables = {
  filter?: ModelSubscriptionExportTaskFilterInput | null,
  owner?: string | null,
};

export type OnCreateExportTaskSubscription = {
  onCreateExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type OnCreateInboxSubscriptionVariables = {
  filter?: ModelSubscriptionInboxFilterInput | null,
  owner?: string | null,
};

export type OnCreateInboxSubscription = {
  onCreateInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateMeetingSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingFilterInput | null,
  owner?: string | null,
};

export type OnCreateMeetingSubscription = {
  onCreateMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMeetingParticipantSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingParticipantFilterInput | null,
  owner?: string | null,
};

export type OnCreateMeetingParticipantSubscription = {
  onCreateMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMonthSubscriptionVariables = {
  filter?: ModelSubscriptionMonthFilterInput | null,
  owner?: string | null,
};

export type OnCreateMonthSubscription = {
  onCreateMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateMrrDataUploadSubscriptionVariables = {
  filter?: ModelSubscriptionMrrDataUploadFilterInput | null,
  owner?: string | null,
};

export type OnCreateMrrDataUploadSubscription = {
  onCreateMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateNoteBlockSubscriptionVariables = {
  filter?: ModelSubscriptionNoteBlockFilterInput | null,
  owner?: string | null,
};

export type OnCreateNoteBlockSubscription = {
  onCreateNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNoteBlockPersonSubscriptionVariables = {
  filter?: ModelSubscriptionNoteBlockPersonFilterInput | null,
  owner?: string | null,
};

export type OnCreateNoteBlockPersonSubscription = {
  onCreateNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNotesBibleChapterSubscriptionVariables = {
  filter?: ModelSubscriptionNotesBibleChapterFilterInput | null,
  owner?: string | null,
};

export type OnCreateNotesBibleChapterSubscription = {
  onCreateNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePayerAccountSubscriptionVariables = {
  filter?: ModelSubscriptionPayerAccountFilterInput | null,
  owner?: string | null,
};

export type OnCreatePayerAccountSubscription = {
  onCreatePayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePayerAccountMrrSubscriptionVariables = {
  filter?: ModelSubscriptionPayerAccountMrrFilterInput | null,
  owner?: string | null,
};

export type OnCreatePayerAccountMrrSubscription = {
  onCreatePayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type OnCreatePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
  owner?: string | null,
};

export type OnCreatePersonSubscription = {
  onCreatePerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonAccountSubscriptionVariables = {
  filter?: ModelSubscriptionPersonAccountFilterInput | null,
  owner?: string | null,
};

export type OnCreatePersonAccountSubscription = {
  onCreatePersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonDetailSubscriptionVariables = {
  filter?: ModelSubscriptionPersonDetailFilterInput | null,
  owner?: string | null,
};

export type OnCreatePersonDetailSubscription = {
  onCreatePersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonLearningSubscriptionVariables = {
  filter?: ModelSubscriptionPersonLearningFilterInput | null,
  owner?: string | null,
};

export type OnCreatePersonLearningSubscription = {
  onCreatePersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonRelationshipSubscriptionVariables = {
  filter?: ModelSubscriptionPersonRelationshipFilterInput | null,
  owner?: string | null,
};

export type OnCreatePersonRelationshipSubscription = {
  onCreatePersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type OnCreateProjectActivitySubscriptionVariables = {
  filter?: ModelSubscriptionProjectActivityFilterInput | null,
  owner?: string | null,
};

export type OnCreateProjectActivitySubscription = {
  onCreateProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionProjectsFilterInput | null,
  owner?: string | null,
};

export type OnCreateProjectsSubscription = {
  onCreateProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateSixWeekBatchSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekBatchFilterInput | null,
  owner?: string | null,
};

export type OnCreateSixWeekBatchSubscription = {
  onCreateSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type OnCreateSixWeekBatchProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekBatchProjectsFilterInput | null,
  owner?: string | null,
};

export type OnCreateSixWeekBatchProjectsSubscription = {
  onCreateSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSixWeekCycleSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekCycleFilterInput | null,
  owner?: string | null,
};

export type OnCreateSixWeekCycleSubscription = {
  onCreateSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTerritorySubscriptionVariables = {
  filter?: ModelSubscriptionTerritoryFilterInput | null,
  owner?: string | null,
};

export type OnCreateTerritorySubscription = {
  onCreateTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTerritoryResponsibilitySubscriptionVariables = {
  filter?: ModelSubscriptionTerritoryResponsibilityFilterInput | null,
  owner?: string | null,
};

export type OnCreateTerritoryResponsibilitySubscription = {
  onCreateTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
  owner?: string | null,
};

export type OnCreateTodoSubscription = {
  onCreateTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  profileId?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateWeeklyPlanSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyPlanFilterInput | null,
  owner?: string | null,
};

export type OnCreateWeeklyPlanSubscription = {
  onCreateWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateWeeklyPlanProjectSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyPlanProjectFilterInput | null,
  owner?: string | null,
};

export type OnCreateWeeklyPlanProjectSubscription = {
  onCreateWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type OnCreateWeeklyReviewSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyReviewFilterInput | null,
  owner?: string | null,
};

export type OnCreateWeeklyReviewSubscription = {
  onCreateWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateWeeklyReviewEntrySubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyReviewEntryFilterInput | null,
  owner?: string | null,
};

export type OnCreateWeeklyReviewEntrySubscription = {
  onCreateWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountSubscription = {
  onDeleteAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountLearningSubscriptionVariables = {
  filter?: ModelSubscriptionAccountLearningFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountLearningSubscription = {
  onDeleteAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountLearningPersonSubscriptionVariables = {
  filter?: ModelSubscriptionAccountLearningPersonFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountLearningPersonSubscription = {
  onDeleteAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountPayerAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountPayerAccountFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountPayerAccountSubscription = {
  onDeleteAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionAccountProjectsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountProjectsSubscription = {
  onDeleteAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountTerritorySubscriptionVariables = {
  filter?: ModelSubscriptionAccountTerritoryFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAccountTerritorySubscription = {
  onDeleteAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
  owner?: string | null,
};

export type OnDeleteActivitySubscription = {
  onDeleteActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteBookOfBibleSubscriptionVariables = {
  filter?: ModelSubscriptionBookOfBibleFilterInput | null,
  owner?: string | null,
};

export type OnDeleteBookOfBibleSubscription = {
  onDeleteBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type OnDeleteCrmProjectSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCrmProjectSubscription = {
  onDeleteCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteCrmProjectImportSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectImportFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCrmProjectImportSubscription = {
  onDeleteCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteCrmProjectProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectProjectsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCrmProjectProjectsSubscription = {
  onDeleteCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCurrentContextSubscriptionVariables = {
  filter?: ModelSubscriptionCurrentContextFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCurrentContextSubscription = {
  onDeleteCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteDailyPlanSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDailyPlanSubscription = {
  onDeleteDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteDailyPlanProjectSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanProjectFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDailyPlanProjectSubscription = {
  onDeleteDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDailyPlanTodoSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanTodoFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDailyPlanTodoSubscription = {
  onDeleteDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteExportTaskSubscriptionVariables = {
  filter?: ModelSubscriptionExportTaskFilterInput | null,
  owner?: string | null,
};

export type OnDeleteExportTaskSubscription = {
  onDeleteExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteInboxSubscriptionVariables = {
  filter?: ModelSubscriptionInboxFilterInput | null,
  owner?: string | null,
};

export type OnDeleteInboxSubscription = {
  onDeleteInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteMeetingSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMeetingSubscription = {
  onDeleteMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMeetingParticipantSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingParticipantFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMeetingParticipantSubscription = {
  onDeleteMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMonthSubscriptionVariables = {
  filter?: ModelSubscriptionMonthFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMonthSubscription = {
  onDeleteMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMrrDataUploadSubscriptionVariables = {
  filter?: ModelSubscriptionMrrDataUploadFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMrrDataUploadSubscription = {
  onDeleteMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteNoteBlockSubscriptionVariables = {
  filter?: ModelSubscriptionNoteBlockFilterInput | null,
  owner?: string | null,
};

export type OnDeleteNoteBlockSubscription = {
  onDeleteNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNoteBlockPersonSubscriptionVariables = {
  filter?: ModelSubscriptionNoteBlockPersonFilterInput | null,
  owner?: string | null,
};

export type OnDeleteNoteBlockPersonSubscription = {
  onDeleteNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNotesBibleChapterSubscriptionVariables = {
  filter?: ModelSubscriptionNotesBibleChapterFilterInput | null,
  owner?: string | null,
};

export type OnDeleteNotesBibleChapterSubscription = {
  onDeleteNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePayerAccountSubscriptionVariables = {
  filter?: ModelSubscriptionPayerAccountFilterInput | null,
  owner?: string | null,
};

export type OnDeletePayerAccountSubscription = {
  onDeletePayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePayerAccountMrrSubscriptionVariables = {
  filter?: ModelSubscriptionPayerAccountMrrFilterInput | null,
  owner?: string | null,
};

export type OnDeletePayerAccountMrrSubscription = {
  onDeletePayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type OnDeletePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
  owner?: string | null,
};

export type OnDeletePersonSubscription = {
  onDeletePerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonAccountSubscriptionVariables = {
  filter?: ModelSubscriptionPersonAccountFilterInput | null,
  owner?: string | null,
};

export type OnDeletePersonAccountSubscription = {
  onDeletePersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonDetailSubscriptionVariables = {
  filter?: ModelSubscriptionPersonDetailFilterInput | null,
  owner?: string | null,
};

export type OnDeletePersonDetailSubscription = {
  onDeletePersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonLearningSubscriptionVariables = {
  filter?: ModelSubscriptionPersonLearningFilterInput | null,
  owner?: string | null,
};

export type OnDeletePersonLearningSubscription = {
  onDeletePersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonRelationshipSubscriptionVariables = {
  filter?: ModelSubscriptionPersonRelationshipFilterInput | null,
  owner?: string | null,
};

export type OnDeletePersonRelationshipSubscription = {
  onDeletePersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectActivitySubscriptionVariables = {
  filter?: ModelSubscriptionProjectActivityFilterInput | null,
  owner?: string | null,
};

export type OnDeleteProjectActivitySubscription = {
  onDeleteProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionProjectsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteProjectsSubscription = {
  onDeleteProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteSixWeekBatchSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekBatchFilterInput | null,
  owner?: string | null,
};

export type OnDeleteSixWeekBatchSubscription = {
  onDeleteSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteSixWeekBatchProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekBatchProjectsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteSixWeekBatchProjectsSubscription = {
  onDeleteSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSixWeekCycleSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekCycleFilterInput | null,
  owner?: string | null,
};

export type OnDeleteSixWeekCycleSubscription = {
  onDeleteSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTerritorySubscriptionVariables = {
  filter?: ModelSubscriptionTerritoryFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTerritorySubscription = {
  onDeleteTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTerritoryResponsibilitySubscriptionVariables = {
  filter?: ModelSubscriptionTerritoryResponsibilityFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTerritoryResponsibilitySubscription = {
  onDeleteTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTodoSubscription = {
  onDeleteTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  profileId?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteWeeklyPlanSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyPlanFilterInput | null,
  owner?: string | null,
};

export type OnDeleteWeeklyPlanSubscription = {
  onDeleteWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteWeeklyPlanProjectSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyPlanProjectFilterInput | null,
  owner?: string | null,
};

export type OnDeleteWeeklyPlanProjectSubscription = {
  onDeleteWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type OnDeleteWeeklyReviewSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyReviewFilterInput | null,
  owner?: string | null,
};

export type OnDeleteWeeklyReviewSubscription = {
  onDeleteWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteWeeklyReviewEntrySubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyReviewEntryFilterInput | null,
  owner?: string | null,
};

export type OnDeleteWeeklyReviewEntrySubscription = {
  onDeleteWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountSubscription = {
  onUpdateAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    awsAccounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    learnings?:  {
      __typename: "ModelAccountLearningConnection",
      nextToken?: string | null,
    } | null,
    mainColor?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    partnerProjects?:  {
      __typename: "ModelProjectsConnection",
      nextToken?: string | null,
    } | null,
    people?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    projects?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    resellingAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    shortName?: string | null,
    subsidiaries?:  {
      __typename: "ModelAccountConnection",
      nextToken?: string | null,
    } | null,
    territories?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountLearningSubscriptionVariables = {
  filter?: ModelSubscriptionAccountLearningFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountLearningSubscription = {
  onUpdateAccountLearning?:  {
    __typename: "AccountLearning",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    peopleMentioned?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountLearningPersonSubscriptionVariables = {
  filter?: ModelSubscriptionAccountLearningPersonFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountLearningPersonSubscription = {
  onUpdateAccountLearningPerson?:  {
    __typename: "AccountLearningPerson",
    createdAt: string,
    id: string,
    learning?:  {
      __typename: "AccountLearning",
      accountId: string,
      createdAt: string,
      id: string,
      learnedOn?: string | null,
      learning?: string | null,
      owner?: string | null,
      status: LearningStatus,
      updatedAt: string,
    } | null,
    learningId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountPayerAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountPayerAccountFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountPayerAccountSubscription = {
  onUpdateAccountPayerAccount?:  {
    __typename: "AccountPayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    awsAccountNumberId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionAccountProjectsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountProjectsSubscription = {
  onUpdateAccountProjects?:  {
    __typename: "AccountProjects",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountTerritorySubscriptionVariables = {
  filter?: ModelSubscriptionAccountTerritoryFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAccountTerritorySubscription = {
  onUpdateAccountTerritory?:  {
    __typename: "AccountTerritory",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
  owner?: string | null,
};

export type OnUpdateActivitySubscription = {
  onUpdateActivity?:  {
    __typename: "Activity",
    createdAt: string,
    finishedOn?: string | null,
    forMeeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    forProjects?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    formatVersion?: number | null,
    id: string,
    meetingActivitiesId?: string | null,
    name?: string | null,
    noteBlockIds?: Array< string > | null,
    noteBlocks?:  {
      __typename: "ModelNoteBlockConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateBookOfBibleSubscriptionVariables = {
  filter?: ModelSubscriptionBookOfBibleFilterInput | null,
  owner?: string | null,
};

export type OnUpdateBookOfBibleSubscription = {
  onUpdateBookOfBible?:  {
    __typename: "BookOfBible",
    alias: string,
    book: string,
    chapters?:  {
      __typename: "ModelNotesBibleChapterConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    noOfChapters?: number | null,
    notionId?: number | null,
    owner?: string | null,
    section: Section,
    updatedAt: string,
  } | null,
};

export type OnUpdateCrmProjectSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCrmProjectSubscription = {
  onUpdateCrmProject?:  {
    __typename: "CrmProject",
    accountName?: string | null,
    annualRecurringRevenue?: number | null,
    closeDate: string,
    confirmHygieneIssuesSolvedTill?: string | null,
    createdAt: string,
    createdDate?: string | null,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    nextStep?: string | null,
    opportunityOwner?: string | null,
    owner?: string | null,
    partnerName?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    stageChangedDate?: string | null,
    territoryName?: string | null,
    totalContractVolume?: number | null,
    type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateCrmProjectImportSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectImportFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCrmProjectImportSubscription = {
  onUpdateCrmProjectImport?:  {
    __typename: "CrmProjectImport",
    createdAt: string,
    id: string,
    owner?: string | null,
    s3Key: string,
    status: CrmProjectImportStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateCrmProjectProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionCrmProjectProjectsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCrmProjectProjectsSubscription = {
  onUpdateCrmProjectProjects?:  {
    __typename: "CrmProjectProjects",
    createdAt: string,
    crmProject?:  {
      __typename: "CrmProject",
      accountName?: string | null,
      annualRecurringRevenue?: number | null,
      closeDate: string,
      confirmHygieneIssuesSolvedTill?: string | null,
      createdAt: string,
      createdDate?: string | null,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      nextStep?: string | null,
      opportunityOwner?: string | null,
      owner?: string | null,
      partnerName?: string | null,
      stage: string,
      stageChangedDate?: string | null,
      territoryName?: string | null,
      totalContractVolume?: number | null,
      type?: string | null,
      updatedAt: string,
    } | null,
    crmProjectId: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCurrentContextSubscriptionVariables = {
  filter?: ModelSubscriptionCurrentContextFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCurrentContextSubscription = {
  onUpdateCurrentContext?:  {
    __typename: "CurrentContext",
    context: Context,
    createdAt: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateDailyPlanSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDailyPlanSubscription = {
  onUpdateDailyPlan?:  {
    __typename: "DailyPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    status: DailyPlanStatus,
    todos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateDailyPlanProjectSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanProjectFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDailyPlanProjectSubscription = {
  onUpdateDailyPlanProject?:  {
    __typename: "DailyPlanProject",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    maybe?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDailyPlanTodoSubscriptionVariables = {
  filter?: ModelSubscriptionDailyPlanTodoFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDailyPlanTodoSubscription = {
  onUpdateDailyPlanTodo?:  {
    __typename: "DailyPlanTodo",
    createdAt: string,
    dailyPlan?:  {
      __typename: "DailyPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      id: string,
      owner?: string | null,
      status: DailyPlanStatus,
      updatedAt: string,
    } | null,
    dailyPlanId: string,
    id: string,
    owner?: string | null,
    postPoned?: boolean | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateExportTaskSubscriptionVariables = {
  filter?: ModelSubscriptionExportTaskFilterInput | null,
  owner?: string | null,
};

export type OnUpdateExportTaskSubscription = {
  onUpdateExportTask?:  {
    __typename: "ExportTask",
    createdAt: string,
    dataSource: ExportTaskDataSource,
    endDate: string,
    error?: string | null,
    id: string,
    itemId: string,
    itemName?: string | null,
    owner?: string | null,
    result?: string | null,
    startDate: string,
    status: ExportStatus,
    ttl?: number | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateInboxSubscriptionVariables = {
  filter?: ModelSubscriptionInboxFilterInput | null,
  owner?: string | null,
};

export type OnUpdateInboxSubscription = {
  onUpdateInbox?:  {
    __typename: "Inbox",
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    movedToAccountLearningId?: string | null,
    movedToActivityId?: string | null,
    movedToPersonLearningId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: InboxStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateMeetingSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMeetingSubscription = {
  onUpdateMeeting?:  {
    __typename: "Meeting",
    activities?:  {
      __typename: "ModelActivityConnection",
      nextToken?: string | null,
    } | null,
    context?: Context | null,
    createdAt: string,
    id: string,
    immediateTasksDone?: boolean | null,
    meetingOn?: string | null,
    notionId?: number | null,
    owner?: string | null,
    participants?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    topic: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMeetingParticipantSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingParticipantFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMeetingParticipantSubscription = {
  onUpdateMeetingParticipant?:  {
    __typename: "MeetingParticipant",
    createdAt: string,
    id: string,
    meeting?:  {
      __typename: "Meeting",
      context?: Context | null,
      createdAt: string,
      id: string,
      immediateTasksDone?: boolean | null,
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null,
    meetingId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMonthSubscriptionVariables = {
  filter?: ModelSubscriptionMonthFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMonthSubscription = {
  onUpdateMonth?:  {
    __typename: "Month",
    createdAt: string,
    id: string,
    latestUpload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    latestUploadId: string,
    month: string,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMrrDataUploadSubscriptionVariables = {
  filter?: ModelSubscriptionMrrDataUploadFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMrrDataUploadSubscription = {
  onUpdateMrrDataUpload?:  {
    __typename: "MrrDataUpload",
    createdAt: string,
    id: string,
    latestMonths?:  {
      __typename: "ModelMonthConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    payerMrrs?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    s3Key: string,
    status: AnalyticsImportStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateNoteBlockSubscriptionVariables = {
  filter?: ModelSubscriptionNoteBlockFilterInput | null,
  owner?: string | null,
};

export type OnUpdateNoteBlockSubscription = {
  onUpdateNoteBlock?:  {
    __typename: "NoteBlock",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    content?: string | null,
    createdAt: string,
    formatVersion: number,
    id: string,
    owner?: string | null,
    people?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    todo?:  {
      __typename: "Todo",
      createdAt: string,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      status: TodoStatus,
      todo: string,
      updatedAt: string,
    } | null,
    todoId?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNoteBlockPersonSubscriptionVariables = {
  filter?: ModelSubscriptionNoteBlockPersonFilterInput | null,
  owner?: string | null,
};

export type OnUpdateNoteBlockPersonSubscription = {
  onUpdateNoteBlockPerson?:  {
    __typename: "NoteBlockPerson",
    createdAt: string,
    id: string,
    noteBlock?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    noteBlockId: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNotesBibleChapterSubscriptionVariables = {
  filter?: ModelSubscriptionNotesBibleChapterFilterInput | null,
  owner?: string | null,
};

export type OnUpdateNotesBibleChapterSubscription = {
  onUpdateNotesBibleChapter?:  {
    __typename: "NotesBibleChapter",
    book?:  {
      __typename: "BookOfBible",
      alias: string,
      book: string,
      createdAt: string,
      id: string,
      noOfChapters?: number | null,
      notionId?: number | null,
      owner?: string | null,
      section: Section,
      updatedAt: string,
    } | null,
    bookId: string,
    chapter: number,
    createdAt: string,
    formatVersion?: number | null,
    id: string,
    note?: string | null,
    noteJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePayerAccountSubscriptionVariables = {
  filter?: ModelSubscriptionPayerAccountFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePayerAccountSubscription = {
  onUpdatePayerAccount?:  {
    __typename: "PayerAccount",
    accounts?:  {
      __typename: "ModelAccountPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    awsAccountNumber: string,
    createdAt: string,
    financials?:  {
      __typename: "ModelPayerAccountMrrConnection",
      nextToken?: string | null,
    } | null,
    isViaReseller?: boolean | null,
    mainContact?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    mainContactId?: string | null,
    notes?: string | null,
    owner?: string | null,
    reseller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    resellerId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePayerAccountMrrSubscriptionVariables = {
  filter?: ModelSubscriptionPayerAccountMrrFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePayerAccountMrrSubscription = {
  onUpdatePayerAccountMrr?:  {
    __typename: "PayerAccountMrr",
    awsAccountNumber: string,
    companyName: string,
    createdAt: string,
    id: string,
    isEstimated: boolean,
    isReseller: boolean,
    month?:  {
      __typename: "Month",
      createdAt: string,
      id: string,
      latestUploadId: string,
      month: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    monthId: string,
    mrr?: number | null,
    owner?: string | null,
    payerAccount?:  {
      __typename: "PayerAccount",
      awsAccountNumber: string,
      createdAt: string,
      isViaReseller?: boolean | null,
      mainContactId?: string | null,
      notes?: string | null,
      owner?: string | null,
      resellerId?: string | null,
      updatedAt: string,
    } | null,
    updatedAt: string,
    upload?:  {
      __typename: "MrrDataUpload",
      createdAt: string,
      id: string,
      owner?: string | null,
      s3Key: string,
      status: AnalyticsImportStatus,
      updatedAt: string,
    } | null,
    uploadId: string,
  } | null,
};

export type OnUpdatePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePersonSubscription = {
  onUpdatePerson?:  {
    __typename: "Person",
    accountLearnings?:  {
      __typename: "ModelAccountLearningPersonConnection",
      nextToken?: string | null,
    } | null,
    accounts?:  {
      __typename: "ModelPersonAccountConnection",
      nextToken?: string | null,
    } | null,
    birthday?: string | null,
    createdAt: string,
    dateOfDeath?: string | null,
    details?:  {
      __typename: "ModelPersonDetailConnection",
      nextToken?: string | null,
    } | null,
    howToSay?: string | null,
    id: string,
    learnings?:  {
      __typename: "ModelPersonLearningConnection",
      nextToken?: string | null,
    } | null,
    meetings?:  {
      __typename: "ModelMeetingParticipantConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    noteBlocks?:  {
      __typename: "ModelNoteBlockPersonConnection",
      nextToken?: string | null,
    } | null,
    notionId?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      name?: string | null,
      personId?: string | null,
      profileId: string,
      profilePicture?: string | null,
      updatedAt: string,
    } | null,
    relationshipsFrom?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    relationshipsTo?:  {
      __typename: "ModelPersonRelationshipConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonAccountSubscriptionVariables = {
  filter?: ModelSubscriptionPersonAccountFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePersonAccountSubscription = {
  onUpdatePersonAccount?:  {
    __typename: "PersonAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    createdAt: string,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    position?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonDetailSubscriptionVariables = {
  filter?: ModelSubscriptionPersonDetailFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePersonDetailSubscription = {
  onUpdatePersonDetail?:  {
    __typename: "PersonDetail",
    createdAt: string,
    detail: string,
    id: string,
    label: PersonDetailsEnum,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonLearningSubscriptionVariables = {
  filter?: ModelSubscriptionPersonLearningFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePersonLearningSubscription = {
  onUpdatePersonLearning?:  {
    __typename: "PersonLearning",
    createdAt: string,
    id: string,
    learnedOn?: string | null,
    learning?: string | null,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId: string,
    prayer?: PrayerStatus | null,
    status: LearningStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonRelationshipSubscriptionVariables = {
  filter?: ModelSubscriptionPersonRelationshipFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePersonRelationshipSubscription = {
  onUpdatePersonRelationship?:  {
    __typename: "PersonRelationship",
    createdAt: string,
    date?: string | null,
    endDate?: string | null,
    id: string,
    owner?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    relatedPerson?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    relatedPersonId?: string | null,
    typeName?: RelationshipTypeEnum | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectActivitySubscriptionVariables = {
  filter?: ModelSubscriptionProjectActivityFilterInput | null,
  owner?: string | null,
};

export type OnUpdateProjectActivitySubscription = {
  onUpdateProjectActivity?:  {
    __typename: "ProjectActivity",
    activity?:  {
      __typename: "Activity",
      createdAt: string,
      finishedOn?: string | null,
      formatVersion?: number | null,
      id: string,
      meetingActivitiesId?: string | null,
      name?: string | null,
      noteBlockIds?: Array< string > | null,
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    activityId: string,
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionProjectsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateProjectsSubscription = {
  onUpdateProjects?:  {
    __typename: "Projects",
    accounts?:  {
      __typename: "ModelAccountProjectsConnection",
      nextToken?: string | null,
    } | null,
    activities?:  {
      __typename: "ModelProjectActivityConnection",
      nextToken?: string | null,
    } | null,
    batches?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    context: Context,
    createdAt: string,
    crmProjects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    dayPlans?:  {
      __typename: "ModelDailyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    done?: boolean | null,
    doneOn?: string | null,
    dueOn?: string | null,
    formatVersion?: number | null,
    id: string,
    myNextActions?: string | null,
    myNextActionsJson?: string | null,
    notionId?: number | null,
    onHoldTill?: string | null,
    order?: number | null,
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    partner?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      mainColor?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      shortName?: string | null,
      updatedAt: string,
    } | null,
    partnerId?: string | null,
    pinned: ProjectPinned,
    project: string,
    tasksSummary?: string | null,
    tasksSummaryUpdatedAt?: string | null,
    updatedAt: string,
    weekPlans?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    weeklyReviews?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateSixWeekBatchSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekBatchFilterInput | null,
  owner?: string | null,
};

export type OnUpdateSixWeekBatchSubscription = {
  onUpdateSixWeekBatch?:  {
    __typename: "SixWeekBatch",
    appetite?: SixWeekBatchAppetite | null,
    context?: Context | null,
    createdAt: string,
    createdOn?: string | null,
    hours?: number | null,
    id: string,
    idea: string,
    noGos?: string | null,
    notionId?: number | null,
    owner?: string | null,
    problem?: string | null,
    projects?:  {
      __typename: "ModelSixWeekBatchProjectsConnection",
      nextToken?: string | null,
    } | null,
    risks?: string | null,
    sixWeekCycle?:  {
      __typename: "SixWeekCycle",
      createdAt: string,
      id: string,
      name: string,
      owner?: string | null,
      startDate?: string | null,
      updatedAt: string,
    } | null,
    sixWeekCycleBatchesId: string,
    solution?: string | null,
    status?: SixWeekBatchStatus | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateSixWeekBatchProjectsSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekBatchProjectsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateSixWeekBatchProjectsSubscription = {
  onUpdateSixWeekBatchProjects?:  {
    __typename: "SixWeekBatchProjects",
    createdAt: string,
    id: string,
    owner?: string | null,
    projects?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectsId: string,
    sixWeekBatch?:  {
      __typename: "SixWeekBatch",
      appetite?: SixWeekBatchAppetite | null,
      context?: Context | null,
      createdAt: string,
      createdOn?: string | null,
      hours?: number | null,
      id: string,
      idea: string,
      noGos?: string | null,
      notionId?: number | null,
      owner?: string | null,
      problem?: string | null,
      risks?: string | null,
      sixWeekCycleBatchesId: string,
      solution?: string | null,
      status?: SixWeekBatchStatus | null,
      updatedAt: string,
    } | null,
    sixWeekBatchId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSixWeekCycleSubscriptionVariables = {
  filter?: ModelSubscriptionSixWeekCycleFilterInput | null,
  owner?: string | null,
};

export type OnUpdateSixWeekCycleSubscription = {
  onUpdateSixWeekCycle?:  {
    __typename: "SixWeekCycle",
    batches?:  {
      __typename: "ModelSixWeekBatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    name: string,
    owner?: string | null,
    startDate?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTerritorySubscriptionVariables = {
  filter?: ModelSubscriptionTerritoryFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTerritorySubscription = {
  onUpdateTerritory?:  {
    __typename: "Territory",
    accounts?:  {
      __typename: "ModelAccountTerritoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    crmId?: string | null,
    id: string,
    name?: string | null,
    owner?: string | null,
    responsibilities?:  {
      __typename: "ModelTerritoryResponsibilityConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTerritoryResponsibilitySubscriptionVariables = {
  filter?: ModelSubscriptionTerritoryResponsibilityFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTerritoryResponsibilitySubscription = {
  onUpdateTerritoryResponsibility?:  {
    __typename: "TerritoryResponsibility",
    createdAt: string,
    id: string,
    owner?: string | null,
    quota?: number | null,
    startDate: string,
    territory?:  {
      __typename: "Territory",
      createdAt: string,
      crmId?: string | null,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    territoryId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTodoSubscription = {
  onUpdateTodo?:  {
    __typename: "Todo",
    activity?:  {
      __typename: "NoteBlock",
      activityId: string,
      content?: string | null,
      createdAt: string,
      formatVersion: number,
      id: string,
      owner?: string | null,
      todoId?: string | null,
      type: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    dailyTodos?:  {
      __typename: "ModelDailyPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    doneOn?: string | null,
    id: string,
    owner?: string | null,
    status: TodoStatus,
    todo: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  profileId?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    person?:  {
      __typename: "Person",
      birthday?: string | null,
      createdAt: string,
      dateOfDeath?: string | null,
      howToSay?: string | null,
      id: string,
      name: string,
      notionId?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    personId?: string | null,
    profileId: string,
    profilePicture?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateWeeklyPlanSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyPlanFilterInput | null,
  owner?: string | null,
};

export type OnUpdateWeeklyPlanSubscription = {
  onUpdateWeeklyPlan?:  {
    __typename: "WeeklyPlan",
    createdAt: string,
    crmUpdateSkipped?: boolean | null,
    financialUpdateSkipped?: boolean | null,
    id: string,
    inboxSkipped?: boolean | null,
    owner?: string | null,
    projects?:  {
      __typename: "ModelWeeklyPlanProjectConnection",
      nextToken?: string | null,
    } | null,
    startDate: string,
    status: PlanningStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateWeeklyPlanProjectSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyPlanProjectFilterInput | null,
  owner?: string | null,
};

export type OnUpdateWeeklyPlanProjectSubscription = {
  onUpdateWeeklyPlanProject?:  {
    __typename: "WeeklyPlanProject",
    createdAt: string,
    id: string,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    updatedAt: string,
    weekPlan?:  {
      __typename: "WeeklyPlan",
      createdAt: string,
      crmUpdateSkipped?: boolean | null,
      financialUpdateSkipped?: boolean | null,
      id: string,
      inboxSkipped?: boolean | null,
      owner?: string | null,
      startDate: string,
      status: PlanningStatus,
      updatedAt: string,
    } | null,
    weekPlanId: string,
  } | null,
};

export type OnUpdateWeeklyReviewSubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyReviewFilterInput | null,
  owner?: string | null,
};

export type OnUpdateWeeklyReviewSubscription = {
  onUpdateWeeklyReview?:  {
    __typename: "WeeklyReview",
    createdAt: string,
    date: string,
    entries?:  {
      __typename: "ModelWeeklyReviewEntryConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    owner?: string | null,
    status: WeeklyReviewStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateWeeklyReviewEntrySubscriptionVariables = {
  filter?: ModelSubscriptionWeeklyReviewEntryFilterInput | null,
  owner?: string | null,
};

export type OnUpdateWeeklyReviewEntrySubscription = {
  onUpdateWeeklyReviewEntry?:  {
    __typename: "WeeklyReviewEntry",
    category: WeeklyReviewCategory,
    content?: string | null,
    createdAt: string,
    generatedContent?: string | null,
    id: string,
    isEdited?: boolean | null,
    owner?: string | null,
    project?:  {
      __typename: "Projects",
      context: Context,
      createdAt: string,
      done?: boolean | null,
      doneOn?: string | null,
      dueOn?: string | null,
      formatVersion?: number | null,
      id: string,
      myNextActions?: string | null,
      myNextActionsJson?: string | null,
      notionId?: number | null,
      onHoldTill?: string | null,
      order?: number | null,
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      partnerId?: string | null,
      pinned: ProjectPinned,
      project: string,
      tasksSummary?: string | null,
      tasksSummaryUpdatedAt?: string | null,
      updatedAt: string,
    } | null,
    projectId: string,
    review?:  {
      __typename: "WeeklyReview",
      createdAt: string,
      date: string,
      id: string,
      owner?: string | null,
      status: WeeklyReviewStatus,
      updatedAt: string,
    } | null,
    reviewId: string,
    updatedAt: string,
  } | null,
};
