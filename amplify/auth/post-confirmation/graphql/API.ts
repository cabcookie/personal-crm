/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Account = {
  __typename: "Account",
  accountSubsidiariesId?: string | null,
  controller?: Account | null,
  createdAt: string,
  crmId?: string | null,
  formatVersion?: number | null,
  id: string,
  introduction?: string | null,
  introductionJson?: string | null,
  name: string,
  notionId?: number | null,
  order?: number | null,
  owner?: string | null,
  payerAccounts?: ModelPayerAccountConnection | null,
  people?: ModelPersonAccountConnection | null,
  projects?: ModelAccountProjectsConnection | null,
  subsidiaries?: ModelAccountConnection | null,
  territories?: ModelAccountTerritoryConnection | null,
  updatedAt: string,
};

export type ModelPayerAccountConnection = {
  __typename: "ModelPayerAccountConnection",
  items:  Array<PayerAccount | null >,
  nextToken?: string | null,
};

export type PayerAccount = {
  __typename: "PayerAccount",
  account?: Account | null,
  accountId: string,
  awsAccountNumber: string,
  createdAt: string,
  owner?: string | null,
  updatedAt: string,
};

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

export type Person = {
  __typename: "Person",
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
  notionId?: number | null,
  owner?: string | null,
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
  dayTasks?: ModelDayProjectTaskConnection | null,
  done?: boolean | null,
  doneOn?: string | null,
  dueOn?: string | null,
  formatVersion?: number | null,
  id: string,
  myNextActions?: string | null,
  myNextActionsJson?: string | null,
  notionId?: number | null,
  onHoldTill?: string | null,
  othersNextActions?: string | null,
  othersNextActionsJson?: string | null,
  owner?: string | null,
  project: string,
  todos?: ModelDayPlanTodoConnection | null,
  updatedAt: string,
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
  annualRecurringRevenue?: number | null,
  closeDate: string,
  createdAt: string,
  crmId?: string | null,
  id: string,
  isMarketplace?: boolean | null,
  name: string,
  owner?: string | null,
  projects?: ModelCrmProjectProjectsConnection | null,
  stage: string,
  totalContractVolume?: number | null,
  updatedAt: string,
};

export type ModelDayProjectTaskConnection = {
  __typename: "ModelDayProjectTaskConnection",
  items:  Array<DayProjectTask | null >,
  nextToken?: string | null,
};

export type DayProjectTask = {
  __typename: "DayProjectTask",
  createdAt: string,
  dayPlan?: DayPlan | null,
  dayPlanProjectTasksId: string,
  done?: boolean | null,
  id: string,
  owner?: string | null,
  projects?: Projects | null,
  projectsDayTasksId?: string | null,
  task: string,
  updatedAt: string,
};

export type DayPlan = {
  __typename: "DayPlan",
  context: Context,
  createdAt: string,
  day: string,
  dayGoal: string,
  done: boolean,
  id: string,
  owner?: string | null,
  projectTasks?: ModelDayProjectTaskConnection | null,
  tasks?: ModelNonProjectTaskConnection | null,
  todos?: ModelDayPlanTodoConnection | null,
  updatedAt: string,
};

export type ModelNonProjectTaskConnection = {
  __typename: "ModelNonProjectTaskConnection",
  items:  Array<NonProjectTask | null >,
  nextToken?: string | null,
};

export type NonProjectTask = {
  __typename: "NonProjectTask",
  context?: Context | null,
  createdAt: string,
  dayPlan?: DayPlan | null,
  dayPlanTasksId: string,
  done?: boolean | null,
  id: string,
  notionId?: number | null,
  owner?: string | null,
  task: string,
  updatedAt: string,
};

export type ModelDayPlanTodoConnection = {
  __typename: "ModelDayPlanTodoConnection",
  items:  Array<DayPlanTodo | null >,
  nextToken?: string | null,
};

