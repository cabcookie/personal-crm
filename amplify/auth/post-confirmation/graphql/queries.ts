/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAccount = /* GraphQL */ `query GetAccount($id: ID!) {
  getAccount(id: $id) {
    accountSubsidiariesId
    controller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    createdAt
    crmId
    formatVersion
    id
    introduction
    introductionJson
    name
    notionId
    order
    owner
    partnerProjects {
      nextToken
      __typename
    }
    payerAccounts {
      nextToken
      __typename
    }
    people {
      nextToken
      __typename
    }
    projects {
      nextToken
      __typename
    }
    resellingAccounts {
      nextToken
      __typename
    }
    subsidiaries {
      nextToken
      __typename
    }
    territories {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccountQueryVariables,
  APITypes.GetAccountQuery
>;
export const getAccountPayerAccount = /* GraphQL */ `query GetAccountPayerAccount($id: ID!) {
  getAccountPayerAccount(id: $id) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    accountId
    awsAccountNumber {
      awsAccountNumber
      createdAt
      isViaReseller
      mainContactId
      owner
      resellerId
      updatedAt
      __typename
    }
    awsAccountNumberId
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccountPayerAccountQueryVariables,
  APITypes.GetAccountPayerAccountQuery
>;
export const getAccountProjects = /* GraphQL */ `query GetAccountProjects($id: ID!) {
  getAccountProjects(id: $id) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    accountId
    createdAt
    id
    owner
    projects {
      context
      createdAt
      done
      doneOn
      dueOn
      formatVersion
      id
      myNextActions
      myNextActionsJson
      notionId
      onHoldTill
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      project
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccountProjectsQueryVariables,
  APITypes.GetAccountProjectsQuery
>;
export const getAccountTerritory = /* GraphQL */ `query GetAccountTerritory($id: ID!) {
  getAccountTerritory(id: $id) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    accountId
    createdAt
    id
    owner
    territory {
      createdAt
      crmId
      id
      name
      owner
      updatedAt
      __typename
    }
    territoryId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccountTerritoryQueryVariables,
  APITypes.GetAccountTerritoryQuery
>;
export const getActivity = /* GraphQL */ `query GetActivity($id: ID!) {
  getActivity(id: $id) {
    createdAt
    finishedOn
    forMeeting {
      context
      createdAt
      id
      immediateTasksDone
      meetingOn
      notionId
      owner
      topic
      updatedAt
      __typename
    }
    forProjects {
      nextToken
      __typename
    }
    formatVersion
    id
    meetingActivitiesId
    noteBlockIds
    noteBlocks {
      nextToken
      __typename
    }
    notes
    notesJson
    notionId
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetActivityQueryVariables,
  APITypes.GetActivityQuery
>;
export const getBookOfBible = /* GraphQL */ `query GetBookOfBible($id: ID!) {
  getBookOfBible(id: $id) {
    alias
    book
    chapters {
      nextToken
      __typename
    }
    createdAt
    id
    noOfChapters
    notionId
    owner
    section
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetBookOfBibleQueryVariables,
  APITypes.GetBookOfBibleQuery
>;
export const getCrmProject = /* GraphQL */ `query GetCrmProject($id: ID!) {
  getCrmProject(id: $id) {
    accountName
    annualRecurringRevenue
    closeDate
    confirmHygieneIssuesSolvedTill
    createdAt
    createdDate
    crmId
    id
    isMarketplace
    name
    nextStep
    opportunityOwner
    owner
    partnerName
    projects {
      nextToken
      __typename
    }
    stage
    stageChangedDate
    territoryName
    totalContractVolume
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCrmProjectQueryVariables,
  APITypes.GetCrmProjectQuery
>;
export const getCrmProjectImport = /* GraphQL */ `query GetCrmProjectImport($id: ID!) {
  getCrmProjectImport(id: $id) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCrmProjectImportQueryVariables,
  APITypes.GetCrmProjectImportQuery
>;
export const getCrmProjectProjects = /* GraphQL */ `query GetCrmProjectProjects($id: ID!) {
  getCrmProjectProjects(id: $id) {
    createdAt
    crmProject {
      accountName
      annualRecurringRevenue
      closeDate
      confirmHygieneIssuesSolvedTill
      createdAt
      createdDate
      crmId
      id
      isMarketplace
      name
      nextStep
      opportunityOwner
      owner
      partnerName
      stage
      stageChangedDate
      territoryName
      totalContractVolume
      type
      updatedAt
      __typename
    }
    crmProjectId
    id
    owner
    project {
      context
      createdAt
      done
      doneOn
      dueOn
      formatVersion
      id
      myNextActions
      myNextActionsJson
      notionId
      onHoldTill
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      project
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCrmProjectProjectsQueryVariables,
  APITypes.GetCrmProjectProjectsQuery
>;
export const getCurrentContext = /* GraphQL */ `query GetCurrentContext($id: ID!) {
  getCurrentContext(id: $id) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCurrentContextQueryVariables,
  APITypes.GetCurrentContextQuery
>;
export const getDailyPlan = /* GraphQL */ `query GetDailyPlan($id: ID!) {
  getDailyPlan(id: $id) {
    context
    createdAt
    day
    dayGoal
    id
    owner
    status
    todos {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDailyPlanQueryVariables,
  APITypes.GetDailyPlanQuery
>;
export const getDailyPlanTodo = /* GraphQL */ `query GetDailyPlanTodo($id: ID!) {
  getDailyPlanTodo(id: $id) {
    createdAt
    dailyPlan {
      context
      createdAt
      day
      dayGoal
      id
      owner
      status
      updatedAt
      __typename
    }
    dailyPlanId
    id
    owner
    postPoned
    todo {
      createdAt
      doneOn
      id
      owner
      status
      todo
      updatedAt
      __typename
    }
    todoId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDailyPlanTodoQueryVariables,
  APITypes.GetDailyPlanTodoQuery
>;
export const getInbox = /* GraphQL */ `query GetInbox($id: ID!) {
  getInbox(id: $id) {
    createdAt
    formatVersion
    id
    movedToActivityId
    note
    noteJson
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetInboxQueryVariables, APITypes.GetInboxQuery>;
export const getMeeting = /* GraphQL */ `query GetMeeting($id: ID!) {
  getMeeting(id: $id) {
    activities {
      nextToken
      __typename
    }
    context
    createdAt
    id
    immediateTasksDone
    meetingOn
    notionId
    owner
    participants {
      nextToken
      __typename
    }
    topic
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMeetingQueryVariables,
  APITypes.GetMeetingQuery
>;
export const getMeetingParticipant = /* GraphQL */ `query GetMeetingParticipant($id: ID!) {
  getMeetingParticipant(id: $id) {
    createdAt
    id
    meeting {
      context
      createdAt
      id
      immediateTasksDone
      meetingOn
      notionId
      owner
      topic
      updatedAt
      __typename
    }
    meetingId
    owner
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMeetingParticipantQueryVariables,
  APITypes.GetMeetingParticipantQuery
>;
export const getMonth = /* GraphQL */ `query GetMonth($id: ID!) {
  getMonth(id: $id) {
    createdAt
    id
    latestUpload {
      createdAt
      id
      owner
      s3Key
      status
      updatedAt
      __typename
    }
    latestUploadId
    month
    owner
    payerMrrs {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetMonthQueryVariables, APITypes.GetMonthQuery>;
export const getMrrDataUpload = /* GraphQL */ `query GetMrrDataUpload($id: ID!) {
  getMrrDataUpload(id: $id) {
    createdAt
    id
    latestMonths {
      nextToken
      __typename
    }
    owner
    payerMrrs {
      nextToken
      __typename
    }
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMrrDataUploadQueryVariables,
  APITypes.GetMrrDataUploadQuery
>;
export const getNoteBlock = /* GraphQL */ `query GetNoteBlock($id: ID!) {
  getNoteBlock(id: $id) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      noteBlockIds
      notes
      notesJson
      notionId
      owner
      updatedAt
      __typename
    }
    activityId
    content
    createdAt
    formatVersion
    id
    owner
    people {
      nextToken
      __typename
    }
    todo {
      createdAt
      doneOn
      id
      owner
      status
      todo
      updatedAt
      __typename
    }
    todoId
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNoteBlockQueryVariables,
  APITypes.GetNoteBlockQuery
>;
export const getNoteBlockPerson = /* GraphQL */ `query GetNoteBlockPerson($id: ID!) {
  getNoteBlockPerson(id: $id) {
    createdAt
    id
    noteBlock {
      activityId
      content
      createdAt
      formatVersion
      id
      owner
      todoId
      type
      updatedAt
      __typename
    }
    noteBlockId
    owner
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNoteBlockPersonQueryVariables,
  APITypes.GetNoteBlockPersonQuery
>;
export const getNotesBibleChapter = /* GraphQL */ `query GetNotesBibleChapter($id: ID!) {
  getNotesBibleChapter(id: $id) {
    book {
      alias
      book
      createdAt
      id
      noOfChapters
      notionId
      owner
      section
      updatedAt
      __typename
    }
    bookId
    chapter
    createdAt
    formatVersion
    id
    note
    noteJson
    notionId
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNotesBibleChapterQueryVariables,
  APITypes.GetNotesBibleChapterQuery
>;
export const getPayerAccount = /* GraphQL */ `query GetPayerAccount($awsAccountNumber: ID!) {
  getPayerAccount(awsAccountNumber: $awsAccountNumber) {
    accounts {
      nextToken
      __typename
    }
    awsAccountNumber
    createdAt
    financials {
      nextToken
      __typename
    }
    isViaReseller
    mainContact {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    mainContactId
    owner
    reseller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    resellerId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPayerAccountQueryVariables,
  APITypes.GetPayerAccountQuery
>;
export const getPayerAccountMrr = /* GraphQL */ `query GetPayerAccountMrr($id: ID!) {
  getPayerAccountMrr(id: $id) {
    awsAccountNumber
    companyName
    createdAt
    id
    isEstimated
    isReseller
    month {
      createdAt
      id
      latestUploadId
      month
      owner
      updatedAt
      __typename
    }
    monthId
    mrr
    owner
    payerAccount {
      awsAccountNumber
      createdAt
      isViaReseller
      mainContactId
      owner
      resellerId
      updatedAt
      __typename
    }
    updatedAt
    upload {
      createdAt
      id
      owner
      s3Key
      status
      updatedAt
      __typename
    }
    uploadId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPayerAccountMrrQueryVariables,
  APITypes.GetPayerAccountMrrQuery
>;
export const getPerson = /* GraphQL */ `query GetPerson($id: ID!) {
  getPerson(id: $id) {
    accounts {
      nextToken
      __typename
    }
    birthday
    createdAt
    dateOfDeath
    details {
      nextToken
      __typename
    }
    howToSay
    id
    learnings {
      nextToken
      __typename
    }
    meetings {
      nextToken
      __typename
    }
    name
    noteBlocks {
      nextToken
      __typename
    }
    notionId
    owner
    payerAccounts {
      nextToken
      __typename
    }
    profile {
      createdAt
      email
      name
      personId
      profileId
      profilePicture
      updatedAt
      __typename
    }
    relationshipsFrom {
      nextToken
      __typename
    }
    relationshipsTo {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPersonQueryVariables, APITypes.GetPersonQuery>;
export const getPersonAccount = /* GraphQL */ `query GetPersonAccount($id: ID!) {
  getPersonAccount(id: $id) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    accountId
    createdAt
    endDate
    id
    owner
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    position
    startDate
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPersonAccountQueryVariables,
  APITypes.GetPersonAccountQuery
>;
export const getPersonDetail = /* GraphQL */ `query GetPersonDetail($id: ID!) {
  getPersonDetail(id: $id) {
    createdAt
    detail
    id
    label
    owner
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPersonDetailQueryVariables,
  APITypes.GetPersonDetailQuery
>;
export const getPersonLearning = /* GraphQL */ `query GetPersonLearning($id: ID!) {
  getPersonLearning(id: $id) {
    createdAt
    id
    learnedOn
    learning
    owner
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    prayer
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPersonLearningQueryVariables,
  APITypes.GetPersonLearningQuery
>;
export const getPersonRelationship = /* GraphQL */ `query GetPersonRelationship($id: ID!) {
  getPersonRelationship(id: $id) {
    createdAt
    date
    endDate
    id
    owner
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    relatedPerson {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    relatedPersonId
    typeName
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPersonRelationshipQueryVariables,
  APITypes.GetPersonRelationshipQuery
>;
export const getProjectActivity = /* GraphQL */ `query GetProjectActivity($id: ID!) {
  getProjectActivity(id: $id) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      noteBlockIds
      notes
      notesJson
      notionId
      owner
      updatedAt
      __typename
    }
    activityId
    createdAt
    id
    owner
    projects {
      context
      createdAt
      done
      doneOn
      dueOn
      formatVersion
      id
      myNextActions
      myNextActionsJson
      notionId
      onHoldTill
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      project
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProjectActivityQueryVariables,
  APITypes.GetProjectActivityQuery
>;
export const getProjects = /* GraphQL */ `query GetProjects($id: ID!) {
  getProjects(id: $id) {
    accounts {
      nextToken
      __typename
    }
    activities {
      nextToken
      __typename
    }
    batches {
      nextToken
      __typename
    }
    context
    createdAt
    crmProjects {
      nextToken
      __typename
    }
    done
    doneOn
    dueOn
    formatVersion
    id
    myNextActions
    myNextActionsJson
    notionId
    onHoldTill
    othersNextActions
    othersNextActionsJson
    owner
    partner {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    partnerId
    project
    updatedAt
    weekPlans {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProjectsQueryVariables,
  APITypes.GetProjectsQuery
>;
export const getSixWeekBatch = /* GraphQL */ `query GetSixWeekBatch($id: ID!) {
  getSixWeekBatch(id: $id) {
    appetite
    context
    createdAt
    createdOn
    hours
    id
    idea
    noGos
    notionId
    owner
    problem
    projects {
      nextToken
      __typename
    }
    risks
    sixWeekCycle {
      createdAt
      id
      name
      owner
      startDate
      updatedAt
      __typename
    }
    sixWeekCycleBatchesId
    solution
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSixWeekBatchQueryVariables,
  APITypes.GetSixWeekBatchQuery
>;
export const getSixWeekBatchProjects = /* GraphQL */ `query GetSixWeekBatchProjects($id: ID!) {
  getSixWeekBatchProjects(id: $id) {
    createdAt
    id
    owner
    projects {
      context
      createdAt
      done
      doneOn
      dueOn
      formatVersion
      id
      myNextActions
      myNextActionsJson
      notionId
      onHoldTill
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      project
      updatedAt
      __typename
    }
    projectsId
    sixWeekBatch {
      appetite
      context
      createdAt
      createdOn
      hours
      id
      idea
      noGos
      notionId
      owner
      problem
      risks
      sixWeekCycleBatchesId
      solution
      status
      updatedAt
      __typename
    }
    sixWeekBatchId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSixWeekBatchProjectsQueryVariables,
  APITypes.GetSixWeekBatchProjectsQuery
>;
export const getSixWeekCycle = /* GraphQL */ `query GetSixWeekCycle($id: ID!) {
  getSixWeekCycle(id: $id) {
    batches {
      nextToken
      __typename
    }
    createdAt
    id
    name
    owner
    startDate
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSixWeekCycleQueryVariables,
  APITypes.GetSixWeekCycleQuery
>;
export const getTerritory = /* GraphQL */ `query GetTerritory($id: ID!) {
  getTerritory(id: $id) {
    accounts {
      nextToken
      __typename
    }
    createdAt
    crmId
    id
    name
    owner
    responsibilities {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTerritoryQueryVariables,
  APITypes.GetTerritoryQuery
>;
export const getTerritoryResponsibility = /* GraphQL */ `query GetTerritoryResponsibility($id: ID!) {
  getTerritoryResponsibility(id: $id) {
    createdAt
    id
    owner
    quota
    startDate
    territory {
      createdAt
      crmId
      id
      name
      owner
      updatedAt
      __typename
    }
    territoryId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTerritoryResponsibilityQueryVariables,
  APITypes.GetTerritoryResponsibilityQuery
>;
export const getTodo = /* GraphQL */ `query GetTodo($id: ID!) {
  getTodo(id: $id) {
    activity {
      activityId
      content
      createdAt
      formatVersion
      id
      owner
      todoId
      type
      updatedAt
      __typename
    }
    createdAt
    dailyTodos {
      nextToken
      __typename
    }
    doneOn
    id
    owner
    status
    todo
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTodoQueryVariables, APITypes.GetTodoQuery>;
export const getUser = /* GraphQL */ `query GetUser($profileId: String!) {
  getUser(profileId: $profileId) {
    createdAt
    email
    name
    person {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    personId
    profileId
    profilePicture
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const getWeeklyPlan = /* GraphQL */ `query GetWeeklyPlan($id: ID!) {
  getWeeklyPlan(id: $id) {
    createdAt
    id
    owner
    projects {
      nextToken
      __typename
    }
    startDate
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetWeeklyPlanQueryVariables,
  APITypes.GetWeeklyPlanQuery
>;
export const getWeeklyPlanProject = /* GraphQL */ `query GetWeeklyPlanProject($id: ID!) {
  getWeeklyPlanProject(id: $id) {
    createdAt
    id
    owner
    project {
      context
      createdAt
      done
      doneOn
      dueOn
      formatVersion
      id
      myNextActions
      myNextActionsJson
      notionId
      onHoldTill
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      project
      updatedAt
      __typename
    }
    projectId
    updatedAt
    weekPlan {
      createdAt
      id
      owner
      startDate
      status
      updatedAt
      __typename
    }
    weekPlanId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetWeeklyPlanProjectQueryVariables,
  APITypes.GetWeeklyPlanProjectQuery
>;
export const listAccountPayerAccountByAwsAccountNumberId = /* GraphQL */ `query ListAccountPayerAccountByAwsAccountNumberId(
  $awsAccountNumberId: ID!
  $filter: ModelAccountPayerAccountFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listAccountPayerAccountByAwsAccountNumberId(
    awsAccountNumberId: $awsAccountNumberId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      accountId
      awsAccountNumberId
      createdAt
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountPayerAccountByAwsAccountNumberIdQueryVariables,
  APITypes.ListAccountPayerAccountByAwsAccountNumberIdQuery
>;
export const listAccountPayerAccounts = /* GraphQL */ `query ListAccountPayerAccounts(
  $filter: ModelAccountPayerAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccountPayerAccounts(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      accountId
      awsAccountNumberId
      createdAt
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountPayerAccountsQueryVariables,
  APITypes.ListAccountPayerAccountsQuery
>;
export const listAccountProjects = /* GraphQL */ `query ListAccountProjects(
  $filter: ModelAccountProjectsFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccountProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      accountId
      createdAt
      id
      owner
      projectsId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountProjectsQueryVariables,
  APITypes.ListAccountProjectsQuery
>;
export const listAccountProjectsByAccountId = /* GraphQL */ `query ListAccountProjectsByAccountId(
  $accountId: ID!
  $filter: ModelAccountProjectsFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listAccountProjectsByAccountId(
    accountId: $accountId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      accountId
      createdAt
      id
      owner
      projectsId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountProjectsByAccountIdQueryVariables,
  APITypes.ListAccountProjectsByAccountIdQuery
>;
export const listAccountProjectsByProjectsId = /* GraphQL */ `query ListAccountProjectsByProjectsId(
  $filter: ModelAccountProjectsFilterInput
  $limit: Int
  $nextToken: String
  $projectsId: ID!
  $sortDirection: ModelSortDirection
) {
  listAccountProjectsByProjectsId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    projectsId: $projectsId
    sortDirection: $sortDirection
  ) {
    items {
      accountId
      createdAt
      id
      owner
      projectsId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountProjectsByProjectsIdQueryVariables,
  APITypes.ListAccountProjectsByProjectsIdQuery
>;
export const listAccountTerritories = /* GraphQL */ `query ListAccountTerritories(
  $filter: ModelAccountTerritoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccountTerritories(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      accountId
      createdAt
      id
      owner
      territoryId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountTerritoriesQueryVariables,
  APITypes.ListAccountTerritoriesQuery
>;
export const listAccounts = /* GraphQL */ `query ListAccounts(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      name
      notionId
      order
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountsQueryVariables,
  APITypes.ListAccountsQuery
>;
export const listActivities = /* GraphQL */ `query ListActivities(
  $filter: ModelActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      noteBlockIds
      notes
      notesJson
      notionId
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListActivitiesQueryVariables,
  APITypes.ListActivitiesQuery
>;
export const listBookOfBibles = /* GraphQL */ `query ListBookOfBibles(
  $filter: ModelBookOfBibleFilterInput
  $limit: Int
  $nextToken: String
) {
  listBookOfBibles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      alias
      book
      createdAt
      id
      noOfChapters
      notionId
      owner
      section
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBookOfBiblesQueryVariables,
  APITypes.ListBookOfBiblesQuery
>;
export const listByImportStatus = /* GraphQL */ `query ListByImportStatus(
  $createdAt: ModelStringKeyConditionInput
  $filter: ModelCrmProjectImportFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $status: CrmProjectImportStatus!
) {
  listByImportStatus(
    createdAt: $createdAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    status: $status
  ) {
    items {
      createdAt
      id
      owner
      s3Key
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByImportStatusQueryVariables,
  APITypes.ListByImportStatusQuery
>;
export const listByStatus = /* GraphQL */ `query ListByStatus(
  $day: ModelStringKeyConditionInput
  $filter: ModelDailyPlanFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $status: DailyPlanStatus!
) {
  listByStatus(
    day: $day
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    status: $status
  ) {
    items {
      context
      createdAt
      day
      dayGoal
      id
      owner
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByStatusQueryVariables,
  APITypes.ListByStatusQuery
>;
export const listCrmProjectImports = /* GraphQL */ `query ListCrmProjectImports(
  $filter: ModelCrmProjectImportFilterInput
  $limit: Int
  $nextToken: String
) {
  listCrmProjectImports(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      owner
      s3Key
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCrmProjectImportsQueryVariables,
  APITypes.ListCrmProjectImportsQuery
>;
export const listCrmProjectProjects = /* GraphQL */ `query ListCrmProjectProjects(
  $filter: ModelCrmProjectProjectsFilterInput
  $limit: Int
  $nextToken: String
) {
  listCrmProjectProjects(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      crmProjectId
      id
      owner
      projectId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCrmProjectProjectsQueryVariables,
  APITypes.ListCrmProjectProjectsQuery
>;
export const listCrmProjects = /* GraphQL */ `query ListCrmProjects(
  $filter: ModelCrmProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listCrmProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      accountName
      annualRecurringRevenue
      closeDate
      confirmHygieneIssuesSolvedTill
      createdAt
      createdDate
      crmId
      id
      isMarketplace
      name
      nextStep
      opportunityOwner
      owner
      partnerName
      stage
      stageChangedDate
      territoryName
      totalContractVolume
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCrmProjectsQueryVariables,
  APITypes.ListCrmProjectsQuery
>;
export const listCurrentContexts = /* GraphQL */ `query ListCurrentContexts(
  $filter: ModelCurrentContextFilterInput
  $limit: Int
  $nextToken: String
) {
  listCurrentContexts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      context
      createdAt
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCurrentContextsQueryVariables,
  APITypes.ListCurrentContextsQuery
>;
export const listDailyPlanTodos = /* GraphQL */ `query ListDailyPlanTodos(
  $filter: ModelDailyPlanTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listDailyPlanTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      dailyPlanId
      id
      owner
      postPoned
      todoId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDailyPlanTodosQueryVariables,
  APITypes.ListDailyPlanTodosQuery
>;
export const listDailyPlans = /* GraphQL */ `query ListDailyPlans(
  $filter: ModelDailyPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  listDailyPlans(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      context
      createdAt
      day
      dayGoal
      id
      owner
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDailyPlansQueryVariables,
  APITypes.ListDailyPlansQuery
>;
export const listInboxByStatus = /* GraphQL */ `query ListInboxByStatus(
  $filter: ModelInboxFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $status: ID!
) {
  listInboxByStatus(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    status: $status
  ) {
    items {
      createdAt
      formatVersion
      id
      movedToActivityId
      note
      noteJson
      owner
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInboxByStatusQueryVariables,
  APITypes.ListInboxByStatusQuery
>;
export const listInboxes = /* GraphQL */ `query ListInboxes(
  $filter: ModelInboxFilterInput
  $limit: Int
  $nextToken: String
) {
  listInboxes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      formatVersion
      id
      movedToActivityId
      note
      noteJson
      owner
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInboxesQueryVariables,
  APITypes.ListInboxesQuery
>;
export const listMeetingParticipantByPersonId = /* GraphQL */ `query ListMeetingParticipantByPersonId(
  $filter: ModelMeetingParticipantFilterInput
  $limit: Int
  $nextToken: String
  $personId: ID!
  $sortDirection: ModelSortDirection
) {
  listMeetingParticipantByPersonId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    personId: $personId
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      meetingId
      owner
      personId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeetingParticipantByPersonIdQueryVariables,
  APITypes.ListMeetingParticipantByPersonIdQuery
>;
export const listMeetingParticipants = /* GraphQL */ `query ListMeetingParticipants(
  $filter: ModelMeetingParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeetingParticipants(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      id
      meetingId
      owner
      personId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeetingParticipantsQueryVariables,
  APITypes.ListMeetingParticipantsQuery
>;
export const listMeetings = /* GraphQL */ `query ListMeetings(
  $filter: ModelMeetingFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeetings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      context
      createdAt
      id
      immediateTasksDone
      meetingOn
      notionId
      owner
      topic
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeetingsQueryVariables,
  APITypes.ListMeetingsQuery
>;
export const listMonthByLatestUploadIdAndMonth = /* GraphQL */ `query ListMonthByLatestUploadIdAndMonth(
  $filter: ModelMonthFilterInput
  $latestUploadId: ID!
  $limit: Int
  $month: ModelStringKeyConditionInput
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listMonthByLatestUploadIdAndMonth(
    filter: $filter
    latestUploadId: $latestUploadId
    limit: $limit
    month: $month
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      latestUploadId
      month
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMonthByLatestUploadIdAndMonthQueryVariables,
  APITypes.ListMonthByLatestUploadIdAndMonthQuery
>;
export const listMonths = /* GraphQL */ `query ListMonths(
  $filter: ModelMonthFilterInput
  $limit: Int
  $nextToken: String
) {
  listMonths(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      latestUploadId
      month
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMonthsQueryVariables,
  APITypes.ListMonthsQuery
>;
export const listMrrDataUploadByStatusAndCreatedAt = /* GraphQL */ `query ListMrrDataUploadByStatusAndCreatedAt(
  $createdAt: ModelStringKeyConditionInput
  $filter: ModelMrrDataUploadFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $status: AnalyticsImportStatus!
) {
  listMrrDataUploadByStatusAndCreatedAt(
    createdAt: $createdAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    status: $status
  ) {
    items {
      createdAt
      id
      owner
      s3Key
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMrrDataUploadByStatusAndCreatedAtQueryVariables,
  APITypes.ListMrrDataUploadByStatusAndCreatedAtQuery
>;
export const listMrrDataUploads = /* GraphQL */ `query ListMrrDataUploads(
  $filter: ModelMrrDataUploadFilterInput
  $limit: Int
  $nextToken: String
) {
  listMrrDataUploads(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      owner
      s3Key
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMrrDataUploadsQueryVariables,
  APITypes.ListMrrDataUploadsQuery
>;
export const listNoteBlockByType = /* GraphQL */ `query ListNoteBlockByType(
  $filter: ModelNoteBlockFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $type: String!
) {
  listNoteBlockByType(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    type: $type
  ) {
    items {
      activityId
      content
      createdAt
      formatVersion
      id
      owner
      todoId
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNoteBlockByTypeQueryVariables,
  APITypes.ListNoteBlockByTypeQuery
>;
export const listNoteBlockPeople = /* GraphQL */ `query ListNoteBlockPeople(
  $filter: ModelNoteBlockPersonFilterInput
  $limit: Int
  $nextToken: String
) {
  listNoteBlockPeople(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      noteBlockId
      owner
      personId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNoteBlockPeopleQueryVariables,
  APITypes.ListNoteBlockPeopleQuery
>;
export const listNoteBlocks = /* GraphQL */ `query ListNoteBlocks(
  $filter: ModelNoteBlockFilterInput
  $limit: Int
  $nextToken: String
) {
  listNoteBlocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      activityId
      content
      createdAt
      formatVersion
      id
      owner
      todoId
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNoteBlocksQueryVariables,
  APITypes.ListNoteBlocksQuery
>;
export const listNotesBibleChapters = /* GraphQL */ `query ListNotesBibleChapters(
  $filter: ModelNotesBibleChapterFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotesBibleChapters(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      bookId
      chapter
      createdAt
      formatVersion
      id
      note
      noteJson
      notionId
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotesBibleChaptersQueryVariables,
  APITypes.ListNotesBibleChaptersQuery
>;
export const listPayerAccountMrrByUploadId = /* GraphQL */ `query ListPayerAccountMrrByUploadId(
  $filter: ModelPayerAccountMrrFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $uploadId: ID!
) {
  listPayerAccountMrrByUploadId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    uploadId: $uploadId
  ) {
    items {
      awsAccountNumber
      companyName
      createdAt
      id
      isEstimated
      isReseller
      monthId
      mrr
      owner
      updatedAt
      uploadId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayerAccountMrrByUploadIdQueryVariables,
  APITypes.ListPayerAccountMrrByUploadIdQuery
>;
export const listPayerAccountMrrs = /* GraphQL */ `query ListPayerAccountMrrs(
  $filter: ModelPayerAccountMrrFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayerAccountMrrs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      awsAccountNumber
      companyName
      createdAt
      id
      isEstimated
      isReseller
      monthId
      mrr
      owner
      updatedAt
      uploadId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayerAccountMrrsQueryVariables,
  APITypes.ListPayerAccountMrrsQuery
>;
export const listPayerAccounts = /* GraphQL */ `query ListPayerAccounts(
  $awsAccountNumber: ID
  $filter: ModelPayerAccountFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPayerAccounts(
    awsAccountNumber: $awsAccountNumber
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      awsAccountNumber
      createdAt
      isViaReseller
      mainContactId
      owner
      resellerId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayerAccountsQueryVariables,
  APITypes.ListPayerAccountsQuery
>;
export const listPeople = /* GraphQL */ `query ListPeople(
  $filter: ModelPersonFilterInput
  $limit: Int
  $nextToken: String
) {
  listPeople(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      birthday
      createdAt
      dateOfDeath
      howToSay
      id
      name
      notionId
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPeopleQueryVariables,
  APITypes.ListPeopleQuery
>;
export const listPersonAccountByAccountId = /* GraphQL */ `query ListPersonAccountByAccountId(
  $accountId: ID!
  $filter: ModelPersonAccountFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPersonAccountByAccountId(
    accountId: $accountId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      accountId
      createdAt
      endDate
      id
      owner
      personId
      position
      startDate
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPersonAccountByAccountIdQueryVariables,
  APITypes.ListPersonAccountByAccountIdQuery
>;
export const listPersonAccounts = /* GraphQL */ `query ListPersonAccounts(
  $filter: ModelPersonAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listPersonAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      accountId
      createdAt
      endDate
      id
      owner
      personId
      position
      startDate
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPersonAccountsQueryVariables,
  APITypes.ListPersonAccountsQuery
>;
export const listPersonDetails = /* GraphQL */ `query ListPersonDetails(
  $filter: ModelPersonDetailFilterInput
  $limit: Int
  $nextToken: String
) {
  listPersonDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      detail
      id
      label
      owner
      personId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPersonDetailsQueryVariables,
  APITypes.ListPersonDetailsQuery
>;
export const listPersonLearningByPersonId = /* GraphQL */ `query ListPersonLearningByPersonId(
  $filter: ModelPersonLearningFilterInput
  $limit: Int
  $nextToken: String
  $personId: ID!
  $sortDirection: ModelSortDirection
) {
  listPersonLearningByPersonId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    personId: $personId
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      learnedOn
      learning
      owner
      personId
      prayer
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPersonLearningByPersonIdQueryVariables,
  APITypes.ListPersonLearningByPersonIdQuery
>;
export const listPersonLearnings = /* GraphQL */ `query ListPersonLearnings(
  $filter: ModelPersonLearningFilterInput
  $limit: Int
  $nextToken: String
) {
  listPersonLearnings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      learnedOn
      learning
      owner
      personId
      prayer
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPersonLearningsQueryVariables,
  APITypes.ListPersonLearningsQuery
>;
export const listPersonRelationships = /* GraphQL */ `query ListPersonRelationships(
  $filter: ModelPersonRelationshipFilterInput
  $limit: Int
  $nextToken: String
) {
  listPersonRelationships(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      date
      endDate
      id
      owner
      personId
      relatedPersonId
      typeName
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPersonRelationshipsQueryVariables,
  APITypes.ListPersonRelationshipsQuery
>;
export const listProjectActivities = /* GraphQL */ `query ListProjectActivities(
  $filter: ModelProjectActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjectActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      activityId
      createdAt
      id
      owner
      projectsId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProjectActivitiesQueryVariables,
  APITypes.ListProjectActivitiesQuery
>;
export const listProjectActivityByProjectsId = /* GraphQL */ `query ListProjectActivityByProjectsId(
  $filter: ModelProjectActivityFilterInput
  $limit: Int
  $nextToken: String
  $projectsId: ID!
  $sortDirection: ModelSortDirection
) {
  listProjectActivityByProjectsId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    projectsId: $projectsId
    sortDirection: $sortDirection
  ) {
    items {
      activityId
      createdAt
      id
      owner
      projectsId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProjectActivityByProjectsIdQueryVariables,
  APITypes.ListProjectActivityByProjectsIdQuery
>;
export const listProjects = /* GraphQL */ `query ListProjects(
  $filter: ModelProjectsFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      context
      createdAt
      done
      doneOn
      dueOn
      formatVersion
      id
      myNextActions
      myNextActionsJson
      notionId
      onHoldTill
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      project
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProjectsQueryVariables,
  APITypes.ListProjectsQuery
>;
export const listSixWeekBatchProjects = /* GraphQL */ `query ListSixWeekBatchProjects(
  $filter: ModelSixWeekBatchProjectsFilterInput
  $limit: Int
  $nextToken: String
) {
  listSixWeekBatchProjects(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      id
      owner
      projectsId
      sixWeekBatchId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSixWeekBatchProjectsQueryVariables,
  APITypes.ListSixWeekBatchProjectsQuery
>;
export const listSixWeekBatches = /* GraphQL */ `query ListSixWeekBatches(
  $filter: ModelSixWeekBatchFilterInput
  $limit: Int
  $nextToken: String
) {
  listSixWeekBatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      appetite
      context
      createdAt
      createdOn
      hours
      id
      idea
      noGos
      notionId
      owner
      problem
      risks
      sixWeekCycleBatchesId
      solution
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSixWeekBatchesQueryVariables,
  APITypes.ListSixWeekBatchesQuery
>;
export const listSixWeekCycles = /* GraphQL */ `query ListSixWeekCycles(
  $filter: ModelSixWeekCycleFilterInput
  $limit: Int
  $nextToken: String
) {
  listSixWeekCycles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      name
      owner
      startDate
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSixWeekCyclesQueryVariables,
  APITypes.ListSixWeekCyclesQuery
>;
export const listTerritories = /* GraphQL */ `query ListTerritories(
  $filter: ModelTerritoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listTerritories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      crmId
      id
      name
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTerritoriesQueryVariables,
  APITypes.ListTerritoriesQuery
>;
export const listTerritoryResponsibilities = /* GraphQL */ `query ListTerritoryResponsibilities(
  $filter: ModelTerritoryResponsibilityFilterInput
  $limit: Int
  $nextToken: String
) {
  listTerritoryResponsibilities(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      id
      owner
      quota
      startDate
      territoryId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTerritoryResponsibilitiesQueryVariables,
  APITypes.ListTerritoryResponsibilitiesQuery
>;
export const listTodoByStatus = /* GraphQL */ `query ListTodoByStatus(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $status: TodoStatus!
) {
  listTodoByStatus(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    status: $status
  ) {
    items {
      createdAt
      doneOn
      id
      owner
      status
      todo
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTodoByStatusQueryVariables,
  APITypes.ListTodoByStatusQuery
>;
export const listTodos = /* GraphQL */ `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      doneOn
      id
      owner
      status
      todo
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTodosQueryVariables, APITypes.ListTodosQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $profileId: String
  $sortDirection: ModelSortDirection
) {
  listUsers(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    profileId: $profileId
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      email
      name
      personId
      profileId
      profilePicture
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const listWeeklyPlanByStatus = /* GraphQL */ `query ListWeeklyPlanByStatus(
  $filter: ModelWeeklyPlanFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $status: PlanningStatus!
) {
  listWeeklyPlanByStatus(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    status: $status
  ) {
    items {
      createdAt
      id
      owner
      startDate
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeeklyPlanByStatusQueryVariables,
  APITypes.ListWeeklyPlanByStatusQuery
>;
export const listWeeklyPlanProjects = /* GraphQL */ `query ListWeeklyPlanProjects(
  $filter: ModelWeeklyPlanProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listWeeklyPlanProjects(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      id
      owner
      projectId
      updatedAt
      weekPlanId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeeklyPlanProjectsQueryVariables,
  APITypes.ListWeeklyPlanProjectsQuery
>;
export const listWeeklyPlans = /* GraphQL */ `query ListWeeklyPlans(
  $filter: ModelWeeklyPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  listWeeklyPlans(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      owner
      startDate
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeeklyPlansQueryVariables,
  APITypes.ListWeeklyPlansQuery
>;
