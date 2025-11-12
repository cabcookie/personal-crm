/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAccount = /* GraphQL */ `subscription OnCreateAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onCreateAccount(filter: $filter, owner: $owner) {
    accountSubsidiariesId
    awsAccounts {
      nextToken
      __typename
    }
    controller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    createdAt
    crmId
    formatVersion
    id
    introduction
    introductionJson
    learnings {
      nextToken
      __typename
    }
    mainColor
    name
    notionId
    order
    owner
    partnerProjects {
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
    shortName
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
` as GeneratedSubscription<
  APITypes.OnCreateAccountSubscriptionVariables,
  APITypes.OnCreateAccountSubscription
>;
export const onCreateAccountLearning = /* GraphQL */ `subscription OnCreateAccountLearning(
  $filter: ModelSubscriptionAccountLearningFilterInput
  $owner: String
) {
  onCreateAccountLearning(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    accountId
    createdAt
    id
    learnedOn
    learning
    owner
    peopleMentioned {
      nextToken
      __typename
    }
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAccountLearningSubscriptionVariables,
  APITypes.OnCreateAccountLearningSubscription
>;
export const onCreateAccountLearningPerson = /* GraphQL */ `subscription OnCreateAccountLearningPerson(
  $filter: ModelSubscriptionAccountLearningPersonFilterInput
  $owner: String
) {
  onCreateAccountLearningPerson(filter: $filter, owner: $owner) {
    createdAt
    id
    learning {
      accountId
      createdAt
      id
      learnedOn
      learning
      owner
      status
      updatedAt
      __typename
    }
    learningId
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
` as GeneratedSubscription<
  APITypes.OnCreateAccountLearningPersonSubscriptionVariables,
  APITypes.OnCreateAccountLearningPersonSubscription
>;
export const onCreateAccountPayerAccount = /* GraphQL */ `subscription OnCreateAccountPayerAccount(
  $filter: ModelSubscriptionAccountPayerAccountFilterInput
  $owner: String
) {
  onCreateAccountPayerAccount(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    accountId
    awsAccountNumber {
      awsAccountNumber
      createdAt
      isViaReseller
      mainContactId
      notes
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
` as GeneratedSubscription<
  APITypes.OnCreateAccountPayerAccountSubscriptionVariables,
  APITypes.OnCreateAccountPayerAccountSubscription
>;
export const onCreateAccountProjects = /* GraphQL */ `subscription OnCreateAccountProjects(
  $filter: ModelSubscriptionAccountProjectsFilterInput
  $owner: String
) {
  onCreateAccountProjects(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAccountProjectsSubscriptionVariables,
  APITypes.OnCreateAccountProjectsSubscription
>;
export const onCreateAccountTerritory = /* GraphQL */ `subscription OnCreateAccountTerritory(
  $filter: ModelSubscriptionAccountTerritoryFilterInput
  $owner: String
) {
  onCreateAccountTerritory(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
` as GeneratedSubscription<
  APITypes.OnCreateAccountTerritorySubscriptionVariables,
  APITypes.OnCreateAccountTerritorySubscription
>;
export const onCreateActivity = /* GraphQL */ `subscription OnCreateActivity(
  $filter: ModelSubscriptionActivityFilterInput
  $owner: String
) {
  onCreateActivity(filter: $filter, owner: $owner) {
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
    name
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
` as GeneratedSubscription<
  APITypes.OnCreateActivitySubscriptionVariables,
  APITypes.OnCreateActivitySubscription
>;
export const onCreateApiKeysForAi = /* GraphQL */ `subscription OnCreateApiKeysForAi(
  $filter: ModelSubscriptionApiKeysForAiFilterInput
  $owner: String
) {
  onCreateApiKeysForAi(filter: $filter, owner: $owner) {
    apiKey
    createdAt
    dataSource
    itemId
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateApiKeysForAiSubscriptionVariables,
  APITypes.OnCreateApiKeysForAiSubscription
>;
export const onCreateAssistantResponseGeneralChat = /* GraphQL */ `subscription OnCreateAssistantResponseGeneralChat($conversationId: ID) {
  onCreateAssistantResponseGeneralChat(conversationId: $conversationId) {
    associatedUserMessageId
    contentBlockDeltaIndex
    contentBlockDoneAtIndex
    contentBlockIndex
    contentBlockText
    contentBlockToolUse {
      input
      name
      toolUseId
      __typename
    }
    conversationId
    errors {
      errorType
      message
      __typename
    }
    id
    owner
    p
    stopReason
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAssistantResponseGeneralChatSubscriptionVariables,
  APITypes.OnCreateAssistantResponseGeneralChatSubscription
>;
export const onCreateBookOfBible = /* GraphQL */ `subscription OnCreateBookOfBible(
  $filter: ModelSubscriptionBookOfBibleFilterInput
  $owner: String
) {
  onCreateBookOfBible(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBookOfBibleSubscriptionVariables,
  APITypes.OnCreateBookOfBibleSubscription
>;
export const onCreateConversationMessageGeneralChat = /* GraphQL */ `subscription OnCreateConversationMessageGeneralChat(
  $filter: ModelSubscriptionConversationMessageGeneralChatFilterInput
  $owner: String
) {
  onCreateConversationMessageGeneralChat(filter: $filter, owner: $owner) {
    aiContext
    associatedUserMessageId
    content {
      text
      __typename
    }
    conversation {
      createdAt
      id
      metadata
      name
      owner
      updatedAt
      __typename
    }
    conversationId
    createdAt
    id
    owner
    role
    toolConfiguration {
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConversationMessageGeneralChatSubscriptionVariables,
  APITypes.OnCreateConversationMessageGeneralChatSubscription
>;
export const onCreateCrmProject = /* GraphQL */ `subscription OnCreateCrmProject(
  $filter: ModelSubscriptionCrmProjectFilterInput
  $owner: String
) {
  onCreateCrmProject(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCrmProjectSubscriptionVariables,
  APITypes.OnCreateCrmProjectSubscription
>;
export const onCreateCrmProjectImport = /* GraphQL */ `subscription OnCreateCrmProjectImport(
  $filter: ModelSubscriptionCrmProjectImportFilterInput
  $owner: String
) {
  onCreateCrmProjectImport(filter: $filter, owner: $owner) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCrmProjectImportSubscriptionVariables,
  APITypes.OnCreateCrmProjectImportSubscription
>;
export const onCreateCrmProjectProjects = /* GraphQL */ `subscription OnCreateCrmProjectProjects(
  $filter: ModelSubscriptionCrmProjectProjectsFilterInput
  $owner: String
) {
  onCreateCrmProjectProjects(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCrmProjectProjectsSubscriptionVariables,
  APITypes.OnCreateCrmProjectProjectsSubscription
>;
export const onCreateCurrentContext = /* GraphQL */ `subscription OnCreateCurrentContext(
  $filter: ModelSubscriptionCurrentContextFilterInput
  $owner: String
) {
  onCreateCurrentContext(filter: $filter, owner: $owner) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCurrentContextSubscriptionVariables,
  APITypes.OnCreateCurrentContextSubscription
>;
export const onCreateDailyPlan = /* GraphQL */ `subscription OnCreateDailyPlan(
  $filter: ModelSubscriptionDailyPlanFilterInput
  $owner: String
) {
  onCreateDailyPlan(filter: $filter, owner: $owner) {
    context
    createdAt
    day
    dayGoal
    id
    owner
    projects {
      nextToken
      __typename
    }
    status
    todos {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateDailyPlanSubscriptionVariables,
  APITypes.OnCreateDailyPlanSubscription
>;
export const onCreateDailyPlanProject = /* GraphQL */ `subscription OnCreateDailyPlanProject(
  $filter: ModelSubscriptionDailyPlanProjectFilterInput
  $owner: String
) {
  onCreateDailyPlanProject(filter: $filter, owner: $owner) {
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
    maybe
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateDailyPlanProjectSubscriptionVariables,
  APITypes.OnCreateDailyPlanProjectSubscription
>;
export const onCreateDailyPlanTodo = /* GraphQL */ `subscription OnCreateDailyPlanTodo(
  $filter: ModelSubscriptionDailyPlanTodoFilterInput
  $owner: String
) {
  onCreateDailyPlanTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDailyPlanTodoSubscriptionVariables,
  APITypes.OnCreateDailyPlanTodoSubscription
>;
export const onCreateInbox = /* GraphQL */ `subscription OnCreateInbox(
  $filter: ModelSubscriptionInboxFilterInput
  $owner: String
) {
  onCreateInbox(filter: $filter, owner: $owner) {
    createdAt
    formatVersion
    id
    movedToAccountLearningId
    movedToActivityId
    movedToPersonLearningId
    note
    noteJson
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateInboxSubscriptionVariables,
  APITypes.OnCreateInboxSubscription
>;
export const onCreateMeeting = /* GraphQL */ `subscription OnCreateMeeting(
  $filter: ModelSubscriptionMeetingFilterInput
  $owner: String
) {
  onCreateMeeting(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMeetingSubscriptionVariables,
  APITypes.OnCreateMeetingSubscription
>;
export const onCreateMeetingParticipant = /* GraphQL */ `subscription OnCreateMeetingParticipant(
  $filter: ModelSubscriptionMeetingParticipantFilterInput
  $owner: String
) {
  onCreateMeetingParticipant(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMeetingParticipantSubscriptionVariables,
  APITypes.OnCreateMeetingParticipantSubscription
>;
export const onCreateMonth = /* GraphQL */ `subscription OnCreateMonth(
  $filter: ModelSubscriptionMonthFilterInput
  $owner: String
) {
  onCreateMonth(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMonthSubscriptionVariables,
  APITypes.OnCreateMonthSubscription
>;
export const onCreateMrrDataUpload = /* GraphQL */ `subscription OnCreateMrrDataUpload(
  $filter: ModelSubscriptionMrrDataUploadFilterInput
  $owner: String
) {
  onCreateMrrDataUpload(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMrrDataUploadSubscriptionVariables,
  APITypes.OnCreateMrrDataUploadSubscription
>;
export const onCreateNoteBlock = /* GraphQL */ `subscription OnCreateNoteBlock(
  $filter: ModelSubscriptionNoteBlockFilterInput
  $owner: String
) {
  onCreateNoteBlock(filter: $filter, owner: $owner) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      name
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
` as GeneratedSubscription<
  APITypes.OnCreateNoteBlockSubscriptionVariables,
  APITypes.OnCreateNoteBlockSubscription
>;
export const onCreateNoteBlockPerson = /* GraphQL */ `subscription OnCreateNoteBlockPerson(
  $filter: ModelSubscriptionNoteBlockPersonFilterInput
  $owner: String
) {
  onCreateNoteBlockPerson(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNoteBlockPersonSubscriptionVariables,
  APITypes.OnCreateNoteBlockPersonSubscription
>;
export const onCreateNotesBibleChapter = /* GraphQL */ `subscription OnCreateNotesBibleChapter(
  $filter: ModelSubscriptionNotesBibleChapterFilterInput
  $owner: String
) {
  onCreateNotesBibleChapter(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNotesBibleChapterSubscriptionVariables,
  APITypes.OnCreateNotesBibleChapterSubscription
>;
export const onCreatePayerAccount = /* GraphQL */ `subscription OnCreatePayerAccount(
  $filter: ModelSubscriptionPayerAccountFilterInput
  $owner: String
) {
  onCreatePayerAccount(filter: $filter, owner: $owner) {
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
    notes
    owner
    reseller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    resellerId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePayerAccountSubscriptionVariables,
  APITypes.OnCreatePayerAccountSubscription
>;
export const onCreatePayerAccountMrr = /* GraphQL */ `subscription OnCreatePayerAccountMrr(
  $filter: ModelSubscriptionPayerAccountMrrFilterInput
  $owner: String
) {
  onCreatePayerAccountMrr(filter: $filter, owner: $owner) {
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
      notes
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
` as GeneratedSubscription<
  APITypes.OnCreatePayerAccountMrrSubscriptionVariables,
  APITypes.OnCreatePayerAccountMrrSubscription
>;
export const onCreatePerson = /* GraphQL */ `subscription OnCreatePerson(
  $filter: ModelSubscriptionPersonFilterInput
  $owner: String
) {
  onCreatePerson(filter: $filter, owner: $owner) {
    accountLearnings {
      nextToken
      __typename
    }
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
` as GeneratedSubscription<
  APITypes.OnCreatePersonSubscriptionVariables,
  APITypes.OnCreatePersonSubscription
>;
export const onCreatePersonAccount = /* GraphQL */ `subscription OnCreatePersonAccount(
  $filter: ModelSubscriptionPersonAccountFilterInput
  $owner: String
) {
  onCreatePersonAccount(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
` as GeneratedSubscription<
  APITypes.OnCreatePersonAccountSubscriptionVariables,
  APITypes.OnCreatePersonAccountSubscription
>;
export const onCreatePersonDetail = /* GraphQL */ `subscription OnCreatePersonDetail(
  $filter: ModelSubscriptionPersonDetailFilterInput
  $owner: String
) {
  onCreatePersonDetail(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePersonDetailSubscriptionVariables,
  APITypes.OnCreatePersonDetailSubscription
>;
export const onCreatePersonLearning = /* GraphQL */ `subscription OnCreatePersonLearning(
  $filter: ModelSubscriptionPersonLearningFilterInput
  $owner: String
) {
  onCreatePersonLearning(filter: $filter, owner: $owner) {
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
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePersonLearningSubscriptionVariables,
  APITypes.OnCreatePersonLearningSubscription
>;
export const onCreatePersonRelationship = /* GraphQL */ `subscription OnCreatePersonRelationship(
  $filter: ModelSubscriptionPersonRelationshipFilterInput
  $owner: String
) {
  onCreatePersonRelationship(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePersonRelationshipSubscriptionVariables,
  APITypes.OnCreatePersonRelationshipSubscription
>;
export const onCreateProjectActivity = /* GraphQL */ `subscription OnCreateProjectActivity(
  $filter: ModelSubscriptionProjectActivityFilterInput
  $owner: String
) {
  onCreateProjectActivity(filter: $filter, owner: $owner) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      name
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateProjectActivitySubscriptionVariables,
  APITypes.OnCreateProjectActivitySubscription
>;
export const onCreateProjects = /* GraphQL */ `subscription OnCreateProjects(
  $filter: ModelSubscriptionProjectsFilterInput
  $owner: String
) {
  onCreateProjects(filter: $filter, owner: $owner) {
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
    dayPlans {
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
    order
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
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    partnerId
    pinned
    project
    tasksSummary
    tasksSummaryUpdatedAt
    updatedAt
    weekPlans {
      nextToken
      __typename
    }
    weeklyReviews {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateProjectsSubscriptionVariables,
  APITypes.OnCreateProjectsSubscription
>;
export const onCreateSixWeekBatch = /* GraphQL */ `subscription OnCreateSixWeekBatch(
  $filter: ModelSubscriptionSixWeekBatchFilterInput
  $owner: String
) {
  onCreateSixWeekBatch(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSixWeekBatchSubscriptionVariables,
  APITypes.OnCreateSixWeekBatchSubscription
>;
export const onCreateSixWeekBatchProjects = /* GraphQL */ `subscription OnCreateSixWeekBatchProjects(
  $filter: ModelSubscriptionSixWeekBatchProjectsFilterInput
  $owner: String
) {
  onCreateSixWeekBatchProjects(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
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
` as GeneratedSubscription<
  APITypes.OnCreateSixWeekBatchProjectsSubscriptionVariables,
  APITypes.OnCreateSixWeekBatchProjectsSubscription
>;
export const onCreateSixWeekCycle = /* GraphQL */ `subscription OnCreateSixWeekCycle(
  $filter: ModelSubscriptionSixWeekCycleFilterInput
  $owner: String
) {
  onCreateSixWeekCycle(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSixWeekCycleSubscriptionVariables,
  APITypes.OnCreateSixWeekCycleSubscription
>;
export const onCreateTerritory = /* GraphQL */ `subscription OnCreateTerritory(
  $filter: ModelSubscriptionTerritoryFilterInput
  $owner: String
) {
  onCreateTerritory(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTerritorySubscriptionVariables,
  APITypes.OnCreateTerritorySubscription
>;
export const onCreateTerritoryResponsibility = /* GraphQL */ `subscription OnCreateTerritoryResponsibility(
  $filter: ModelSubscriptionTerritoryResponsibilityFilterInput
  $owner: String
) {
  onCreateTerritoryResponsibility(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTerritoryResponsibilitySubscriptionVariables,
  APITypes.OnCreateTerritoryResponsibilitySubscription
>;
export const onCreateTodo = /* GraphQL */ `subscription OnCreateTodo(
  $filter: ModelSubscriptionTodoFilterInput
  $owner: String
) {
  onCreateTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTodoSubscriptionVariables,
  APITypes.OnCreateTodoSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $profileId: String
) {
  onCreateUser(filter: $filter, profileId: $profileId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onCreateWeeklyPlan = /* GraphQL */ `subscription OnCreateWeeklyPlan(
  $filter: ModelSubscriptionWeeklyPlanFilterInput
  $owner: String
) {
  onCreateWeeklyPlan(filter: $filter, owner: $owner) {
    createdAt
    crmUpdateSkipped
    financialUpdateSkipped
    id
    inboxSkipped
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
` as GeneratedSubscription<
  APITypes.OnCreateWeeklyPlanSubscriptionVariables,
  APITypes.OnCreateWeeklyPlanSubscription
>;
export const onCreateWeeklyPlanProject = /* GraphQL */ `subscription OnCreateWeeklyPlanProject(
  $filter: ModelSubscriptionWeeklyPlanProjectFilterInput
  $owner: String
) {
  onCreateWeeklyPlanProject(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    weekPlan {
      createdAt
      crmUpdateSkipped
      financialUpdateSkipped
      id
      inboxSkipped
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
` as GeneratedSubscription<
  APITypes.OnCreateWeeklyPlanProjectSubscriptionVariables,
  APITypes.OnCreateWeeklyPlanProjectSubscription
>;
export const onCreateWeeklyReview = /* GraphQL */ `subscription OnCreateWeeklyReview(
  $filter: ModelSubscriptionWeeklyReviewFilterInput
  $owner: String
) {
  onCreateWeeklyReview(filter: $filter, owner: $owner) {
    createdAt
    date
    entries {
      nextToken
      __typename
    }
    id
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateWeeklyReviewSubscriptionVariables,
  APITypes.OnCreateWeeklyReviewSubscription
>;
export const onCreateWeeklyReviewEntry = /* GraphQL */ `subscription OnCreateWeeklyReviewEntry(
  $filter: ModelSubscriptionWeeklyReviewEntryFilterInput
  $owner: String
) {
  onCreateWeeklyReviewEntry(filter: $filter, owner: $owner) {
    category
    content
    createdAt
    generatedContent
    id
    isEdited
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    review {
      createdAt
      date
      id
      owner
      status
      updatedAt
      __typename
    }
    reviewId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateWeeklyReviewEntrySubscriptionVariables,
  APITypes.OnCreateWeeklyReviewEntrySubscription
>;
export const onDeleteAccount = /* GraphQL */ `subscription OnDeleteAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onDeleteAccount(filter: $filter, owner: $owner) {
    accountSubsidiariesId
    awsAccounts {
      nextToken
      __typename
    }
    controller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    createdAt
    crmId
    formatVersion
    id
    introduction
    introductionJson
    learnings {
      nextToken
      __typename
    }
    mainColor
    name
    notionId
    order
    owner
    partnerProjects {
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
    shortName
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccountSubscriptionVariables,
  APITypes.OnDeleteAccountSubscription
>;
export const onDeleteAccountLearning = /* GraphQL */ `subscription OnDeleteAccountLearning(
  $filter: ModelSubscriptionAccountLearningFilterInput
  $owner: String
) {
  onDeleteAccountLearning(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    accountId
    createdAt
    id
    learnedOn
    learning
    owner
    peopleMentioned {
      nextToken
      __typename
    }
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAccountLearningSubscriptionVariables,
  APITypes.OnDeleteAccountLearningSubscription
>;
export const onDeleteAccountLearningPerson = /* GraphQL */ `subscription OnDeleteAccountLearningPerson(
  $filter: ModelSubscriptionAccountLearningPersonFilterInput
  $owner: String
) {
  onDeleteAccountLearningPerson(filter: $filter, owner: $owner) {
    createdAt
    id
    learning {
      accountId
      createdAt
      id
      learnedOn
      learning
      owner
      status
      updatedAt
      __typename
    }
    learningId
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccountLearningPersonSubscriptionVariables,
  APITypes.OnDeleteAccountLearningPersonSubscription
>;
export const onDeleteAccountPayerAccount = /* GraphQL */ `subscription OnDeleteAccountPayerAccount(
  $filter: ModelSubscriptionAccountPayerAccountFilterInput
  $owner: String
) {
  onDeleteAccountPayerAccount(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    accountId
    awsAccountNumber {
      awsAccountNumber
      createdAt
      isViaReseller
      mainContactId
      notes
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccountPayerAccountSubscriptionVariables,
  APITypes.OnDeleteAccountPayerAccountSubscription
>;
export const onDeleteAccountProjects = /* GraphQL */ `subscription OnDeleteAccountProjects(
  $filter: ModelSubscriptionAccountProjectsFilterInput
  $owner: String
) {
  onDeleteAccountProjects(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAccountProjectsSubscriptionVariables,
  APITypes.OnDeleteAccountProjectsSubscription
>;
export const onDeleteAccountTerritory = /* GraphQL */ `subscription OnDeleteAccountTerritory(
  $filter: ModelSubscriptionAccountTerritoryFilterInput
  $owner: String
) {
  onDeleteAccountTerritory(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccountTerritorySubscriptionVariables,
  APITypes.OnDeleteAccountTerritorySubscription
>;
export const onDeleteActivity = /* GraphQL */ `subscription OnDeleteActivity(
  $filter: ModelSubscriptionActivityFilterInput
  $owner: String
) {
  onDeleteActivity(filter: $filter, owner: $owner) {
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
    name
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
` as GeneratedSubscription<
  APITypes.OnDeleteActivitySubscriptionVariables,
  APITypes.OnDeleteActivitySubscription
>;
export const onDeleteApiKeysForAi = /* GraphQL */ `subscription OnDeleteApiKeysForAi(
  $filter: ModelSubscriptionApiKeysForAiFilterInput
  $owner: String
) {
  onDeleteApiKeysForAi(filter: $filter, owner: $owner) {
    apiKey
    createdAt
    dataSource
    itemId
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteApiKeysForAiSubscriptionVariables,
  APITypes.OnDeleteApiKeysForAiSubscription
>;
export const onDeleteBookOfBible = /* GraphQL */ `subscription OnDeleteBookOfBible(
  $filter: ModelSubscriptionBookOfBibleFilterInput
  $owner: String
) {
  onDeleteBookOfBible(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBookOfBibleSubscriptionVariables,
  APITypes.OnDeleteBookOfBibleSubscription
>;
export const onDeleteCrmProject = /* GraphQL */ `subscription OnDeleteCrmProject(
  $filter: ModelSubscriptionCrmProjectFilterInput
  $owner: String
) {
  onDeleteCrmProject(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCrmProjectSubscriptionVariables,
  APITypes.OnDeleteCrmProjectSubscription
>;
export const onDeleteCrmProjectImport = /* GraphQL */ `subscription OnDeleteCrmProjectImport(
  $filter: ModelSubscriptionCrmProjectImportFilterInput
  $owner: String
) {
  onDeleteCrmProjectImport(filter: $filter, owner: $owner) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCrmProjectImportSubscriptionVariables,
  APITypes.OnDeleteCrmProjectImportSubscription
>;
export const onDeleteCrmProjectProjects = /* GraphQL */ `subscription OnDeleteCrmProjectProjects(
  $filter: ModelSubscriptionCrmProjectProjectsFilterInput
  $owner: String
) {
  onDeleteCrmProjectProjects(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCrmProjectProjectsSubscriptionVariables,
  APITypes.OnDeleteCrmProjectProjectsSubscription
>;
export const onDeleteCurrentContext = /* GraphQL */ `subscription OnDeleteCurrentContext(
  $filter: ModelSubscriptionCurrentContextFilterInput
  $owner: String
) {
  onDeleteCurrentContext(filter: $filter, owner: $owner) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCurrentContextSubscriptionVariables,
  APITypes.OnDeleteCurrentContextSubscription
>;
export const onDeleteDailyPlan = /* GraphQL */ `subscription OnDeleteDailyPlan(
  $filter: ModelSubscriptionDailyPlanFilterInput
  $owner: String
) {
  onDeleteDailyPlan(filter: $filter, owner: $owner) {
    context
    createdAt
    day
    dayGoal
    id
    owner
    projects {
      nextToken
      __typename
    }
    status
    todos {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteDailyPlanSubscriptionVariables,
  APITypes.OnDeleteDailyPlanSubscription
>;
export const onDeleteDailyPlanProject = /* GraphQL */ `subscription OnDeleteDailyPlanProject(
  $filter: ModelSubscriptionDailyPlanProjectFilterInput
  $owner: String
) {
  onDeleteDailyPlanProject(filter: $filter, owner: $owner) {
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
    maybe
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteDailyPlanProjectSubscriptionVariables,
  APITypes.OnDeleteDailyPlanProjectSubscription
>;
export const onDeleteDailyPlanTodo = /* GraphQL */ `subscription OnDeleteDailyPlanTodo(
  $filter: ModelSubscriptionDailyPlanTodoFilterInput
  $owner: String
) {
  onDeleteDailyPlanTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDailyPlanTodoSubscriptionVariables,
  APITypes.OnDeleteDailyPlanTodoSubscription
>;
export const onDeleteInbox = /* GraphQL */ `subscription OnDeleteInbox(
  $filter: ModelSubscriptionInboxFilterInput
  $owner: String
) {
  onDeleteInbox(filter: $filter, owner: $owner) {
    createdAt
    formatVersion
    id
    movedToAccountLearningId
    movedToActivityId
    movedToPersonLearningId
    note
    noteJson
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteInboxSubscriptionVariables,
  APITypes.OnDeleteInboxSubscription
>;
export const onDeleteMeeting = /* GraphQL */ `subscription OnDeleteMeeting(
  $filter: ModelSubscriptionMeetingFilterInput
  $owner: String
) {
  onDeleteMeeting(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMeetingSubscriptionVariables,
  APITypes.OnDeleteMeetingSubscription
>;
export const onDeleteMeetingParticipant = /* GraphQL */ `subscription OnDeleteMeetingParticipant(
  $filter: ModelSubscriptionMeetingParticipantFilterInput
  $owner: String
) {
  onDeleteMeetingParticipant(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMeetingParticipantSubscriptionVariables,
  APITypes.OnDeleteMeetingParticipantSubscription
>;
export const onDeleteMonth = /* GraphQL */ `subscription OnDeleteMonth(
  $filter: ModelSubscriptionMonthFilterInput
  $owner: String
) {
  onDeleteMonth(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMonthSubscriptionVariables,
  APITypes.OnDeleteMonthSubscription
>;
export const onDeleteMrrDataUpload = /* GraphQL */ `subscription OnDeleteMrrDataUpload(
  $filter: ModelSubscriptionMrrDataUploadFilterInput
  $owner: String
) {
  onDeleteMrrDataUpload(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMrrDataUploadSubscriptionVariables,
  APITypes.OnDeleteMrrDataUploadSubscription
>;
export const onDeleteNoteBlock = /* GraphQL */ `subscription OnDeleteNoteBlock(
  $filter: ModelSubscriptionNoteBlockFilterInput
  $owner: String
) {
  onDeleteNoteBlock(filter: $filter, owner: $owner) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      name
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
` as GeneratedSubscription<
  APITypes.OnDeleteNoteBlockSubscriptionVariables,
  APITypes.OnDeleteNoteBlockSubscription
>;
export const onDeleteNoteBlockPerson = /* GraphQL */ `subscription OnDeleteNoteBlockPerson(
  $filter: ModelSubscriptionNoteBlockPersonFilterInput
  $owner: String
) {
  onDeleteNoteBlockPerson(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNoteBlockPersonSubscriptionVariables,
  APITypes.OnDeleteNoteBlockPersonSubscription
>;
export const onDeleteNotesBibleChapter = /* GraphQL */ `subscription OnDeleteNotesBibleChapter(
  $filter: ModelSubscriptionNotesBibleChapterFilterInput
  $owner: String
) {
  onDeleteNotesBibleChapter(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNotesBibleChapterSubscriptionVariables,
  APITypes.OnDeleteNotesBibleChapterSubscription
>;
export const onDeletePayerAccount = /* GraphQL */ `subscription OnDeletePayerAccount(
  $filter: ModelSubscriptionPayerAccountFilterInput
  $owner: String
) {
  onDeletePayerAccount(filter: $filter, owner: $owner) {
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
    notes
    owner
    reseller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    resellerId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePayerAccountSubscriptionVariables,
  APITypes.OnDeletePayerAccountSubscription
>;
export const onDeletePayerAccountMrr = /* GraphQL */ `subscription OnDeletePayerAccountMrr(
  $filter: ModelSubscriptionPayerAccountMrrFilterInput
  $owner: String
) {
  onDeletePayerAccountMrr(filter: $filter, owner: $owner) {
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
      notes
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
` as GeneratedSubscription<
  APITypes.OnDeletePayerAccountMrrSubscriptionVariables,
  APITypes.OnDeletePayerAccountMrrSubscription
>;
export const onDeletePerson = /* GraphQL */ `subscription OnDeletePerson(
  $filter: ModelSubscriptionPersonFilterInput
  $owner: String
) {
  onDeletePerson(filter: $filter, owner: $owner) {
    accountLearnings {
      nextToken
      __typename
    }
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
` as GeneratedSubscription<
  APITypes.OnDeletePersonSubscriptionVariables,
  APITypes.OnDeletePersonSubscription
>;
export const onDeletePersonAccount = /* GraphQL */ `subscription OnDeletePersonAccount(
  $filter: ModelSubscriptionPersonAccountFilterInput
  $owner: String
) {
  onDeletePersonAccount(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
` as GeneratedSubscription<
  APITypes.OnDeletePersonAccountSubscriptionVariables,
  APITypes.OnDeletePersonAccountSubscription
>;
export const onDeletePersonDetail = /* GraphQL */ `subscription OnDeletePersonDetail(
  $filter: ModelSubscriptionPersonDetailFilterInput
  $owner: String
) {
  onDeletePersonDetail(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePersonDetailSubscriptionVariables,
  APITypes.OnDeletePersonDetailSubscription
>;
export const onDeletePersonLearning = /* GraphQL */ `subscription OnDeletePersonLearning(
  $filter: ModelSubscriptionPersonLearningFilterInput
  $owner: String
) {
  onDeletePersonLearning(filter: $filter, owner: $owner) {
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
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePersonLearningSubscriptionVariables,
  APITypes.OnDeletePersonLearningSubscription
>;
export const onDeletePersonRelationship = /* GraphQL */ `subscription OnDeletePersonRelationship(
  $filter: ModelSubscriptionPersonRelationshipFilterInput
  $owner: String
) {
  onDeletePersonRelationship(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePersonRelationshipSubscriptionVariables,
  APITypes.OnDeletePersonRelationshipSubscription
>;
export const onDeleteProjectActivity = /* GraphQL */ `subscription OnDeleteProjectActivity(
  $filter: ModelSubscriptionProjectActivityFilterInput
  $owner: String
) {
  onDeleteProjectActivity(filter: $filter, owner: $owner) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      name
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteProjectActivitySubscriptionVariables,
  APITypes.OnDeleteProjectActivitySubscription
>;
export const onDeleteProjects = /* GraphQL */ `subscription OnDeleteProjects(
  $filter: ModelSubscriptionProjectsFilterInput
  $owner: String
) {
  onDeleteProjects(filter: $filter, owner: $owner) {
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
    dayPlans {
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
    order
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
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    partnerId
    pinned
    project
    tasksSummary
    tasksSummaryUpdatedAt
    updatedAt
    weekPlans {
      nextToken
      __typename
    }
    weeklyReviews {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteProjectsSubscriptionVariables,
  APITypes.OnDeleteProjectsSubscription
>;
export const onDeleteSixWeekBatch = /* GraphQL */ `subscription OnDeleteSixWeekBatch(
  $filter: ModelSubscriptionSixWeekBatchFilterInput
  $owner: String
) {
  onDeleteSixWeekBatch(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSixWeekBatchSubscriptionVariables,
  APITypes.OnDeleteSixWeekBatchSubscription
>;
export const onDeleteSixWeekBatchProjects = /* GraphQL */ `subscription OnDeleteSixWeekBatchProjects(
  $filter: ModelSubscriptionSixWeekBatchProjectsFilterInput
  $owner: String
) {
  onDeleteSixWeekBatchProjects(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
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
` as GeneratedSubscription<
  APITypes.OnDeleteSixWeekBatchProjectsSubscriptionVariables,
  APITypes.OnDeleteSixWeekBatchProjectsSubscription
>;
export const onDeleteSixWeekCycle = /* GraphQL */ `subscription OnDeleteSixWeekCycle(
  $filter: ModelSubscriptionSixWeekCycleFilterInput
  $owner: String
) {
  onDeleteSixWeekCycle(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSixWeekCycleSubscriptionVariables,
  APITypes.OnDeleteSixWeekCycleSubscription
>;
export const onDeleteTerritory = /* GraphQL */ `subscription OnDeleteTerritory(
  $filter: ModelSubscriptionTerritoryFilterInput
  $owner: String
) {
  onDeleteTerritory(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTerritorySubscriptionVariables,
  APITypes.OnDeleteTerritorySubscription
>;
export const onDeleteTerritoryResponsibility = /* GraphQL */ `subscription OnDeleteTerritoryResponsibility(
  $filter: ModelSubscriptionTerritoryResponsibilityFilterInput
  $owner: String
) {
  onDeleteTerritoryResponsibility(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTerritoryResponsibilitySubscriptionVariables,
  APITypes.OnDeleteTerritoryResponsibilitySubscription
>;
export const onDeleteTodo = /* GraphQL */ `subscription OnDeleteTodo(
  $filter: ModelSubscriptionTodoFilterInput
  $owner: String
) {
  onDeleteTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTodoSubscriptionVariables,
  APITypes.OnDeleteTodoSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $profileId: String
) {
  onDeleteUser(filter: $filter, profileId: $profileId) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onDeleteWeeklyPlan = /* GraphQL */ `subscription OnDeleteWeeklyPlan(
  $filter: ModelSubscriptionWeeklyPlanFilterInput
  $owner: String
) {
  onDeleteWeeklyPlan(filter: $filter, owner: $owner) {
    createdAt
    crmUpdateSkipped
    financialUpdateSkipped
    id
    inboxSkipped
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
` as GeneratedSubscription<
  APITypes.OnDeleteWeeklyPlanSubscriptionVariables,
  APITypes.OnDeleteWeeklyPlanSubscription
>;
export const onDeleteWeeklyPlanProject = /* GraphQL */ `subscription OnDeleteWeeklyPlanProject(
  $filter: ModelSubscriptionWeeklyPlanProjectFilterInput
  $owner: String
) {
  onDeleteWeeklyPlanProject(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    weekPlan {
      createdAt
      crmUpdateSkipped
      financialUpdateSkipped
      id
      inboxSkipped
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
` as GeneratedSubscription<
  APITypes.OnDeleteWeeklyPlanProjectSubscriptionVariables,
  APITypes.OnDeleteWeeklyPlanProjectSubscription
>;
export const onDeleteWeeklyReview = /* GraphQL */ `subscription OnDeleteWeeklyReview(
  $filter: ModelSubscriptionWeeklyReviewFilterInput
  $owner: String
) {
  onDeleteWeeklyReview(filter: $filter, owner: $owner) {
    createdAt
    date
    entries {
      nextToken
      __typename
    }
    id
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteWeeklyReviewSubscriptionVariables,
  APITypes.OnDeleteWeeklyReviewSubscription
>;
export const onDeleteWeeklyReviewEntry = /* GraphQL */ `subscription OnDeleteWeeklyReviewEntry(
  $filter: ModelSubscriptionWeeklyReviewEntryFilterInput
  $owner: String
) {
  onDeleteWeeklyReviewEntry(filter: $filter, owner: $owner) {
    category
    content
    createdAt
    generatedContent
    id
    isEdited
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    review {
      createdAt
      date
      id
      owner
      status
      updatedAt
      __typename
    }
    reviewId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteWeeklyReviewEntrySubscriptionVariables,
  APITypes.OnDeleteWeeklyReviewEntrySubscription
>;
export const onUpdateAccount = /* GraphQL */ `subscription OnUpdateAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onUpdateAccount(filter: $filter, owner: $owner) {
    accountSubsidiariesId
    awsAccounts {
      nextToken
      __typename
    }
    controller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    createdAt
    crmId
    formatVersion
    id
    introduction
    introductionJson
    learnings {
      nextToken
      __typename
    }
    mainColor
    name
    notionId
    order
    owner
    partnerProjects {
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
    shortName
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccountSubscriptionVariables,
  APITypes.OnUpdateAccountSubscription
>;
export const onUpdateAccountLearning = /* GraphQL */ `subscription OnUpdateAccountLearning(
  $filter: ModelSubscriptionAccountLearningFilterInput
  $owner: String
) {
  onUpdateAccountLearning(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    accountId
    createdAt
    id
    learnedOn
    learning
    owner
    peopleMentioned {
      nextToken
      __typename
    }
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAccountLearningSubscriptionVariables,
  APITypes.OnUpdateAccountLearningSubscription
>;
export const onUpdateAccountLearningPerson = /* GraphQL */ `subscription OnUpdateAccountLearningPerson(
  $filter: ModelSubscriptionAccountLearningPersonFilterInput
  $owner: String
) {
  onUpdateAccountLearningPerson(filter: $filter, owner: $owner) {
    createdAt
    id
    learning {
      accountId
      createdAt
      id
      learnedOn
      learning
      owner
      status
      updatedAt
      __typename
    }
    learningId
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccountLearningPersonSubscriptionVariables,
  APITypes.OnUpdateAccountLearningPersonSubscription
>;
export const onUpdateAccountPayerAccount = /* GraphQL */ `subscription OnUpdateAccountPayerAccount(
  $filter: ModelSubscriptionAccountPayerAccountFilterInput
  $owner: String
) {
  onUpdateAccountPayerAccount(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    accountId
    awsAccountNumber {
      awsAccountNumber
      createdAt
      isViaReseller
      mainContactId
      notes
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccountPayerAccountSubscriptionVariables,
  APITypes.OnUpdateAccountPayerAccountSubscription
>;
export const onUpdateAccountProjects = /* GraphQL */ `subscription OnUpdateAccountProjects(
  $filter: ModelSubscriptionAccountProjectsFilterInput
  $owner: String
) {
  onUpdateAccountProjects(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAccountProjectsSubscriptionVariables,
  APITypes.OnUpdateAccountProjectsSubscription
>;
export const onUpdateAccountTerritory = /* GraphQL */ `subscription OnUpdateAccountTerritory(
  $filter: ModelSubscriptionAccountTerritoryFilterInput
  $owner: String
) {
  onUpdateAccountTerritory(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccountTerritorySubscriptionVariables,
  APITypes.OnUpdateAccountTerritorySubscription
>;
export const onUpdateActivity = /* GraphQL */ `subscription OnUpdateActivity(
  $filter: ModelSubscriptionActivityFilterInput
  $owner: String
) {
  onUpdateActivity(filter: $filter, owner: $owner) {
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
    name
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
` as GeneratedSubscription<
  APITypes.OnUpdateActivitySubscriptionVariables,
  APITypes.OnUpdateActivitySubscription
>;
export const onUpdateApiKeysForAi = /* GraphQL */ `subscription OnUpdateApiKeysForAi(
  $filter: ModelSubscriptionApiKeysForAiFilterInput
  $owner: String
) {
  onUpdateApiKeysForAi(filter: $filter, owner: $owner) {
    apiKey
    createdAt
    dataSource
    itemId
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateApiKeysForAiSubscriptionVariables,
  APITypes.OnUpdateApiKeysForAiSubscription
>;
export const onUpdateBookOfBible = /* GraphQL */ `subscription OnUpdateBookOfBible(
  $filter: ModelSubscriptionBookOfBibleFilterInput
  $owner: String
) {
  onUpdateBookOfBible(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBookOfBibleSubscriptionVariables,
  APITypes.OnUpdateBookOfBibleSubscription
>;
export const onUpdateCrmProject = /* GraphQL */ `subscription OnUpdateCrmProject(
  $filter: ModelSubscriptionCrmProjectFilterInput
  $owner: String
) {
  onUpdateCrmProject(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCrmProjectSubscriptionVariables,
  APITypes.OnUpdateCrmProjectSubscription
>;
export const onUpdateCrmProjectImport = /* GraphQL */ `subscription OnUpdateCrmProjectImport(
  $filter: ModelSubscriptionCrmProjectImportFilterInput
  $owner: String
) {
  onUpdateCrmProjectImport(filter: $filter, owner: $owner) {
    createdAt
    id
    owner
    s3Key
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCrmProjectImportSubscriptionVariables,
  APITypes.OnUpdateCrmProjectImportSubscription
>;
export const onUpdateCrmProjectProjects = /* GraphQL */ `subscription OnUpdateCrmProjectProjects(
  $filter: ModelSubscriptionCrmProjectProjectsFilterInput
  $owner: String
) {
  onUpdateCrmProjectProjects(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCrmProjectProjectsSubscriptionVariables,
  APITypes.OnUpdateCrmProjectProjectsSubscription
>;
export const onUpdateCurrentContext = /* GraphQL */ `subscription OnUpdateCurrentContext(
  $filter: ModelSubscriptionCurrentContextFilterInput
  $owner: String
) {
  onUpdateCurrentContext(filter: $filter, owner: $owner) {
    context
    createdAt
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCurrentContextSubscriptionVariables,
  APITypes.OnUpdateCurrentContextSubscription
>;
export const onUpdateDailyPlan = /* GraphQL */ `subscription OnUpdateDailyPlan(
  $filter: ModelSubscriptionDailyPlanFilterInput
  $owner: String
) {
  onUpdateDailyPlan(filter: $filter, owner: $owner) {
    context
    createdAt
    day
    dayGoal
    id
    owner
    projects {
      nextToken
      __typename
    }
    status
    todos {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateDailyPlanSubscriptionVariables,
  APITypes.OnUpdateDailyPlanSubscription
>;
export const onUpdateDailyPlanProject = /* GraphQL */ `subscription OnUpdateDailyPlanProject(
  $filter: ModelSubscriptionDailyPlanProjectFilterInput
  $owner: String
) {
  onUpdateDailyPlanProject(filter: $filter, owner: $owner) {
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
    maybe
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateDailyPlanProjectSubscriptionVariables,
  APITypes.OnUpdateDailyPlanProjectSubscription
>;
export const onUpdateDailyPlanTodo = /* GraphQL */ `subscription OnUpdateDailyPlanTodo(
  $filter: ModelSubscriptionDailyPlanTodoFilterInput
  $owner: String
) {
  onUpdateDailyPlanTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDailyPlanTodoSubscriptionVariables,
  APITypes.OnUpdateDailyPlanTodoSubscription
>;
export const onUpdateInbox = /* GraphQL */ `subscription OnUpdateInbox(
  $filter: ModelSubscriptionInboxFilterInput
  $owner: String
) {
  onUpdateInbox(filter: $filter, owner: $owner) {
    createdAt
    formatVersion
    id
    movedToAccountLearningId
    movedToActivityId
    movedToPersonLearningId
    note
    noteJson
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateInboxSubscriptionVariables,
  APITypes.OnUpdateInboxSubscription
>;
export const onUpdateMeeting = /* GraphQL */ `subscription OnUpdateMeeting(
  $filter: ModelSubscriptionMeetingFilterInput
  $owner: String
) {
  onUpdateMeeting(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMeetingSubscriptionVariables,
  APITypes.OnUpdateMeetingSubscription
>;
export const onUpdateMeetingParticipant = /* GraphQL */ `subscription OnUpdateMeetingParticipant(
  $filter: ModelSubscriptionMeetingParticipantFilterInput
  $owner: String
) {
  onUpdateMeetingParticipant(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMeetingParticipantSubscriptionVariables,
  APITypes.OnUpdateMeetingParticipantSubscription
>;
export const onUpdateMonth = /* GraphQL */ `subscription OnUpdateMonth(
  $filter: ModelSubscriptionMonthFilterInput
  $owner: String
) {
  onUpdateMonth(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMonthSubscriptionVariables,
  APITypes.OnUpdateMonthSubscription
>;
export const onUpdateMrrDataUpload = /* GraphQL */ `subscription OnUpdateMrrDataUpload(
  $filter: ModelSubscriptionMrrDataUploadFilterInput
  $owner: String
) {
  onUpdateMrrDataUpload(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMrrDataUploadSubscriptionVariables,
  APITypes.OnUpdateMrrDataUploadSubscription
>;
export const onUpdateNoteBlock = /* GraphQL */ `subscription OnUpdateNoteBlock(
  $filter: ModelSubscriptionNoteBlockFilterInput
  $owner: String
) {
  onUpdateNoteBlock(filter: $filter, owner: $owner) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      name
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
` as GeneratedSubscription<
  APITypes.OnUpdateNoteBlockSubscriptionVariables,
  APITypes.OnUpdateNoteBlockSubscription
>;
export const onUpdateNoteBlockPerson = /* GraphQL */ `subscription OnUpdateNoteBlockPerson(
  $filter: ModelSubscriptionNoteBlockPersonFilterInput
  $owner: String
) {
  onUpdateNoteBlockPerson(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNoteBlockPersonSubscriptionVariables,
  APITypes.OnUpdateNoteBlockPersonSubscription
>;
export const onUpdateNotesBibleChapter = /* GraphQL */ `subscription OnUpdateNotesBibleChapter(
  $filter: ModelSubscriptionNotesBibleChapterFilterInput
  $owner: String
) {
  onUpdateNotesBibleChapter(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNotesBibleChapterSubscriptionVariables,
  APITypes.OnUpdateNotesBibleChapterSubscription
>;
export const onUpdatePayerAccount = /* GraphQL */ `subscription OnUpdatePayerAccount(
  $filter: ModelSubscriptionPayerAccountFilterInput
  $owner: String
) {
  onUpdatePayerAccount(filter: $filter, owner: $owner) {
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
    notes
    owner
    reseller {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    resellerId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePayerAccountSubscriptionVariables,
  APITypes.OnUpdatePayerAccountSubscription
>;
export const onUpdatePayerAccountMrr = /* GraphQL */ `subscription OnUpdatePayerAccountMrr(
  $filter: ModelSubscriptionPayerAccountMrrFilterInput
  $owner: String
) {
  onUpdatePayerAccountMrr(filter: $filter, owner: $owner) {
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
      notes
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
` as GeneratedSubscription<
  APITypes.OnUpdatePayerAccountMrrSubscriptionVariables,
  APITypes.OnUpdatePayerAccountMrrSubscription
>;
export const onUpdatePerson = /* GraphQL */ `subscription OnUpdatePerson(
  $filter: ModelSubscriptionPersonFilterInput
  $owner: String
) {
  onUpdatePerson(filter: $filter, owner: $owner) {
    accountLearnings {
      nextToken
      __typename
    }
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
` as GeneratedSubscription<
  APITypes.OnUpdatePersonSubscriptionVariables,
  APITypes.OnUpdatePersonSubscription
>;
export const onUpdatePersonAccount = /* GraphQL */ `subscription OnUpdatePersonAccount(
  $filter: ModelSubscriptionPersonAccountFilterInput
  $owner: String
) {
  onUpdatePersonAccount(filter: $filter, owner: $owner) {
    account {
      accountSubsidiariesId
      createdAt
      crmId
      formatVersion
      id
      introduction
      introductionJson
      mainColor
      name
      notionId
      order
      owner
      shortName
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
` as GeneratedSubscription<
  APITypes.OnUpdatePersonAccountSubscriptionVariables,
  APITypes.OnUpdatePersonAccountSubscription
>;
export const onUpdatePersonDetail = /* GraphQL */ `subscription OnUpdatePersonDetail(
  $filter: ModelSubscriptionPersonDetailFilterInput
  $owner: String
) {
  onUpdatePersonDetail(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePersonDetailSubscriptionVariables,
  APITypes.OnUpdatePersonDetailSubscription
>;
export const onUpdatePersonLearning = /* GraphQL */ `subscription OnUpdatePersonLearning(
  $filter: ModelSubscriptionPersonLearningFilterInput
  $owner: String
) {
  onUpdatePersonLearning(filter: $filter, owner: $owner) {
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
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePersonLearningSubscriptionVariables,
  APITypes.OnUpdatePersonLearningSubscription
>;
export const onUpdatePersonRelationship = /* GraphQL */ `subscription OnUpdatePersonRelationship(
  $filter: ModelSubscriptionPersonRelationshipFilterInput
  $owner: String
) {
  onUpdatePersonRelationship(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePersonRelationshipSubscriptionVariables,
  APITypes.OnUpdatePersonRelationshipSubscription
>;
export const onUpdateProjectActivity = /* GraphQL */ `subscription OnUpdateProjectActivity(
  $filter: ModelSubscriptionProjectActivityFilterInput
  $owner: String
) {
  onUpdateProjectActivity(filter: $filter, owner: $owner) {
    activity {
      createdAt
      finishedOn
      formatVersion
      id
      meetingActivitiesId
      name
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectsId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateProjectActivitySubscriptionVariables,
  APITypes.OnUpdateProjectActivitySubscription
>;
export const onUpdateProjects = /* GraphQL */ `subscription OnUpdateProjects(
  $filter: ModelSubscriptionProjectsFilterInput
  $owner: String
) {
  onUpdateProjects(filter: $filter, owner: $owner) {
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
    dayPlans {
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
    order
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
      mainColor
      name
      notionId
      order
      owner
      shortName
      updatedAt
      __typename
    }
    partnerId
    pinned
    project
    tasksSummary
    tasksSummaryUpdatedAt
    updatedAt
    weekPlans {
      nextToken
      __typename
    }
    weeklyReviews {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateProjectsSubscriptionVariables,
  APITypes.OnUpdateProjectsSubscription
>;
export const onUpdateSixWeekBatch = /* GraphQL */ `subscription OnUpdateSixWeekBatch(
  $filter: ModelSubscriptionSixWeekBatchFilterInput
  $owner: String
) {
  onUpdateSixWeekBatch(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSixWeekBatchSubscriptionVariables,
  APITypes.OnUpdateSixWeekBatchSubscription
>;
export const onUpdateSixWeekBatchProjects = /* GraphQL */ `subscription OnUpdateSixWeekBatchProjects(
  $filter: ModelSubscriptionSixWeekBatchProjectsFilterInput
  $owner: String
) {
  onUpdateSixWeekBatchProjects(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
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
` as GeneratedSubscription<
  APITypes.OnUpdateSixWeekBatchProjectsSubscriptionVariables,
  APITypes.OnUpdateSixWeekBatchProjectsSubscription
>;
export const onUpdateSixWeekCycle = /* GraphQL */ `subscription OnUpdateSixWeekCycle(
  $filter: ModelSubscriptionSixWeekCycleFilterInput
  $owner: String
) {
  onUpdateSixWeekCycle(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSixWeekCycleSubscriptionVariables,
  APITypes.OnUpdateSixWeekCycleSubscription
>;
export const onUpdateTerritory = /* GraphQL */ `subscription OnUpdateTerritory(
  $filter: ModelSubscriptionTerritoryFilterInput
  $owner: String
) {
  onUpdateTerritory(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTerritorySubscriptionVariables,
  APITypes.OnUpdateTerritorySubscription
>;
export const onUpdateTerritoryResponsibility = /* GraphQL */ `subscription OnUpdateTerritoryResponsibility(
  $filter: ModelSubscriptionTerritoryResponsibilityFilterInput
  $owner: String
) {
  onUpdateTerritoryResponsibility(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTerritoryResponsibilitySubscriptionVariables,
  APITypes.OnUpdateTerritoryResponsibilitySubscription
>;
export const onUpdateTodo = /* GraphQL */ `subscription OnUpdateTodo(
  $filter: ModelSubscriptionTodoFilterInput
  $owner: String
) {
  onUpdateTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTodoSubscriptionVariables,
  APITypes.OnUpdateTodoSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $profileId: String
) {
  onUpdateUser(filter: $filter, profileId: $profileId) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onUpdateWeeklyPlan = /* GraphQL */ `subscription OnUpdateWeeklyPlan(
  $filter: ModelSubscriptionWeeklyPlanFilterInput
  $owner: String
) {
  onUpdateWeeklyPlan(filter: $filter, owner: $owner) {
    createdAt
    crmUpdateSkipped
    financialUpdateSkipped
    id
    inboxSkipped
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
` as GeneratedSubscription<
  APITypes.OnUpdateWeeklyPlanSubscriptionVariables,
  APITypes.OnUpdateWeeklyPlanSubscription
>;
export const onUpdateWeeklyPlanProject = /* GraphQL */ `subscription OnUpdateWeeklyPlanProject(
  $filter: ModelSubscriptionWeeklyPlanProjectFilterInput
  $owner: String
) {
  onUpdateWeeklyPlanProject(filter: $filter, owner: $owner) {
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    updatedAt
    weekPlan {
      createdAt
      crmUpdateSkipped
      financialUpdateSkipped
      id
      inboxSkipped
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
` as GeneratedSubscription<
  APITypes.OnUpdateWeeklyPlanProjectSubscriptionVariables,
  APITypes.OnUpdateWeeklyPlanProjectSubscription
>;
export const onUpdateWeeklyReview = /* GraphQL */ `subscription OnUpdateWeeklyReview(
  $filter: ModelSubscriptionWeeklyReviewFilterInput
  $owner: String
) {
  onUpdateWeeklyReview(filter: $filter, owner: $owner) {
    createdAt
    date
    entries {
      nextToken
      __typename
    }
    id
    owner
    status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateWeeklyReviewSubscriptionVariables,
  APITypes.OnUpdateWeeklyReviewSubscription
>;
export const onUpdateWeeklyReviewEntry = /* GraphQL */ `subscription OnUpdateWeeklyReviewEntry(
  $filter: ModelSubscriptionWeeklyReviewEntryFilterInput
  $owner: String
) {
  onUpdateWeeklyReviewEntry(filter: $filter, owner: $owner) {
    category
    content
    createdAt
    generatedContent
    id
    isEdited
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
      order
      othersNextActions
      othersNextActionsJson
      owner
      partnerId
      pinned
      project
      tasksSummary
      tasksSummaryUpdatedAt
      updatedAt
      __typename
    }
    projectId
    review {
      createdAt
      date
      id
      owner
      status
      updatedAt
      __typename
    }
    reviewId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateWeeklyReviewEntrySubscriptionVariables,
  APITypes.OnUpdateWeeklyReviewEntrySubscription
>;
