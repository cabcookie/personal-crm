/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAccount = /* GraphQL */ `mutation CreateAccount(
  $condition: ModelAccountConditionInput
  $input: CreateAccountInput!
) {
  createAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAccountMutationVariables,
  APITypes.CreateAccountMutation
>;
export const createAccountProjects = /* GraphQL */ `mutation CreateAccountProjects(
  $condition: ModelAccountProjectsConditionInput
  $input: CreateAccountProjectsInput!
) {
  createAccountProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAccountProjectsMutationVariables,
  APITypes.CreateAccountProjectsMutation
>;
export const createAccountTerritory = /* GraphQL */ `mutation CreateAccountTerritory(
  $condition: ModelAccountTerritoryConditionInput
  $input: CreateAccountTerritoryInput!
) {
  createAccountTerritory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAccountTerritoryMutationVariables,
  APITypes.CreateAccountTerritoryMutation
>;
export const createActivity = /* GraphQL */ `mutation CreateActivity(
  $condition: ModelActivityConditionInput
  $input: CreateActivityInput!
) {
  createActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateActivityMutationVariables,
  APITypes.CreateActivityMutation
>;
export const createCrmProject = /* GraphQL */ `mutation CreateCrmProject(
  $condition: ModelCrmProjectConditionInput
  $input: CreateCrmProjectInput!
) {
  createCrmProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCrmProjectMutationVariables,
  APITypes.CreateCrmProjectMutation
>;
export const createCrmProjectProjects = /* GraphQL */ `mutation CreateCrmProjectProjects(
  $condition: ModelCrmProjectProjectsConditionInput
  $input: CreateCrmProjectProjectsInput!
) {
  createCrmProjectProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCrmProjectProjectsMutationVariables,
  APITypes.CreateCrmProjectProjectsMutation
>;
export const createCurrentContext = /* GraphQL */ `mutation CreateCurrentContext(
  $condition: ModelCurrentContextConditionInput
  $input: CreateCurrentContextInput!
) {
  createCurrentContext(condition: $condition, input: $input) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCurrentContextMutationVariables,
  APITypes.CreateCurrentContextMutation
>;
export const createDayPlan = /* GraphQL */ `mutation CreateDayPlan(
  $condition: ModelDayPlanConditionInput
  $input: CreateDayPlanInput!
) {
  createDayPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDayPlanMutationVariables,
  APITypes.CreateDayPlanMutation
>;
export const createDayPlanTodo = /* GraphQL */ `mutation CreateDayPlanTodo(
  $condition: ModelDayPlanTodoConditionInput
  $input: CreateDayPlanTodoInput!
) {
  createDayPlanTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDayPlanTodoMutationVariables,
  APITypes.CreateDayPlanTodoMutation
>;
export const createDayProjectTask = /* GraphQL */ `mutation CreateDayProjectTask(
  $condition: ModelDayProjectTaskConditionInput
  $input: CreateDayProjectTaskInput!
) {
  createDayProjectTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDayProjectTaskMutationVariables,
  APITypes.CreateDayProjectTaskMutation
>;
export const createInbox = /* GraphQL */ `mutation CreateInbox(
  $condition: ModelInboxConditionInput
  $input: CreateInboxInput!
) {
  createInbox(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateInboxMutationVariables,
  APITypes.CreateInboxMutation
>;
export const createMeeting = /* GraphQL */ `mutation CreateMeeting(
  $condition: ModelMeetingConditionInput
  $input: CreateMeetingInput!
) {
  createMeeting(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMeetingMutationVariables,
  APITypes.CreateMeetingMutation
>;
export const createMeetingParticipant = /* GraphQL */ `mutation CreateMeetingParticipant(
  $condition: ModelMeetingParticipantConditionInput
  $input: CreateMeetingParticipantInput!
) {
  createMeetingParticipant(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMeetingParticipantMutationVariables,
  APITypes.CreateMeetingParticipantMutation
>;
export const createNonProjectTask = /* GraphQL */ `mutation CreateNonProjectTask(
  $condition: ModelNonProjectTaskConditionInput
  $input: CreateNonProjectTaskInput!
) {
  createNonProjectTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateNonProjectTaskMutationVariables,
  APITypes.CreateNonProjectTaskMutation
>;
export const createPayerAccount = /* GraphQL */ `mutation CreatePayerAccount(
  $condition: ModelPayerAccountConditionInput
  $input: CreatePayerAccountInput!
) {
  createPayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePayerAccountMutationVariables,
  APITypes.CreatePayerAccountMutation
>;
export const createPerson = /* GraphQL */ `mutation CreatePerson(
  $condition: ModelPersonConditionInput
  $input: CreatePersonInput!
) {
  createPerson(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePersonMutationVariables,
  APITypes.CreatePersonMutation
>;
export const createPersonAccount = /* GraphQL */ `mutation CreatePersonAccount(
  $condition: ModelPersonAccountConditionInput
  $input: CreatePersonAccountInput!
) {
  createPersonAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePersonAccountMutationVariables,
  APITypes.CreatePersonAccountMutation
>;
export const createPersonDetail = /* GraphQL */ `mutation CreatePersonDetail(
  $condition: ModelPersonDetailConditionInput
  $input: CreatePersonDetailInput!
) {
  createPersonDetail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePersonDetailMutationVariables,
  APITypes.CreatePersonDetailMutation
>;
export const createPersonLearning = /* GraphQL */ `mutation CreatePersonLearning(
  $condition: ModelPersonLearningConditionInput
  $input: CreatePersonLearningInput!
) {
  createPersonLearning(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePersonLearningMutationVariables,
  APITypes.CreatePersonLearningMutation
>;
export const createProjectActivity = /* GraphQL */ `mutation CreateProjectActivity(
  $condition: ModelProjectActivityConditionInput
  $input: CreateProjectActivityInput!
) {
  createProjectActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateProjectActivityMutationVariables,
  APITypes.CreateProjectActivityMutation
>;
export const createProjects = /* GraphQL */ `mutation CreateProjects(
  $condition: ModelProjectsConditionInput
  $input: CreateProjectsInput!
) {
  createProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateProjectsMutationVariables,
  APITypes.CreateProjectsMutation
>;
export const createSixWeekBatch = /* GraphQL */ `mutation CreateSixWeekBatch(
  $condition: ModelSixWeekBatchConditionInput
  $input: CreateSixWeekBatchInput!
) {
  createSixWeekBatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateSixWeekBatchMutationVariables,
  APITypes.CreateSixWeekBatchMutation
>;
export const createSixWeekBatchProjects = /* GraphQL */ `mutation CreateSixWeekBatchProjects(
  $condition: ModelSixWeekBatchProjectsConditionInput
  $input: CreateSixWeekBatchProjectsInput!
) {
  createSixWeekBatchProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateSixWeekBatchProjectsMutationVariables,
  APITypes.CreateSixWeekBatchProjectsMutation
>;
export const createSixWeekCycle = /* GraphQL */ `mutation CreateSixWeekCycle(
  $condition: ModelSixWeekCycleConditionInput
  $input: CreateSixWeekCycleInput!
) {
  createSixWeekCycle(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateSixWeekCycleMutationVariables,
  APITypes.CreateSixWeekCycleMutation
>;
export const createTerritory = /* GraphQL */ `mutation CreateTerritory(
  $condition: ModelTerritoryConditionInput
  $input: CreateTerritoryInput!
) {
  createTerritory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTerritoryMutationVariables,
  APITypes.CreateTerritoryMutation
>;
export const createTerritoryResponsibility = /* GraphQL */ `mutation CreateTerritoryResponsibility(
  $condition: ModelTerritoryResponsibilityConditionInput
  $input: CreateTerritoryResponsibilityInput!
) {
  createTerritoryResponsibility(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTerritoryResponsibilityMutationVariables,
  APITypes.CreateTerritoryResponsibilityMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const deleteAccount = /* GraphQL */ `mutation DeleteAccount(
  $condition: ModelAccountConditionInput
  $input: DeleteAccountInput!
) {
  deleteAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAccountMutationVariables,
  APITypes.DeleteAccountMutation
>;
export const deleteAccountProjects = /* GraphQL */ `mutation DeleteAccountProjects(
  $condition: ModelAccountProjectsConditionInput
  $input: DeleteAccountProjectsInput!
) {
  deleteAccountProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAccountProjectsMutationVariables,
  APITypes.DeleteAccountProjectsMutation
>;
export const deleteAccountTerritory = /* GraphQL */ `mutation DeleteAccountTerritory(
  $condition: ModelAccountTerritoryConditionInput
  $input: DeleteAccountTerritoryInput!
) {
  deleteAccountTerritory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAccountTerritoryMutationVariables,
  APITypes.DeleteAccountTerritoryMutation
>;
export const deleteActivity = /* GraphQL */ `mutation DeleteActivity(
  $condition: ModelActivityConditionInput
  $input: DeleteActivityInput!
) {
  deleteActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteActivityMutationVariables,
  APITypes.DeleteActivityMutation
>;
export const deleteCrmProject = /* GraphQL */ `mutation DeleteCrmProject(
  $condition: ModelCrmProjectConditionInput
  $input: DeleteCrmProjectInput!
) {
  deleteCrmProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCrmProjectMutationVariables,
  APITypes.DeleteCrmProjectMutation
>;
export const deleteCrmProjectProjects = /* GraphQL */ `mutation DeleteCrmProjectProjects(
  $condition: ModelCrmProjectProjectsConditionInput
  $input: DeleteCrmProjectProjectsInput!
) {
  deleteCrmProjectProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCrmProjectProjectsMutationVariables,
  APITypes.DeleteCrmProjectProjectsMutation
>;
export const deleteCurrentContext = /* GraphQL */ `mutation DeleteCurrentContext(
  $condition: ModelCurrentContextConditionInput
  $input: DeleteCurrentContextInput!
) {
  deleteCurrentContext(condition: $condition, input: $input) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCurrentContextMutationVariables,
  APITypes.DeleteCurrentContextMutation
>;
export const deleteDayPlan = /* GraphQL */ `mutation DeleteDayPlan(
  $condition: ModelDayPlanConditionInput
  $input: DeleteDayPlanInput!
) {
  deleteDayPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDayPlanMutationVariables,
  APITypes.DeleteDayPlanMutation
>;
export const deleteDayPlanTodo = /* GraphQL */ `mutation DeleteDayPlanTodo(
  $condition: ModelDayPlanTodoConditionInput
  $input: DeleteDayPlanTodoInput!
) {
  deleteDayPlanTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDayPlanTodoMutationVariables,
  APITypes.DeleteDayPlanTodoMutation
>;
export const deleteDayProjectTask = /* GraphQL */ `mutation DeleteDayProjectTask(
  $condition: ModelDayProjectTaskConditionInput
  $input: DeleteDayProjectTaskInput!
) {
  deleteDayProjectTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDayProjectTaskMutationVariables,
  APITypes.DeleteDayProjectTaskMutation
>;
export const deleteInbox = /* GraphQL */ `mutation DeleteInbox(
  $condition: ModelInboxConditionInput
  $input: DeleteInboxInput!
) {
  deleteInbox(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteInboxMutationVariables,
  APITypes.DeleteInboxMutation
>;
export const deleteMeeting = /* GraphQL */ `mutation DeleteMeeting(
  $condition: ModelMeetingConditionInput
  $input: DeleteMeetingInput!
) {
  deleteMeeting(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMeetingMutationVariables,
  APITypes.DeleteMeetingMutation
>;
export const deleteMeetingParticipant = /* GraphQL */ `mutation DeleteMeetingParticipant(
  $condition: ModelMeetingParticipantConditionInput
  $input: DeleteMeetingParticipantInput!
) {
  deleteMeetingParticipant(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMeetingParticipantMutationVariables,
  APITypes.DeleteMeetingParticipantMutation
>;
export const deleteNonProjectTask = /* GraphQL */ `mutation DeleteNonProjectTask(
  $condition: ModelNonProjectTaskConditionInput
  $input: DeleteNonProjectTaskInput!
) {
  deleteNonProjectTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteNonProjectTaskMutationVariables,
  APITypes.DeleteNonProjectTaskMutation
>;
export const deletePayerAccount = /* GraphQL */ `mutation DeletePayerAccount(
  $condition: ModelPayerAccountConditionInput
  $input: DeletePayerAccountInput!
) {
  deletePayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePayerAccountMutationVariables,
  APITypes.DeletePayerAccountMutation
>;
export const deletePerson = /* GraphQL */ `mutation DeletePerson(
  $condition: ModelPersonConditionInput
  $input: DeletePersonInput!
) {
  deletePerson(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePersonMutationVariables,
  APITypes.DeletePersonMutation
>;
export const deletePersonAccount = /* GraphQL */ `mutation DeletePersonAccount(
  $condition: ModelPersonAccountConditionInput
  $input: DeletePersonAccountInput!
) {
  deletePersonAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePersonAccountMutationVariables,
  APITypes.DeletePersonAccountMutation
>;
export const deletePersonDetail = /* GraphQL */ `mutation DeletePersonDetail(
  $condition: ModelPersonDetailConditionInput
  $input: DeletePersonDetailInput!
) {
  deletePersonDetail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePersonDetailMutationVariables,
  APITypes.DeletePersonDetailMutation
>;
export const deletePersonLearning = /* GraphQL */ `mutation DeletePersonLearning(
  $condition: ModelPersonLearningConditionInput
  $input: DeletePersonLearningInput!
) {
  deletePersonLearning(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePersonLearningMutationVariables,
  APITypes.DeletePersonLearningMutation
>;
export const deleteProjectActivity = /* GraphQL */ `mutation DeleteProjectActivity(
  $condition: ModelProjectActivityConditionInput
  $input: DeleteProjectActivityInput!
) {
  deleteProjectActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteProjectActivityMutationVariables,
  APITypes.DeleteProjectActivityMutation
>;
export const deleteProjects = /* GraphQL */ `mutation DeleteProjects(
  $condition: ModelProjectsConditionInput
  $input: DeleteProjectsInput!
) {
  deleteProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteProjectsMutationVariables,
  APITypes.DeleteProjectsMutation
>;
export const deleteSixWeekBatch = /* GraphQL */ `mutation DeleteSixWeekBatch(
  $condition: ModelSixWeekBatchConditionInput
  $input: DeleteSixWeekBatchInput!
) {
  deleteSixWeekBatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteSixWeekBatchMutationVariables,
  APITypes.DeleteSixWeekBatchMutation
>;
export const deleteSixWeekBatchProjects = /* GraphQL */ `mutation DeleteSixWeekBatchProjects(
  $condition: ModelSixWeekBatchProjectsConditionInput
  $input: DeleteSixWeekBatchProjectsInput!
) {
  deleteSixWeekBatchProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteSixWeekBatchProjectsMutationVariables,
  APITypes.DeleteSixWeekBatchProjectsMutation
>;
export const deleteSixWeekCycle = /* GraphQL */ `mutation DeleteSixWeekCycle(
  $condition: ModelSixWeekCycleConditionInput
  $input: DeleteSixWeekCycleInput!
) {
  deleteSixWeekCycle(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteSixWeekCycleMutationVariables,
  APITypes.DeleteSixWeekCycleMutation
>;
export const deleteTerritory = /* GraphQL */ `mutation DeleteTerritory(
  $condition: ModelTerritoryConditionInput
  $input: DeleteTerritoryInput!
) {
  deleteTerritory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTerritoryMutationVariables,
  APITypes.DeleteTerritoryMutation
>;
export const deleteTerritoryResponsibility = /* GraphQL */ `mutation DeleteTerritoryResponsibility(
  $condition: ModelTerritoryResponsibilityConditionInput
  $input: DeleteTerritoryResponsibilityInput!
) {
  deleteTerritoryResponsibility(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTerritoryResponsibilityMutationVariables,
  APITypes.DeleteTerritoryResponsibilityMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const updateAccount = /* GraphQL */ `mutation UpdateAccount(
  $condition: ModelAccountConditionInput
  $input: UpdateAccountInput!
) {
  updateAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAccountMutationVariables,
  APITypes.UpdateAccountMutation
>;
export const updateAccountProjects = /* GraphQL */ `mutation UpdateAccountProjects(
  $condition: ModelAccountProjectsConditionInput
  $input: UpdateAccountProjectsInput!
) {
  updateAccountProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAccountProjectsMutationVariables,
  APITypes.UpdateAccountProjectsMutation
>;
export const updateAccountTerritory = /* GraphQL */ `mutation UpdateAccountTerritory(
  $condition: ModelAccountTerritoryConditionInput
  $input: UpdateAccountTerritoryInput!
) {
  updateAccountTerritory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAccountTerritoryMutationVariables,
  APITypes.UpdateAccountTerritoryMutation
>;
export const updateActivity = /* GraphQL */ `mutation UpdateActivity(
  $condition: ModelActivityConditionInput
  $input: UpdateActivityInput!
) {
  updateActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateActivityMutationVariables,
  APITypes.UpdateActivityMutation
>;
export const updateCrmProject = /* GraphQL */ `mutation UpdateCrmProject(
  $condition: ModelCrmProjectConditionInput
  $input: UpdateCrmProjectInput!
) {
  updateCrmProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCrmProjectMutationVariables,
  APITypes.UpdateCrmProjectMutation
>;
export const updateCrmProjectProjects = /* GraphQL */ `mutation UpdateCrmProjectProjects(
  $condition: ModelCrmProjectProjectsConditionInput
  $input: UpdateCrmProjectProjectsInput!
) {
  updateCrmProjectProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCrmProjectProjectsMutationVariables,
  APITypes.UpdateCrmProjectProjectsMutation
>;
export const updateCurrentContext = /* GraphQL */ `mutation UpdateCurrentContext(
  $condition: ModelCurrentContextConditionInput
  $input: UpdateCurrentContextInput!
) {
  updateCurrentContext(condition: $condition, input: $input) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCurrentContextMutationVariables,
  APITypes.UpdateCurrentContextMutation
>;
export const updateDayPlan = /* GraphQL */ `mutation UpdateDayPlan(
  $condition: ModelDayPlanConditionInput
  $input: UpdateDayPlanInput!
) {
  updateDayPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDayPlanMutationVariables,
  APITypes.UpdateDayPlanMutation
>;
export const updateDayPlanTodo = /* GraphQL */ `mutation UpdateDayPlanTodo(
  $condition: ModelDayPlanTodoConditionInput
  $input: UpdateDayPlanTodoInput!
) {
  updateDayPlanTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDayPlanTodoMutationVariables,
  APITypes.UpdateDayPlanTodoMutation
>;
export const updateDayProjectTask = /* GraphQL */ `mutation UpdateDayProjectTask(
  $condition: ModelDayProjectTaskConditionInput
  $input: UpdateDayProjectTaskInput!
) {
  updateDayProjectTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDayProjectTaskMutationVariables,
  APITypes.UpdateDayProjectTaskMutation
>;
export const updateInbox = /* GraphQL */ `mutation UpdateInbox(
  $condition: ModelInboxConditionInput
  $input: UpdateInboxInput!
) {
  updateInbox(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateInboxMutationVariables,
  APITypes.UpdateInboxMutation
>;
export const updateMeeting = /* GraphQL */ `mutation UpdateMeeting(
  $condition: ModelMeetingConditionInput
  $input: UpdateMeetingInput!
) {
  updateMeeting(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMeetingMutationVariables,
  APITypes.UpdateMeetingMutation
>;
export const updateMeetingParticipant = /* GraphQL */ `mutation UpdateMeetingParticipant(
  $condition: ModelMeetingParticipantConditionInput
  $input: UpdateMeetingParticipantInput!
) {
  updateMeetingParticipant(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMeetingParticipantMutationVariables,
  APITypes.UpdateMeetingParticipantMutation
>;
export const updateNonProjectTask = /* GraphQL */ `mutation UpdateNonProjectTask(
  $condition: ModelNonProjectTaskConditionInput
  $input: UpdateNonProjectTaskInput!
) {
  updateNonProjectTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateNonProjectTaskMutationVariables,
  APITypes.UpdateNonProjectTaskMutation
>;
export const updatePayerAccount = /* GraphQL */ `mutation UpdatePayerAccount(
  $condition: ModelPayerAccountConditionInput
  $input: UpdatePayerAccountInput!
) {
  updatePayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePayerAccountMutationVariables,
  APITypes.UpdatePayerAccountMutation
>;
export const updatePerson = /* GraphQL */ `mutation UpdatePerson(
  $condition: ModelPersonConditionInput
  $input: UpdatePersonInput!
) {
  updatePerson(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePersonMutationVariables,
  APITypes.UpdatePersonMutation
>;
export const updatePersonAccount = /* GraphQL */ `mutation UpdatePersonAccount(
  $condition: ModelPersonAccountConditionInput
  $input: UpdatePersonAccountInput!
) {
  updatePersonAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePersonAccountMutationVariables,
  APITypes.UpdatePersonAccountMutation
>;
export const updatePersonDetail = /* GraphQL */ `mutation UpdatePersonDetail(
  $condition: ModelPersonDetailConditionInput
  $input: UpdatePersonDetailInput!
) {
  updatePersonDetail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePersonDetailMutationVariables,
  APITypes.UpdatePersonDetailMutation
>;
export const updatePersonLearning = /* GraphQL */ `mutation UpdatePersonLearning(
  $condition: ModelPersonLearningConditionInput
  $input: UpdatePersonLearningInput!
) {
  updatePersonLearning(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePersonLearningMutationVariables,
  APITypes.UpdatePersonLearningMutation
>;
export const updateProjectActivity = /* GraphQL */ `mutation UpdateProjectActivity(
  $condition: ModelProjectActivityConditionInput
  $input: UpdateProjectActivityInput!
) {
  updateProjectActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateProjectActivityMutationVariables,
  APITypes.UpdateProjectActivityMutation
>;
export const updateProjects = /* GraphQL */ `mutation UpdateProjects(
  $condition: ModelProjectsConditionInput
  $input: UpdateProjectsInput!
) {
  updateProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateProjectsMutationVariables,
  APITypes.UpdateProjectsMutation
>;
export const updateSixWeekBatch = /* GraphQL */ `mutation UpdateSixWeekBatch(
  $condition: ModelSixWeekBatchConditionInput
  $input: UpdateSixWeekBatchInput!
) {
  updateSixWeekBatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateSixWeekBatchMutationVariables,
  APITypes.UpdateSixWeekBatchMutation
>;
export const updateSixWeekBatchProjects = /* GraphQL */ `mutation UpdateSixWeekBatchProjects(
  $condition: ModelSixWeekBatchProjectsConditionInput
  $input: UpdateSixWeekBatchProjectsInput!
) {
  updateSixWeekBatchProjects(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateSixWeekBatchProjectsMutationVariables,
  APITypes.UpdateSixWeekBatchProjectsMutation
>;
export const updateSixWeekCycle = /* GraphQL */ `mutation UpdateSixWeekCycle(
  $condition: ModelSixWeekCycleConditionInput
  $input: UpdateSixWeekCycleInput!
) {
  updateSixWeekCycle(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateSixWeekCycleMutationVariables,
  APITypes.UpdateSixWeekCycleMutation
>;
export const updateTerritory = /* GraphQL */ `mutation UpdateTerritory(
  $condition: ModelTerritoryConditionInput
  $input: UpdateTerritoryInput!
) {
  updateTerritory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTerritoryMutationVariables,
  APITypes.UpdateTerritoryMutation
>;
export const updateTerritoryResponsibility = /* GraphQL */ `mutation UpdateTerritoryResponsibility(
  $condition: ModelTerritoryResponsibilityConditionInput
  $input: UpdateTerritoryResponsibilityInput!
) {
  updateTerritoryResponsibility(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTerritoryResponsibilityMutationVariables,
  APITypes.UpdateTerritoryResponsibilityMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
