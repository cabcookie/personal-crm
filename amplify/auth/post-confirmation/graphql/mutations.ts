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
` as GeneratedMutation<
  APITypes.CreateAccountMutationVariables,
  APITypes.CreateAccountMutation
>;
export const createAccountPayerAccount = /* GraphQL */ `mutation CreateAccountPayerAccount(
  $condition: ModelAccountPayerAccountConditionInput
  $input: CreateAccountPayerAccountInput!
) {
  createAccountPayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAccountPayerAccountMutationVariables,
  APITypes.CreateAccountPayerAccountMutation
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
` as GeneratedMutation<
  APITypes.CreateActivityMutationVariables,
  APITypes.CreateActivityMutation
>;
export const createBookOfBible = /* GraphQL */ `mutation CreateBookOfBible(
  $condition: ModelBookOfBibleConditionInput
  $input: CreateBookOfBibleInput!
) {
  createBookOfBible(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBookOfBibleMutationVariables,
  APITypes.CreateBookOfBibleMutation
>;
export const createCrmProject = /* GraphQL */ `mutation CreateCrmProject(
  $condition: ModelCrmProjectConditionInput
  $input: CreateCrmProjectInput!
) {
  createCrmProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCrmProjectMutationVariables,
  APITypes.CreateCrmProjectMutation
>;
export const createCrmProjectImport = /* GraphQL */ `mutation CreateCrmProjectImport(
  $condition: ModelCrmProjectImportConditionInput
  $input: CreateCrmProjectImportInput!
) {
  createCrmProjectImport(condition: $condition, input: $input) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCrmProjectImportMutationVariables,
  APITypes.CreateCrmProjectImportMutation
>;
export const createCrmProjectProjects = /* GraphQL */ `mutation CreateCrmProjectProjects(
  $condition: ModelCrmProjectProjectsConditionInput
  $input: CreateCrmProjectProjectsInput!
) {
  createCrmProjectProjects(condition: $condition, input: $input) {
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
export const createDailyPlan = /* GraphQL */ `mutation CreateDailyPlan(
  $condition: ModelDailyPlanConditionInput
  $input: CreateDailyPlanInput!
) {
  createDailyPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDailyPlanMutationVariables,
  APITypes.CreateDailyPlanMutation
>;
export const createDailyPlanTodo = /* GraphQL */ `mutation CreateDailyPlanTodo(
  $condition: ModelDailyPlanTodoConditionInput
  $input: CreateDailyPlanTodoInput!
) {
  createDailyPlanTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDailyPlanTodoMutationVariables,
  APITypes.CreateDailyPlanTodoMutation
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
` as GeneratedMutation<
  APITypes.CreateMeetingParticipantMutationVariables,
  APITypes.CreateMeetingParticipantMutation
>;
export const createMonth = /* GraphQL */ `mutation CreateMonth(
  $condition: ModelMonthConditionInput
  $input: CreateMonthInput!
) {
  createMonth(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMonthMutationVariables,
  APITypes.CreateMonthMutation
>;
export const createMrrDataUpload = /* GraphQL */ `mutation CreateMrrDataUpload(
  $condition: ModelMrrDataUploadConditionInput
  $input: CreateMrrDataUploadInput!
) {
  createMrrDataUpload(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMrrDataUploadMutationVariables,
  APITypes.CreateMrrDataUploadMutation
>;
export const createNoteBlock = /* GraphQL */ `mutation CreateNoteBlock(
  $condition: ModelNoteBlockConditionInput
  $input: CreateNoteBlockInput!
) {
  createNoteBlock(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateNoteBlockMutationVariables,
  APITypes.CreateNoteBlockMutation
>;
export const createNoteBlockPerson = /* GraphQL */ `mutation CreateNoteBlockPerson(
  $condition: ModelNoteBlockPersonConditionInput
  $input: CreateNoteBlockPersonInput!
) {
  createNoteBlockPerson(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateNoteBlockPersonMutationVariables,
  APITypes.CreateNoteBlockPersonMutation
>;
export const createNotesBibleChapter = /* GraphQL */ `mutation CreateNotesBibleChapter(
  $condition: ModelNotesBibleChapterConditionInput
  $input: CreateNotesBibleChapterInput!
) {
  createNotesBibleChapter(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateNotesBibleChapterMutationVariables,
  APITypes.CreateNotesBibleChapterMutation
>;
export const createPayerAccount = /* GraphQL */ `mutation CreatePayerAccount(
  $condition: ModelPayerAccountConditionInput
  $input: CreatePayerAccountInput!
) {
  createPayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePayerAccountMutationVariables,
  APITypes.CreatePayerAccountMutation
>;
export const createPayerAccountMrr = /* GraphQL */ `mutation CreatePayerAccountMrr(
  $condition: ModelPayerAccountMrrConditionInput
  $input: CreatePayerAccountMrrInput!
) {
  createPayerAccountMrr(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePayerAccountMrrMutationVariables,
  APITypes.CreatePayerAccountMrrMutation
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
export const createPersonRelationship = /* GraphQL */ `mutation CreatePersonRelationship(
  $condition: ModelPersonRelationshipConditionInput
  $input: CreatePersonRelationshipInput!
) {
  createPersonRelationship(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePersonRelationshipMutationVariables,
  APITypes.CreatePersonRelationshipMutation
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
export const createTodo = /* GraphQL */ `mutation CreateTodo(
  $condition: ModelTodoConditionInput
  $input: CreateTodoInput!
) {
  createTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTodoMutationVariables,
  APITypes.CreateTodoMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const createWeeklyPlan = /* GraphQL */ `mutation CreateWeeklyPlan(
  $condition: ModelWeeklyPlanConditionInput
  $input: CreateWeeklyPlanInput!
) {
  createWeeklyPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateWeeklyPlanMutationVariables,
  APITypes.CreateWeeklyPlanMutation
>;
export const createWeeklyPlanProject = /* GraphQL */ `mutation CreateWeeklyPlanProject(
  $condition: ModelWeeklyPlanProjectConditionInput
  $input: CreateWeeklyPlanProjectInput!
) {
  createWeeklyPlanProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateWeeklyPlanProjectMutationVariables,
  APITypes.CreateWeeklyPlanProjectMutation
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
` as GeneratedMutation<
  APITypes.DeleteAccountMutationVariables,
  APITypes.DeleteAccountMutation
>;
export const deleteAccountPayerAccount = /* GraphQL */ `mutation DeleteAccountPayerAccount(
  $condition: ModelAccountPayerAccountConditionInput
  $input: DeleteAccountPayerAccountInput!
) {
  deleteAccountPayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAccountPayerAccountMutationVariables,
  APITypes.DeleteAccountPayerAccountMutation
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
` as GeneratedMutation<
  APITypes.DeleteActivityMutationVariables,
  APITypes.DeleteActivityMutation
>;
export const deleteBookOfBible = /* GraphQL */ `mutation DeleteBookOfBible(
  $condition: ModelBookOfBibleConditionInput
  $input: DeleteBookOfBibleInput!
) {
  deleteBookOfBible(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteBookOfBibleMutationVariables,
  APITypes.DeleteBookOfBibleMutation
>;
export const deleteCrmProject = /* GraphQL */ `mutation DeleteCrmProject(
  $condition: ModelCrmProjectConditionInput
  $input: DeleteCrmProjectInput!
) {
  deleteCrmProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCrmProjectMutationVariables,
  APITypes.DeleteCrmProjectMutation
>;
export const deleteCrmProjectImport = /* GraphQL */ `mutation DeleteCrmProjectImport(
  $condition: ModelCrmProjectImportConditionInput
  $input: DeleteCrmProjectImportInput!
) {
  deleteCrmProjectImport(condition: $condition, input: $input) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCrmProjectImportMutationVariables,
  APITypes.DeleteCrmProjectImportMutation
>;
export const deleteCrmProjectProjects = /* GraphQL */ `mutation DeleteCrmProjectProjects(
  $condition: ModelCrmProjectProjectsConditionInput
  $input: DeleteCrmProjectProjectsInput!
) {
  deleteCrmProjectProjects(condition: $condition, input: $input) {
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
export const deleteDailyPlan = /* GraphQL */ `mutation DeleteDailyPlan(
  $condition: ModelDailyPlanConditionInput
  $input: DeleteDailyPlanInput!
) {
  deleteDailyPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDailyPlanMutationVariables,
  APITypes.DeleteDailyPlanMutation
>;
export const deleteDailyPlanTodo = /* GraphQL */ `mutation DeleteDailyPlanTodo(
  $condition: ModelDailyPlanTodoConditionInput
  $input: DeleteDailyPlanTodoInput!
) {
  deleteDailyPlanTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDailyPlanTodoMutationVariables,
  APITypes.DeleteDailyPlanTodoMutation
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
` as GeneratedMutation<
  APITypes.DeleteMeetingParticipantMutationVariables,
  APITypes.DeleteMeetingParticipantMutation
>;
export const deleteMonth = /* GraphQL */ `mutation DeleteMonth(
  $condition: ModelMonthConditionInput
  $input: DeleteMonthInput!
) {
  deleteMonth(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMonthMutationVariables,
  APITypes.DeleteMonthMutation
>;
export const deleteMrrDataUpload = /* GraphQL */ `mutation DeleteMrrDataUpload(
  $condition: ModelMrrDataUploadConditionInput
  $input: DeleteMrrDataUploadInput!
) {
  deleteMrrDataUpload(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMrrDataUploadMutationVariables,
  APITypes.DeleteMrrDataUploadMutation
>;
export const deleteNoteBlock = /* GraphQL */ `mutation DeleteNoteBlock(
  $condition: ModelNoteBlockConditionInput
  $input: DeleteNoteBlockInput!
) {
  deleteNoteBlock(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteNoteBlockMutationVariables,
  APITypes.DeleteNoteBlockMutation
>;
export const deleteNoteBlockPerson = /* GraphQL */ `mutation DeleteNoteBlockPerson(
  $condition: ModelNoteBlockPersonConditionInput
  $input: DeleteNoteBlockPersonInput!
) {
  deleteNoteBlockPerson(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteNoteBlockPersonMutationVariables,
  APITypes.DeleteNoteBlockPersonMutation
>;
export const deleteNotesBibleChapter = /* GraphQL */ `mutation DeleteNotesBibleChapter(
  $condition: ModelNotesBibleChapterConditionInput
  $input: DeleteNotesBibleChapterInput!
) {
  deleteNotesBibleChapter(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteNotesBibleChapterMutationVariables,
  APITypes.DeleteNotesBibleChapterMutation
>;
export const deletePayerAccount = /* GraphQL */ `mutation DeletePayerAccount(
  $condition: ModelPayerAccountConditionInput
  $input: DeletePayerAccountInput!
) {
  deletePayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePayerAccountMutationVariables,
  APITypes.DeletePayerAccountMutation
>;
export const deletePayerAccountMrr = /* GraphQL */ `mutation DeletePayerAccountMrr(
  $condition: ModelPayerAccountMrrConditionInput
  $input: DeletePayerAccountMrrInput!
) {
  deletePayerAccountMrr(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePayerAccountMrrMutationVariables,
  APITypes.DeletePayerAccountMrrMutation
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
export const deletePersonRelationship = /* GraphQL */ `mutation DeletePersonRelationship(
  $condition: ModelPersonRelationshipConditionInput
  $input: DeletePersonRelationshipInput!
) {
  deletePersonRelationship(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePersonRelationshipMutationVariables,
  APITypes.DeletePersonRelationshipMutation
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
export const deleteTodo = /* GraphQL */ `mutation DeleteTodo(
  $condition: ModelTodoConditionInput
  $input: DeleteTodoInput!
) {
  deleteTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTodoMutationVariables,
  APITypes.DeleteTodoMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const deleteWeeklyPlan = /* GraphQL */ `mutation DeleteWeeklyPlan(
  $condition: ModelWeeklyPlanConditionInput
  $input: DeleteWeeklyPlanInput!
) {
  deleteWeeklyPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteWeeklyPlanMutationVariables,
  APITypes.DeleteWeeklyPlanMutation
>;
export const deleteWeeklyPlanProject = /* GraphQL */ `mutation DeleteWeeklyPlanProject(
  $condition: ModelWeeklyPlanProjectConditionInput
  $input: DeleteWeeklyPlanProjectInput!
) {
  deleteWeeklyPlanProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteWeeklyPlanProjectMutationVariables,
  APITypes.DeleteWeeklyPlanProjectMutation
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
` as GeneratedMutation<
  APITypes.UpdateAccountMutationVariables,
  APITypes.UpdateAccountMutation
>;
export const updateAccountPayerAccount = /* GraphQL */ `mutation UpdateAccountPayerAccount(
  $condition: ModelAccountPayerAccountConditionInput
  $input: UpdateAccountPayerAccountInput!
) {
  updateAccountPayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAccountPayerAccountMutationVariables,
  APITypes.UpdateAccountPayerAccountMutation
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
` as GeneratedMutation<
  APITypes.UpdateActivityMutationVariables,
  APITypes.UpdateActivityMutation
>;
export const updateBookOfBible = /* GraphQL */ `mutation UpdateBookOfBible(
  $condition: ModelBookOfBibleConditionInput
  $input: UpdateBookOfBibleInput!
) {
  updateBookOfBible(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBookOfBibleMutationVariables,
  APITypes.UpdateBookOfBibleMutation
>;
export const updateCrmProject = /* GraphQL */ `mutation UpdateCrmProject(
  $condition: ModelCrmProjectConditionInput
  $input: UpdateCrmProjectInput!
) {
  updateCrmProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCrmProjectMutationVariables,
  APITypes.UpdateCrmProjectMutation
>;
export const updateCrmProjectImport = /* GraphQL */ `mutation UpdateCrmProjectImport(
  $condition: ModelCrmProjectImportConditionInput
  $input: UpdateCrmProjectImportInput!
) {
  updateCrmProjectImport(condition: $condition, input: $input) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCrmProjectImportMutationVariables,
  APITypes.UpdateCrmProjectImportMutation
>;
export const updateCrmProjectProjects = /* GraphQL */ `mutation UpdateCrmProjectProjects(
  $condition: ModelCrmProjectProjectsConditionInput
  $input: UpdateCrmProjectProjectsInput!
) {
  updateCrmProjectProjects(condition: $condition, input: $input) {
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
export const updateDailyPlan = /* GraphQL */ `mutation UpdateDailyPlan(
  $condition: ModelDailyPlanConditionInput
  $input: UpdateDailyPlanInput!
) {
  updateDailyPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDailyPlanMutationVariables,
  APITypes.UpdateDailyPlanMutation
>;
export const updateDailyPlanTodo = /* GraphQL */ `mutation UpdateDailyPlanTodo(
  $condition: ModelDailyPlanTodoConditionInput
  $input: UpdateDailyPlanTodoInput!
) {
  updateDailyPlanTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDailyPlanTodoMutationVariables,
  APITypes.UpdateDailyPlanTodoMutation
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
` as GeneratedMutation<
  APITypes.UpdateMeetingParticipantMutationVariables,
  APITypes.UpdateMeetingParticipantMutation
>;
export const updateMonth = /* GraphQL */ `mutation UpdateMonth(
  $condition: ModelMonthConditionInput
  $input: UpdateMonthInput!
) {
  updateMonth(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMonthMutationVariables,
  APITypes.UpdateMonthMutation
>;
export const updateMrrDataUpload = /* GraphQL */ `mutation UpdateMrrDataUpload(
  $condition: ModelMrrDataUploadConditionInput
  $input: UpdateMrrDataUploadInput!
) {
  updateMrrDataUpload(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMrrDataUploadMutationVariables,
  APITypes.UpdateMrrDataUploadMutation
>;
export const updateNoteBlock = /* GraphQL */ `mutation UpdateNoteBlock(
  $condition: ModelNoteBlockConditionInput
  $input: UpdateNoteBlockInput!
) {
  updateNoteBlock(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateNoteBlockMutationVariables,
  APITypes.UpdateNoteBlockMutation
>;
export const updateNoteBlockPerson = /* GraphQL */ `mutation UpdateNoteBlockPerson(
  $condition: ModelNoteBlockPersonConditionInput
  $input: UpdateNoteBlockPersonInput!
) {
  updateNoteBlockPerson(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateNoteBlockPersonMutationVariables,
  APITypes.UpdateNoteBlockPersonMutation
>;
export const updateNotesBibleChapter = /* GraphQL */ `mutation UpdateNotesBibleChapter(
  $condition: ModelNotesBibleChapterConditionInput
  $input: UpdateNotesBibleChapterInput!
) {
  updateNotesBibleChapter(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateNotesBibleChapterMutationVariables,
  APITypes.UpdateNotesBibleChapterMutation
>;
export const updatePayerAccount = /* GraphQL */ `mutation UpdatePayerAccount(
  $condition: ModelPayerAccountConditionInput
  $input: UpdatePayerAccountInput!
) {
  updatePayerAccount(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePayerAccountMutationVariables,
  APITypes.UpdatePayerAccountMutation
>;
export const updatePayerAccountMrr = /* GraphQL */ `mutation UpdatePayerAccountMrr(
  $condition: ModelPayerAccountMrrConditionInput
  $input: UpdatePayerAccountMrrInput!
) {
  updatePayerAccountMrr(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePayerAccountMrrMutationVariables,
  APITypes.UpdatePayerAccountMrrMutation
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
export const updatePersonRelationship = /* GraphQL */ `mutation UpdatePersonRelationship(
  $condition: ModelPersonRelationshipConditionInput
  $input: UpdatePersonRelationshipInput!
) {
  updatePersonRelationship(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePersonRelationshipMutationVariables,
  APITypes.UpdatePersonRelationshipMutation
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
export const updateTodo = /* GraphQL */ `mutation UpdateTodo(
  $condition: ModelTodoConditionInput
  $input: UpdateTodoInput!
) {
  updateTodo(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTodoMutationVariables,
  APITypes.UpdateTodoMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const updateWeeklyPlan = /* GraphQL */ `mutation UpdateWeeklyPlan(
  $condition: ModelWeeklyPlanConditionInput
  $input: UpdateWeeklyPlanInput!
) {
  updateWeeklyPlan(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateWeeklyPlanMutationVariables,
  APITypes.UpdateWeeklyPlanMutation
>;
export const updateWeeklyPlanProject = /* GraphQL */ `mutation UpdateWeeklyPlanProject(
  $condition: ModelWeeklyPlanProjectConditionInput
  $input: UpdateWeeklyPlanProjectInput!
) {
  updateWeeklyPlanProject(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateWeeklyPlanProjectMutationVariables,
  APITypes.UpdateWeeklyPlanProjectMutation
>;
