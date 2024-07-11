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
export const getCrmProject = /* GraphQL */ `query GetCrmProject($id: ID!) {
  getCrmProject(id: $id) {
    annualRecurringRevenue
    closeDate
    createdAt
    crmId
    id
    isMarketplace
    name
    owner
    projects {
      nextToken
      __typename
    }
    stage
    totalContractVolume
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCrmProjectQueryVariables,
  APITypes.GetCrmProjectQuery
>;
export const getCrmProjectProjects = /* GraphQL */ `query GetCrmProjectProjects($id: ID!) {
  getCrmProjectProjects(id: $id) {
    createdAt
    crmProject {
      annualRecurringRevenue
      closeDate
      createdAt
      crmId
      id
      isMarketplace
      name
      owner
      stage
      totalContractVolume
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
export const getDayPlan = /* GraphQL */ `query GetDayPlan($id: ID!) {
  getDayPlan(id: $id) {
    context
    createdAt
    day
    dayGoal
    done
    id
    owner
    projectTasks {
      nextToken
      __typename
    }
    tasks {
      nextToken
      __typename
    }
    todos {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDayPlanQueryVariables,
  APITypes.GetDayPlanQuery
>;
export const getDayPlanTodo = /* GraphQL */ `query GetDayPlanTodo($id: ID!) {
  getDayPlanTodo(id: $id) {
    createdAt
    dayPlan {
      context
      createdAt
      day
      dayGoal
      done
      id
      owner
      updatedAt
      __typename
    }
    dayPlanTodosId
    done
    doneOn
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
      project
      updatedAt
      __typename
    }
    projectsTodosId
    todo
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDayPlanTodoQueryVariables,
  APITypes.GetDayPlanTodoQuery
>;
export const getDayProjectTask = /* GraphQL */ `query GetDayProjectTask($id: ID!) {
  getDayProjectTask(id: $id) {
    createdAt
    dayPlan {
      context
      createdAt
      day
      dayGoal
      done
      id
      owner
      updatedAt
      __typename
    }
    dayPlanProjectTasksId
    done
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
      project
      updatedAt
      __typename
    }
    projectsDayTasksId
    task
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDayProjectTaskQueryVariables,
  APITypes.GetDayProjectTaskQuery
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
export const getNonProjectTask = /* GraphQL */ `query GetNonProjectTask($id: ID!) {
  getNonProjectTask(id: $id) {
    context
    createdAt
    dayPlan {
      context
      createdAt
      day
      dayGoal
      done
      id
      owner
      updatedAt
      __typename
    }
    dayPlanTasksId
    done
    id
    notionId
    owner
    task
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNonProjectTaskQueryVariables,
  APITypes.GetNonProjectTaskQuery
>;
export const getPayerAccount = /* GraphQL */ `query GetPayerAccount($awsAccountNumber: ID!) {
  getPayerAccount(awsAccountNumber: $awsAccountNumber) {
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
    awsAccountNumber
    createdAt
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPayerAccountQueryVariables,
  APITypes.GetPayerAccountQuery
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
    notionId
    owner
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
export const getProjectActivity = /* GraphQL */ `query GetProjectActivity($id: ID!) {
  getProjectActivity(id: $id) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
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
    dayTasks {
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
    project
    todos {
      nextToken
      __typename
    }
    updatedAt
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
export const getUser = /* GraphQL */ `query GetUser($profileId: String!) {
  getUser(profileId: $profileId) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
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
      annualRecurringRevenue
      closeDate
      createdAt
      crmId
      id
      isMarketplace
      name
      owner
      stage
      totalContractVolume
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
export const listDayPlanTodos = /* GraphQL */ `query ListDayPlanTodos(
  $filter: ModelDayPlanTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listDayPlanTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      dayPlanTodosId
      done
      doneOn
      id
      owner
      projectsTodosId
      todo
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDayPlanTodosQueryVariables,
  APITypes.ListDayPlanTodosQuery
>;
export const listDayPlans = /* GraphQL */ `query ListDayPlans(
  $filter: ModelDayPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  listDayPlans(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      context
      createdAt
      day
      dayGoal
      done
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
  APITypes.ListDayPlansQueryVariables,
  APITypes.ListDayPlansQuery
>;
export const listDayProjectTasks = /* GraphQL */ `query ListDayProjectTasks(
  $filter: ModelDayProjectTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listDayProjectTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      dayPlanProjectTasksId
      done
      id
      owner
      projectsDayTasksId
      task
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDayProjectTasksQueryVariables,
  APITypes.ListDayProjectTasksQuery
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
export const listNonProjectTasks = /* GraphQL */ `query ListNonProjectTasks(
  $filter: ModelNonProjectTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listNonProjectTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      context
      createdAt
      dayPlanTasksId
      done
      id
      notionId
      owner
      task
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNonProjectTasksQueryVariables,
  APITypes.ListNonProjectTasksQuery
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
      accountId
      awsAccountNumber
      createdAt
      owner
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
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      email
      id
      name
      profileOwner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
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
      profileId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
