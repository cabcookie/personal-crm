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
` as GeneratedSubscription<
  APITypes.OnCreateAccountSubscriptionVariables,
  APITypes.OnCreateAccountSubscription
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
` as GeneratedSubscription<
  APITypes.OnCreateActivitySubscriptionVariables,
  APITypes.OnCreateActivitySubscription
>;
export const onCreateCrmProject = /* GraphQL */ `subscription OnCreateCrmProject(
  $filter: ModelSubscriptionCrmProjectFilterInput
  $owner: String
) {
  onCreateCrmProject(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCrmProjectSubscriptionVariables,
  APITypes.OnCreateCrmProjectSubscription
>;
export const onCreateCrmProjectProjects = /* GraphQL */ `subscription OnCreateCrmProjectProjects(
  $filter: ModelSubscriptionCrmProjectProjectsFilterInput
  $owner: String
) {
  onCreateCrmProjectProjects(filter: $filter, owner: $owner) {
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
export const onCreateDayPlan = /* GraphQL */ `subscription OnCreateDayPlan(
  $filter: ModelSubscriptionDayPlanFilterInput
  $owner: String
) {
  onCreateDayPlan(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDayPlanSubscriptionVariables,
  APITypes.OnCreateDayPlanSubscription
>;
export const onCreateDayPlanTodo = /* GraphQL */ `subscription OnCreateDayPlanTodo(
  $filter: ModelSubscriptionDayPlanTodoFilterInput
  $owner: String
) {
  onCreateDayPlanTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDayPlanTodoSubscriptionVariables,
  APITypes.OnCreateDayPlanTodoSubscription
>;
export const onCreateDayProjectTask = /* GraphQL */ `subscription OnCreateDayProjectTask(
  $filter: ModelSubscriptionDayProjectTaskFilterInput
  $owner: String
) {
  onCreateDayProjectTask(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDayProjectTaskSubscriptionVariables,
  APITypes.OnCreateDayProjectTaskSubscription
>;
export const onCreateInbox = /* GraphQL */ `subscription OnCreateInbox(
  $filter: ModelSubscriptionInboxFilterInput
  $owner: String
) {
  onCreateInbox(filter: $filter, owner: $owner) {
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
export const onCreateNonProjectTask = /* GraphQL */ `subscription OnCreateNonProjectTask(
  $filter: ModelSubscriptionNonProjectTaskFilterInput
  $owner: String
) {
  onCreateNonProjectTask(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNonProjectTaskSubscriptionVariables,
  APITypes.OnCreateNonProjectTaskSubscription
>;
export const onCreatePayerAccount = /* GraphQL */ `subscription OnCreatePayerAccount(
  $filter: ModelSubscriptionPayerAccountFilterInput
  $owner: String
) {
  onCreatePayerAccount(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePayerAccountSubscriptionVariables,
  APITypes.OnCreatePayerAccountSubscription
>;
export const onCreatePerson = /* GraphQL */ `subscription OnCreatePerson(
  $filter: ModelSubscriptionPersonFilterInput
  $owner: String
) {
  onCreatePerson(filter: $filter, owner: $owner) {
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
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePersonLearningSubscriptionVariables,
  APITypes.OnCreatePersonLearningSubscription
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
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $profileId: String
) {
  onCreateUser(filter: $filter, profileId: $profileId) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onCreateUserProfile(filter: $filter, profileOwner: $profileOwner) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onDeleteAccount = /* GraphQL */ `subscription OnDeleteAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onDeleteAccount(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccountSubscriptionVariables,
  APITypes.OnDeleteAccountSubscription
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
` as GeneratedSubscription<
  APITypes.OnDeleteActivitySubscriptionVariables,
  APITypes.OnDeleteActivitySubscription
>;
export const onDeleteCrmProject = /* GraphQL */ `subscription OnDeleteCrmProject(
  $filter: ModelSubscriptionCrmProjectFilterInput
  $owner: String
) {
  onDeleteCrmProject(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCrmProjectSubscriptionVariables,
  APITypes.OnDeleteCrmProjectSubscription
>;
export const onDeleteCrmProjectProjects = /* GraphQL */ `subscription OnDeleteCrmProjectProjects(
  $filter: ModelSubscriptionCrmProjectProjectsFilterInput
  $owner: String
) {
  onDeleteCrmProjectProjects(filter: $filter, owner: $owner) {
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
export const onDeleteDayPlan = /* GraphQL */ `subscription OnDeleteDayPlan(
  $filter: ModelSubscriptionDayPlanFilterInput
  $owner: String
) {
  onDeleteDayPlan(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDayPlanSubscriptionVariables,
  APITypes.OnDeleteDayPlanSubscription
>;
export const onDeleteDayPlanTodo = /* GraphQL */ `subscription OnDeleteDayPlanTodo(
  $filter: ModelSubscriptionDayPlanTodoFilterInput
  $owner: String
) {
  onDeleteDayPlanTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDayPlanTodoSubscriptionVariables,
  APITypes.OnDeleteDayPlanTodoSubscription
>;
export const onDeleteDayProjectTask = /* GraphQL */ `subscription OnDeleteDayProjectTask(
  $filter: ModelSubscriptionDayProjectTaskFilterInput
  $owner: String
) {
  onDeleteDayProjectTask(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDayProjectTaskSubscriptionVariables,
  APITypes.OnDeleteDayProjectTaskSubscription
>;
export const onDeleteInbox = /* GraphQL */ `subscription OnDeleteInbox(
  $filter: ModelSubscriptionInboxFilterInput
  $owner: String
) {
  onDeleteInbox(filter: $filter, owner: $owner) {
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
export const onDeleteNonProjectTask = /* GraphQL */ `subscription OnDeleteNonProjectTask(
  $filter: ModelSubscriptionNonProjectTaskFilterInput
  $owner: String
) {
  onDeleteNonProjectTask(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNonProjectTaskSubscriptionVariables,
  APITypes.OnDeleteNonProjectTaskSubscription
>;
export const onDeletePayerAccount = /* GraphQL */ `subscription OnDeletePayerAccount(
  $filter: ModelSubscriptionPayerAccountFilterInput
  $owner: String
) {
  onDeletePayerAccount(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePayerAccountSubscriptionVariables,
  APITypes.OnDeletePayerAccountSubscription
>;
export const onDeletePerson = /* GraphQL */ `subscription OnDeletePerson(
  $filter: ModelSubscriptionPersonFilterInput
  $owner: String
) {
  onDeletePerson(filter: $filter, owner: $owner) {
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
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePersonLearningSubscriptionVariables,
  APITypes.OnDeletePersonLearningSubscription
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
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $profileId: String
) {
  onDeleteUser(filter: $filter, profileId: $profileId) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onDeleteUserProfile(filter: $filter, profileOwner: $profileOwner) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onUpdateAccount = /* GraphQL */ `subscription OnUpdateAccount(
  $filter: ModelSubscriptionAccountFilterInput
  $owner: String
) {
  onUpdateAccount(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccountSubscriptionVariables,
  APITypes.OnUpdateAccountSubscription
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
` as GeneratedSubscription<
  APITypes.OnUpdateActivitySubscriptionVariables,
  APITypes.OnUpdateActivitySubscription
>;
export const onUpdateCrmProject = /* GraphQL */ `subscription OnUpdateCrmProject(
  $filter: ModelSubscriptionCrmProjectFilterInput
  $owner: String
) {
  onUpdateCrmProject(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCrmProjectSubscriptionVariables,
  APITypes.OnUpdateCrmProjectSubscription
>;
export const onUpdateCrmProjectProjects = /* GraphQL */ `subscription OnUpdateCrmProjectProjects(
  $filter: ModelSubscriptionCrmProjectProjectsFilterInput
  $owner: String
) {
  onUpdateCrmProjectProjects(filter: $filter, owner: $owner) {
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
export const onUpdateDayPlan = /* GraphQL */ `subscription OnUpdateDayPlan(
  $filter: ModelSubscriptionDayPlanFilterInput
  $owner: String
) {
  onUpdateDayPlan(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDayPlanSubscriptionVariables,
  APITypes.OnUpdateDayPlanSubscription
>;
export const onUpdateDayPlanTodo = /* GraphQL */ `subscription OnUpdateDayPlanTodo(
  $filter: ModelSubscriptionDayPlanTodoFilterInput
  $owner: String
) {
  onUpdateDayPlanTodo(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDayPlanTodoSubscriptionVariables,
  APITypes.OnUpdateDayPlanTodoSubscription
>;
export const onUpdateDayProjectTask = /* GraphQL */ `subscription OnUpdateDayProjectTask(
  $filter: ModelSubscriptionDayProjectTaskFilterInput
  $owner: String
) {
  onUpdateDayProjectTask(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDayProjectTaskSubscriptionVariables,
  APITypes.OnUpdateDayProjectTaskSubscription
>;
export const onUpdateInbox = /* GraphQL */ `subscription OnUpdateInbox(
  $filter: ModelSubscriptionInboxFilterInput
  $owner: String
) {
  onUpdateInbox(filter: $filter, owner: $owner) {
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
export const onUpdateNonProjectTask = /* GraphQL */ `subscription OnUpdateNonProjectTask(
  $filter: ModelSubscriptionNonProjectTaskFilterInput
  $owner: String
) {
  onUpdateNonProjectTask(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNonProjectTaskSubscriptionVariables,
  APITypes.OnUpdateNonProjectTaskSubscription
>;
export const onUpdatePayerAccount = /* GraphQL */ `subscription OnUpdatePayerAccount(
  $filter: ModelSubscriptionPayerAccountFilterInput
  $owner: String
) {
  onUpdatePayerAccount(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePayerAccountSubscriptionVariables,
  APITypes.OnUpdatePayerAccountSubscription
>;
export const onUpdatePerson = /* GraphQL */ `subscription OnUpdatePerson(
  $filter: ModelSubscriptionPersonFilterInput
  $owner: String
) {
  onUpdatePerson(filter: $filter, owner: $owner) {
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
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePersonLearningSubscriptionVariables,
  APITypes.OnUpdatePersonLearningSubscription
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
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $profileId: String
) {
  onUpdateUser(filter: $filter, profileId: $profileId) {
    createdAt
    email
    name
    profileId
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $profileOwner: String
) {
  onUpdateUserProfile(filter: $filter, profileOwner: $profileOwner) {
    createdAt
    email
    id
    name
    profileOwner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