export type DayPlanTodo = {
  __typename: "DayPlanTodo",
  createdAt: string,
  dayPlan?: DayPlan | null,
  dayPlanTodosId: string,
  done: boolean,
  doneOn?: string | null,
  id: string,
  owner?: string | null,
  project?: Projects | null,
  projectsTodosId?: string | null,
  todo: string,
  updatedAt: string,
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

export type CurrentContext = {
  __typename: "CurrentContext",
  context: Context,
  createdAt: string,
  id: string,
  owner?: string | null,
  updatedAt: string,
};

export type Inbox = {
  __typename: "Inbox",
  createdAt: string,
  formatVersion?: number | null,
  id: string,
  movedToActivityId?: string | null,
  note?: string | null,
  noteJson?: string | null,
  owner?: string | null,
  status: string,
  updatedAt: string,
};

export type User = {
  __typename: "User",
  createdAt: string,
  email?: string | null,
  name?: string | null,
  profileId: string,
  updatedAt: string,
};

export type UserProfile = {
  __typename: "UserProfile",
  createdAt: string,
  email?: string | null,
  id: string,
  name?: string | null,
  profileOwner?: string | null,
  updatedAt: string,
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

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


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
  name?: ModelStringInput | null,
  not?: ModelAccountFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelAccountFilterInput | null > | null,
  order?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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

export type ModelActivityFilterInput = {
  and?: Array< ModelActivityFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  finishedOn?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  meetingActivitiesId?: ModelIDInput | null,
  not?: ModelActivityFilterInput | null,
  notes?: ModelStringInput | null,
  notesJson?: ModelStringInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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
  and?: Array< ModelCrmProjectFilterInput | null > | null,
  annualRecurringRevenue?: ModelIntInput | null,
  closeDate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isMarketplace?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelCrmProjectFilterInput | null,
  or?: Array< ModelCrmProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  totalContractVolume?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
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

export type ModelContextInput = {
  eq?: Context | null,
  ne?: Context | null,
};

export type ModelCurrentContextConnection = {
  __typename: "ModelCurrentContextConnection",
  items:  Array<CurrentContext | null >,
  nextToken?: string | null,
};

export type ModelDayPlanTodoFilterInput = {
  and?: Array< ModelDayPlanTodoFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dayPlanTodosId?: ModelIDInput | null,
  done?: ModelBooleanInput | null,
  doneOn?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelDayPlanTodoFilterInput | null,
  or?: Array< ModelDayPlanTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsTodosId?: ModelIDInput | null,
  todo?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDayPlanFilterInput = {
  and?: Array< ModelDayPlanFilterInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  day?: ModelStringInput | null,
  dayGoal?: ModelStringInput | null,
  done?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  not?: ModelDayPlanFilterInput | null,
  or?: Array< ModelDayPlanFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDayPlanConnection = {
  __typename: "ModelDayPlanConnection",
  items:  Array<DayPlan | null >,
  nextToken?: string | null,
};

export type ModelDayProjectTaskFilterInput = {
  and?: Array< ModelDayProjectTaskFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dayPlanProjectTasksId?: ModelIDInput | null,
  done?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  not?: ModelDayProjectTaskFilterInput | null,
  or?: Array< ModelDayProjectTaskFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsDayTasksId?: ModelIDInput | null,
  task?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelInboxFilterInput = {
  and?: Array< ModelInboxFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  id?: ModelIDInput | null,
  movedToActivityId?: ModelStringInput | null,
  not?: ModelInboxFilterInput | null,
  note?: ModelStringInput | null,
  noteJson?: ModelStringInput | null,
  or?: Array< ModelInboxFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelInboxConnection = {
  __typename: "ModelInboxConnection",
  items:  Array<Inbox | null >,
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

export type ModelNonProjectTaskFilterInput = {
  and?: Array< ModelNonProjectTaskFilterInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  dayPlanTasksId?: ModelIDInput | null,
  done?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  not?: ModelNonProjectTaskFilterInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelNonProjectTaskFilterInput | null > | null,
  owner?: ModelStringInput | null,
  task?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPayerAccountFilterInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelPayerAccountFilterInput | null > | null,
  awsAccountNumber?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPayerAccountFilterInput | null,
  or?: Array< ModelPayerAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
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
  updatedAt?: ModelStringInput | null,
};

export type ModelPrayerStatusInput = {
  eq?: PrayerStatus | null,
  ne?: PrayerStatus | null,
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
  othersNextActions?: ModelStringInput | null,
  othersNextActionsJson?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  project?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelProjectsConnection = {
  __typename: "ModelProjectsConnection",
  items:  Array<Projects | null >,
  nextToken?: string | null,
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

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserProfileFilterInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  profileOwner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
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
  profileId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelAccountConditionInput = {
  accountSubsidiariesId?: ModelIDInput | null,
  and?: Array< ModelAccountConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  introduction?: ModelStringInput | null,
  introductionJson?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelAccountConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelAccountConditionInput | null > | null,
  order?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAccountInput = {
  accountSubsidiariesId?: string | null,
  crmId?: string | null,
  formatVersion?: number | null,
  id?: string | null,
  introduction?: string | null,
  introductionJson?: string | null,
  name: string,
  notionId?: number | null,
  order?: number | null,
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
  not?: ModelActivityConditionInput | null,
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
  notes?: string | null,
  notesJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type ModelCrmProjectConditionInput = {
  and?: Array< ModelCrmProjectConditionInput | null > | null,
  annualRecurringRevenue?: ModelIntInput | null,
  closeDate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  crmId?: ModelStringInput | null,
  isMarketplace?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelCrmProjectConditionInput | null,
  or?: Array< ModelCrmProjectConditionInput | null > | null,
  owner?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  totalContractVolume?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCrmProjectInput = {
  annualRecurringRevenue?: number | null,
  closeDate: string,
  crmId?: string | null,
  id?: string | null,
  isMarketplace?: boolean | null,
  name: string,
  owner?: string | null,
  stage: string,
  totalContractVolume?: number | null,
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

export type ModelDayPlanConditionInput = {
  and?: Array< ModelDayPlanConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  day?: ModelStringInput | null,
  dayGoal?: ModelStringInput | null,
  done?: ModelBooleanInput | null,
  not?: ModelDayPlanConditionInput | null,
  or?: Array< ModelDayPlanConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDayPlanInput = {
  context: Context,
  day: string,
  dayGoal: string,
  done: boolean,
  id?: string | null,
  owner?: string | null,
};

export type ModelDayPlanTodoConditionInput = {
  and?: Array< ModelDayPlanTodoConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dayPlanTodosId?: ModelIDInput | null,
  done?: ModelBooleanInput | null,
  doneOn?: ModelStringInput | null,
  not?: ModelDayPlanTodoConditionInput | null,
  or?: Array< ModelDayPlanTodoConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectsTodosId?: ModelIDInput | null,
  todo?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDayPlanTodoInput = {
  dayPlanTodosId: string,
  done: boolean,
  doneOn?: string | null,
  id?: string | null,
  owner?: string | null,
  projectsTodosId?: string | null,
  todo: string,
};

export type ModelDayProjectTaskConditionInput = {
  and?: Array< ModelDayProjectTaskConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dayPlanProjectTasksId?: ModelIDInput | null,
  done?: ModelBooleanInput | null,
  not?: ModelDayProjectTaskConditionInput | null,
  or?: Array< ModelDayProjectTaskConditionInput | null > | null,
  owner?: ModelStringInput | null,
  projectsDayTasksId?: ModelIDInput | null,
  task?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDayProjectTaskInput = {
  dayPlanProjectTasksId: string,
  done?: boolean | null,
  id?: string | null,
  owner?: string | null,
  projectsDayTasksId?: string | null,
  task: string,
};

export type ModelInboxConditionInput = {
  and?: Array< ModelInboxConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  formatVersion?: ModelIntInput | null,
  movedToActivityId?: ModelStringInput | null,
  not?: ModelInboxConditionInput | null,
  note?: ModelStringInput | null,
  noteJson?: ModelStringInput | null,
  or?: Array< ModelInboxConditionInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateInboxInput = {
  formatVersion?: number | null,
  id?: string | null,
  movedToActivityId?: string | null,
  note?: string | null,
  noteJson?: string | null,
  owner?: string | null,
  status: string,
};

export type ModelMeetingConditionInput = {
  and?: Array< ModelMeetingConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
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
  id?: string | null,
  meetingId: string,
  owner?: string | null,
  personId: string,
};

export type ModelNonProjectTaskConditionInput = {
  and?: Array< ModelNonProjectTaskConditionInput | null > | null,
  context?: ModelContextInput | null,
  createdAt?: ModelStringInput | null,
  dayPlanTasksId?: ModelIDInput | null,
  done?: ModelBooleanInput | null,
  not?: ModelNonProjectTaskConditionInput | null,
  notionId?: ModelIntInput | null,
  or?: Array< ModelNonProjectTaskConditionInput | null > | null,
  owner?: ModelStringInput | null,
  task?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateNonProjectTaskInput = {
  context?: Context | null,
  dayPlanTasksId: string,
  done?: boolean | null,
  id?: string | null,
  notionId?: number | null,
  owner?: string | null,
  task: string,
};

export type ModelPayerAccountConditionInput = {
  accountId?: ModelIDInput | null,
  and?: Array< ModelPayerAccountConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelPayerAccountConditionInput | null,
  or?: Array< ModelPayerAccountConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePayerAccountInput = {
  accountId: string,
  awsAccountNumber: string,
  owner?: string | null,
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
  updatedAt?: ModelStringInput | null,
};

export type CreatePersonLearningInput = {
  id?: string | null,
  learnedOn?: string | null,
  learning?: string | null,
  owner?: string | null,
  personId: string,
  prayer?: PrayerStatus | null,
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
  othersNextActions?: ModelStringInput | null,
  othersNextActionsJson?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  project?: ModelStringInput | null,
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
  othersNextActions?: string | null,
  othersNextActionsJson?: string | null,
  owner?: string | null,
  project: string,
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

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  profileId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  email?: string | null,
  name?: string | null,
  profileId: string,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserProfileConditionInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  profileOwner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  email?: string | null,
  id?: string | null,
  name?: string | null,
  profileOwner?: string | null,
};

export type DeleteAccountInput = {
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

export type DeleteCrmProjectInput = {
  id: string,
};

export type DeleteCrmProjectProjectsInput = {
  id: string,
};

export type DeleteCurrentContextInput = {
  id: string,
};

export type DeleteDayPlanInput = {
  id: string,
};

export type DeleteDayPlanTodoInput = {
  id: string,
};

export type DeleteDayProjectTaskInput = {
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

export type DeleteNonProjectTaskInput = {
  id: string,
};

export type DeletePayerAccountInput = {
  awsAccountNumber: string,
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

export type DeleteUserInput = {
  profileId: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type UpdateAccountInput = {
  accountSubsidiariesId?: string | null,
  crmId?: string | null,
  formatVersion?: number | null,
  id: string,
  introduction?: string | null,
  introductionJson?: string | null,
  name?: string | null,
  notionId?: number | null,
  order?: number | null,
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
  notes?: string | null,
  notesJson?: string | null,
  notionId?: number | null,
  owner?: string | null,
};

export type UpdateCrmProjectInput = {
  annualRecurringRevenue?: number | null,
  closeDate?: string | null,
  crmId?: string | null,
  id: string,
  isMarketplace?: boolean | null,
  name?: string | null,
  owner?: string | null,
  stage?: string | null,
  totalContractVolume?: number | null,
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

export type UpdateDayPlanInput = {
  context?: Context | null,
  day?: string | null,
  dayGoal?: string | null,
  done?: boolean | null,
  id: string,
  owner?: string | null,
};

export type UpdateDayPlanTodoInput = {
  dayPlanTodosId?: string | null,
  done?: boolean | null,
  doneOn?: string | null,
  id: string,
  owner?: string | null,
  projectsTodosId?: string | null,
  todo?: string | null,
};

export type UpdateDayProjectTaskInput = {
  dayPlanProjectTasksId?: string | null,
  done?: boolean | null,
  id: string,
  owner?: string | null,
  projectsDayTasksId?: string | null,
  task?: string | null,
};

export type UpdateInboxInput = {
  formatVersion?: number | null,
  id: string,
  movedToActivityId?: string | null,
  note?: string | null,
  noteJson?: string | null,
  owner?: string | null,
  status?: string | null,
};

export type UpdateMeetingInput = {
  context?: Context | null,
  id: string,
  meetingOn?: string | null,
  notionId?: number | null,
  owner?: string | null,
  topic?: string | null,
};

export type UpdateMeetingParticipantInput = {
  id: string,
  meetingId?: string | null,
  owner?: string | null,
  personId?: string | null,
};

export type UpdateNonProjectTaskInput = {
  context?: Context | null,
  dayPlanTasksId?: string | null,
  done?: boolean | null,
  id: string,
  notionId?: number | null,
  owner?: string | null,
  task?: string | null,
};

export type UpdatePayerAccountInput = {
  accountId?: string | null,
  awsAccountNumber: string,
  owner?: string | null,
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
  othersNextActions?: string | null,
  othersNextActionsJson?: string | null,
  owner?: string | null,
  project?: string | null,
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

export type UpdateUserInput = {
  email?: string | null,
  name?: string | null,
  profileId: string,
};

export type UpdateUserProfileInput = {
  email?: string | null,
  id: string,
  name?: string | null,
  profileOwner?: string | null,
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
  name?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionAccountFilterInput | null > | null,
  order?: ModelSubscriptionIntInput | null,
  owner?: ModelStringInput | null,
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
  notes?: ModelSubscriptionStringInput | null,
  notesJson?: ModelSubscriptionStringInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionActivityFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionCrmProjectFilterInput = {
  and?: Array< ModelSubscriptionCrmProjectFilterInput | null > | null,
  annualRecurringRevenue?: ModelSubscriptionIntInput | null,
  closeDate?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  crmId?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isMarketplace?: ModelSubscriptionBooleanInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCrmProjectFilterInput | null > | null,
  owner?: ModelStringInput | null,
  stage?: ModelSubscriptionStringInput | null,
  totalContractVolume?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
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

export type ModelSubscriptionDayPlanFilterInput = {
  and?: Array< ModelSubscriptionDayPlanFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  day?: ModelSubscriptionStringInput | null,
  dayGoal?: ModelSubscriptionStringInput | null,
  done?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionDayPlanFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionDayPlanTodoFilterInput = {
  and?: Array< ModelSubscriptionDayPlanTodoFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dayPlanTodosId?: ModelSubscriptionIDInput | null,
  done?: ModelSubscriptionBooleanInput | null,
  doneOn?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionDayPlanTodoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsTodosId?: ModelSubscriptionIDInput | null,
  todo?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionDayProjectTaskFilterInput = {
  and?: Array< ModelSubscriptionDayProjectTaskFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dayPlanProjectTasksId?: ModelSubscriptionIDInput | null,
  done?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionDayProjectTaskFilterInput | null > | null,
  owner?: ModelStringInput | null,
  projectsDayTasksId?: ModelSubscriptionIDInput | null,
  task?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionInboxFilterInput = {
  and?: Array< ModelSubscriptionInboxFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  formatVersion?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  movedToActivityId?: ModelSubscriptionStringInput | null,
  note?: ModelSubscriptionStringInput | null,
  noteJson?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionInboxFilterInput | null > | null,
  owner?: ModelStringInput | null,
  status?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMeetingFilterInput = {
  and?: Array< ModelSubscriptionMeetingFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
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

export type ModelSubscriptionNonProjectTaskFilterInput = {
  and?: Array< ModelSubscriptionNonProjectTaskFilterInput | null > | null,
  context?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dayPlanTasksId?: ModelSubscriptionIDInput | null,
  done?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  notionId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionNonProjectTaskFilterInput | null > | null,
  owner?: ModelStringInput | null,
  task?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPayerAccountFilterInput = {
  accountId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionPayerAccountFilterInput | null > | null,
  awsAccountNumber?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPayerAccountFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
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
  othersNextActions?: ModelSubscriptionStringInput | null,
  othersNextActionsJson?: ModelSubscriptionStringInput | null,
  owner?: ModelStringInput | null,
  project?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
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

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  profileId?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  profileOwner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetAccountQueryVariables = {
  id: string,
};

export type GetAccountQuery = {
  getAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetCrmProjectQueryVariables = {
  id: string,
};

export type GetCrmProjectQuery = {
  getCrmProject?:  {
    __typename: "CrmProject",
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type GetDayPlanQueryVariables = {
  id: string,
};

export type GetDayPlanQuery = {
  getDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetDayPlanTodoQueryVariables = {
  id: string,
};

export type GetDayPlanTodoQuery = {
  getDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type GetDayProjectTaskQueryVariables = {
  id: string,
};

export type GetDayProjectTaskQuery = {
  getDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type GetNonProjectTaskQueryVariables = {
  id: string,
};

export type GetNonProjectTaskQuery = {
  getNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
    updatedAt: string,
  } | null,
};

export type GetPayerAccountQueryVariables = {
  awsAccountNumber: string,
};

export type GetPayerAccountQuery = {
  getPayerAccount?:  {
    __typename: "PayerAccount",
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetPersonQueryVariables = {
  id: string,
};

export type GetPersonQuery = {
  getPerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type GetUserQueryVariables = {
  profileId: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    name?: string | null,
    profileId: string,
    updatedAt: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
    updatedAt: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      notes?: string | null,
      notesJson?: string | null,
      notionId?: number | null,
      owner?: string | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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

export type ListDayPlanTodosQueryVariables = {
  filter?: ModelDayPlanTodoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDayPlanTodosQuery = {
  listDayPlanTodos?:  {
    __typename: "ModelDayPlanTodoConnection",
    items:  Array< {
      __typename: "DayPlanTodo",
      createdAt: string,
      dayPlanTodosId: string,
      done: boolean,
      doneOn?: string | null,
      id: string,
      owner?: string | null,
      projectsTodosId?: string | null,
      todo: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDayPlansQueryVariables = {
  filter?: ModelDayPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDayPlansQuery = {
  listDayPlans?:  {
    __typename: "ModelDayPlanConnection",
    items:  Array< {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDayProjectTasksQueryVariables = {
  filter?: ModelDayProjectTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDayProjectTasksQuery = {
  listDayProjectTasks?:  {
    __typename: "ModelDayProjectTaskConnection",
    items:  Array< {
      __typename: "DayProjectTask",
      createdAt: string,
      dayPlanProjectTasksId: string,
      done?: boolean | null,
      id: string,
      owner?: string | null,
      projectsDayTasksId?: string | null,
      task: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListInboxByStatusQueryVariables = {
  filter?: ModelInboxFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  status: string,
};

export type ListInboxByStatusQuery = {
  listInboxByStatus?:  {
    __typename: "ModelInboxConnection",
    items:  Array< {
      __typename: "Inbox",
      createdAt: string,
      formatVersion?: number | null,
      id: string,
      movedToActivityId?: string | null,
      note?: string | null,
      noteJson?: string | null,
      owner?: string | null,
      status: string,
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
      movedToActivityId?: string | null,
      note?: string | null,
      noteJson?: string | null,
      owner?: string | null,
      status: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMeetingParticipantByPersonIdQueryVariables = {
  filter?: ModelMeetingParticipantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  personId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListMeetingParticipantByPersonIdQuery = {
  listMeetingParticipantByPersonId?:  {
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
      meetingOn?: string | null,
      notionId?: number | null,
      owner?: string | null,
      topic: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNonProjectTasksQueryVariables = {
  filter?: ModelNonProjectTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNonProjectTasksQuery = {
  listNonProjectTasks?:  {
    __typename: "ModelNonProjectTaskConnection",
    items:  Array< {
      __typename: "NonProjectTask",
      context?: Context | null,
      createdAt: string,
      dayPlanTasksId: string,
      done?: boolean | null,
      id: string,
      notionId?: number | null,
      owner?: string | null,
      task: string,
      updatedAt: string,
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
      accountId: string,
      awsAccountNumber: string,
      createdAt: string,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      createdAt: string,
      email?: string | null,
      id: string,
      name?: string | null,
      profileOwner?: string | null,
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
      profileId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateAccountMutationVariables = {
  condition?: ModelAccountConditionInput | null,
  input: CreateAccountInput,
};

export type CreateAccountMutation = {
  createAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
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
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type CreateDayPlanMutationVariables = {
  condition?: ModelDayPlanConditionInput | null,
  input: CreateDayPlanInput,
};

export type CreateDayPlanMutation = {
  createDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateDayPlanTodoMutationVariables = {
  condition?: ModelDayPlanTodoConditionInput | null,
  input: CreateDayPlanTodoInput,
};

export type CreateDayPlanTodoMutation = {
  createDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type CreateDayProjectTaskMutationVariables = {
  condition?: ModelDayProjectTaskConditionInput | null,
  input: CreateDayProjectTaskInput,
};

export type CreateDayProjectTaskMutation = {
  createDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type CreateNonProjectTaskMutationVariables = {
  condition?: ModelNonProjectTaskConditionInput | null,
  input: CreateNonProjectTaskInput,
};

export type CreateNonProjectTaskMutation = {
  createNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
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
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePersonMutationVariables = {
  condition?: ModelPersonConditionInput | null,
  input: CreatePersonInput,
};

export type CreatePersonMutation = {
  createPerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    profileId: string,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
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
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
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
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type DeleteDayPlanMutationVariables = {
  condition?: ModelDayPlanConditionInput | null,
  input: DeleteDayPlanInput,
};

export type DeleteDayPlanMutation = {
  deleteDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteDayPlanTodoMutationVariables = {
  condition?: ModelDayPlanTodoConditionInput | null,
  input: DeleteDayPlanTodoInput,
};

export type DeleteDayPlanTodoMutation = {
  deleteDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type DeleteDayProjectTaskMutationVariables = {
  condition?: ModelDayProjectTaskConditionInput | null,
  input: DeleteDayProjectTaskInput,
};

export type DeleteDayProjectTaskMutation = {
  deleteDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type DeleteNonProjectTaskMutationVariables = {
  condition?: ModelNonProjectTaskConditionInput | null,
  input: DeleteNonProjectTaskInput,
};

export type DeleteNonProjectTaskMutation = {
  deleteNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
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
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePersonMutationVariables = {
  condition?: ModelPersonConditionInput | null,
  input: DeletePersonInput,
};

export type DeletePersonMutation = {
  deletePerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    profileId: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateAccountMutationVariables = {
  condition?: ModelAccountConditionInput | null,
  input: UpdateAccountInput,
};

export type UpdateAccountMutation = {
  updateAccount?:  {
    __typename: "Account",
    accountSubsidiariesId?: string | null,
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
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
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type UpdateDayPlanMutationVariables = {
  condition?: ModelDayPlanConditionInput | null,
  input: UpdateDayPlanInput,
};

export type UpdateDayPlanMutation = {
  updateDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateDayPlanTodoMutationVariables = {
  condition?: ModelDayPlanTodoConditionInput | null,
  input: UpdateDayPlanTodoInput,
};

export type UpdateDayPlanTodoMutation = {
  updateDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type UpdateDayProjectTaskMutationVariables = {
  condition?: ModelDayProjectTaskConditionInput | null,
  input: UpdateDayProjectTaskInput,
};

export type UpdateDayProjectTaskMutation = {
  updateDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type UpdateNonProjectTaskMutationVariables = {
  condition?: ModelNonProjectTaskConditionInput | null,
  input: UpdateNonProjectTaskInput,
};

export type UpdateNonProjectTaskMutation = {
  updateNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
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
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePersonMutationVariables = {
  condition?: ModelPersonConditionInput | null,
  input: UpdatePersonInput,
};

export type UpdatePersonMutation = {
  updatePerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    profileId: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
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
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
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
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type OnCreateDayPlanSubscriptionVariables = {
  filter?: ModelSubscriptionDayPlanFilterInput | null,
  owner?: string | null,
};

export type OnCreateDayPlanSubscription = {
  onCreateDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateDayPlanTodoSubscriptionVariables = {
  filter?: ModelSubscriptionDayPlanTodoFilterInput | null,
  owner?: string | null,
};

export type OnCreateDayPlanTodoSubscription = {
  onCreateDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDayProjectTaskSubscriptionVariables = {
  filter?: ModelSubscriptionDayProjectTaskFilterInput | null,
  owner?: string | null,
};

export type OnCreateDayProjectTaskSubscription = {
  onCreateDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type OnCreateNonProjectTaskSubscriptionVariables = {
  filter?: ModelSubscriptionNonProjectTaskFilterInput | null,
  owner?: string | null,
};

export type OnCreateNonProjectTaskSubscription = {
  onCreateNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
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
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
  owner?: string | null,
};

export type OnCreatePersonSubscription = {
  onCreatePerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    profileId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
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
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
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
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type OnDeleteDayPlanSubscriptionVariables = {
  filter?: ModelSubscriptionDayPlanFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDayPlanSubscription = {
  onDeleteDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteDayPlanTodoSubscriptionVariables = {
  filter?: ModelSubscriptionDayPlanTodoFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDayPlanTodoSubscription = {
  onDeleteDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDayProjectTaskSubscriptionVariables = {
  filter?: ModelSubscriptionDayProjectTaskFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDayProjectTaskSubscription = {
  onDeleteDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type OnDeleteNonProjectTaskSubscriptionVariables = {
  filter?: ModelSubscriptionNonProjectTaskFilterInput | null,
  owner?: string | null,
};

export type OnDeleteNonProjectTaskSubscription = {
  onDeleteNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
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
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
  owner?: string | null,
};

export type OnDeletePersonSubscription = {
  onDeletePerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    profileId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
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
    controller?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    createdAt: string,
    crmId?: string | null,
    formatVersion?: number | null,
    id: string,
    introduction?: string | null,
    introductionJson?: string | null,
    name: string,
    notionId?: number | null,
    order?: number | null,
    owner?: string | null,
    payerAccounts?:  {
      __typename: "ModelPayerAccountConnection",
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
    notes?: string | null,
    notesJson?: string | null,
    notionId?: number | null,
    owner?: string | null,
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
    annualRecurringRevenue?: number | null,
    closeDate: string,
    createdAt: string,
    crmId?: string | null,
    id: string,
    isMarketplace?: boolean | null,
    name: string,
    owner?: string | null,
    projects?:  {
      __typename: "ModelCrmProjectProjectsConnection",
      nextToken?: string | null,
    } | null,
    stage: string,
    totalContractVolume?: number | null,
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
      annualRecurringRevenue?: number | null,
      closeDate: string,
      createdAt: string,
      crmId?: string | null,
      id: string,
      isMarketplace?: boolean | null,
      name: string,
      owner?: string | null,
      stage: string,
      totalContractVolume?: number | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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

export type OnUpdateDayPlanSubscriptionVariables = {
  filter?: ModelSubscriptionDayPlanFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDayPlanSubscription = {
  onUpdateDayPlan?:  {
    __typename: "DayPlan",
    context: Context,
    createdAt: string,
    day: string,
    dayGoal: string,
    done: boolean,
    id: string,
    owner?: string | null,
    projectTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    tasks?:  {
      __typename: "ModelNonProjectTaskConnection",
      nextToken?: string | null,
    } | null,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateDayPlanTodoSubscriptionVariables = {
  filter?: ModelSubscriptionDayPlanTodoFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDayPlanTodoSubscription = {
  onUpdateDayPlanTodo?:  {
    __typename: "DayPlanTodo",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTodosId: string,
    done: boolean,
    doneOn?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsTodosId?: string | null,
    todo: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDayProjectTaskSubscriptionVariables = {
  filter?: ModelSubscriptionDayProjectTaskFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDayProjectTaskSubscription = {
  onUpdateDayProjectTask?:  {
    __typename: "DayProjectTask",
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanProjectTasksId: string,
    done?: boolean | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
      updatedAt: string,
    } | null,
    projectsDayTasksId?: string | null,
    task: string,
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
    movedToActivityId?: string | null,
    note?: string | null,
    noteJson?: string | null,
    owner?: string | null,
    status: string,
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

export type OnUpdateNonProjectTaskSubscriptionVariables = {
  filter?: ModelSubscriptionNonProjectTaskFilterInput | null,
  owner?: string | null,
};

export type OnUpdateNonProjectTaskSubscription = {
  onUpdateNonProjectTask?:  {
    __typename: "NonProjectTask",
    context?: Context | null,
    createdAt: string,
    dayPlan?:  {
      __typename: "DayPlan",
      context: Context,
      createdAt: string,
      day: string,
      dayGoal: string,
      done: boolean,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    dayPlanTasksId: string,
    done?: boolean | null,
    id: string,
    notionId?: number | null,
    owner?: string | null,
    task: string,
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
    account?:  {
      __typename: "Account",
      accountSubsidiariesId?: string | null,
      createdAt: string,
      crmId?: string | null,
      formatVersion?: number | null,
      id: string,
      introduction?: string | null,
      introductionJson?: string | null,
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    accountId: string,
    awsAccountNumber: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonSubscriptionVariables = {
  filter?: ModelSubscriptionPersonFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePersonSubscription = {
  onUpdatePerson?:  {
    __typename: "Person",
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
    notionId?: number | null,
    owner?: string | null,
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
      name: string,
      notionId?: number | null,
      order?: number | null,
      owner?: string | null,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    dayTasks?:  {
      __typename: "ModelDayProjectTaskConnection",
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
    othersNextActions?: string | null,
    othersNextActionsJson?: string | null,
    owner?: string | null,
    project: string,
    todos?:  {
      __typename: "ModelDayPlanTodoConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      othersNextActions?: string | null,
      othersNextActionsJson?: string | null,
      owner?: string | null,
      project: string,
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
    profileId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  profileOwner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    createdAt: string,
    email?: string | null,
    id: string,
    name?: string | null,
    profileOwner?: string | null,
    updatedAt: string,
  } | null,
};
