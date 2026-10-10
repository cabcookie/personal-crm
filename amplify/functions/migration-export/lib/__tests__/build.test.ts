import { describe, expect, it } from "vitest";
import {
  allDocuments,
  buildExport,
  imageUsage,
  learningStatusCounts,
  type RawTables,
} from "../build";

const ts = (n: number) => ({
  createdAt: `2026-01-0${n}T10:00:00.000Z`,
  updatedAt: `2026-02-0${n}T10:00:00.000Z`,
});

const doc = (...content: object[]) => JSON.stringify({ type: "doc", content });

const mention = (id: string) => ({
  type: "paragraph",
  content: [{ type: "mention", attrs: { id, label: id } }],
});

const tables = (): RawTables => ({
  User: [
    {
      profileId: "sub::user",
      name: "Carsten",
      email: "c@example.com",
      personId: "p-me",
      promptGeneral: "who I am",
      promptWorkActivity: "consulting",
      promptWorkGoals3Years: "grow",
      promptFamilyGoals12Months: "holidays",
    },
  ],
  Person: [
    { id: "p-ada", name: "Ada", birthday: "1815-12-10", ...ts(2) },
    { id: "p-me", name: "Me", howToSay: "mee", ...ts(1) },
  ],
  PersonDetail: [
    {
      id: "d1",
      personId: "p-ada",
      label: "emailWork",
      detail: "a@x",
      ...ts(1),
    },
  ],
  PersonAccount: [
    {
      id: "e1",
      personId: "p-ada",
      accountId: "acc-1",
      position: "CTO",
      startDate: "2020-01-01",
      ...ts(1),
    },
  ],
  PersonRelationship: [
    {
      id: "r1",
      personId: "p-me",
      relatedPersonId: "p-ada",
      typeName: "friend",
      date: "2001-05-01",
      ...ts(1),
    },
    { id: "r-broken", personId: "p-me", relatedPersonId: null, ...ts(2) },
  ],
  PersonLearning: [
    {
      id: "pl1",
      personId: "p-ada",
      learnedOn: "2026-01-05",
      status: "new",
      prayer: "PRAYING",
      learning: doc({ type: "paragraph" }),
      ...ts(1),
    },
  ],
  Account: [
    {
      id: "acc-1",
      name: "Analytical Engines",
      shortName: "AE",
      crmId: "dropped",
      introduction: "line one",
      ...ts(1),
    },
    {
      id: "acc-2",
      name: "Sub",
      accountSubsidiariesId: "acc-1",
      introductionJson: doc({ type: "s3image", attrs: { s3Key: "k-intro" } }),
      ...ts(2),
    },
  ],
  AccountLearning: [
    {
      id: "al1",
      accountId: "acc-1",
      status: "archived",
      learning: doc(mention("p-me")),
      ...ts(1),
    },
  ],
  AccountLearningPerson: [
    { id: "alp1", learningId: "al1", personId: "p-ada", ...ts(1) },
  ],
  Projects: [
    {
      id: "prj-1",
      project: "Engine",
      context: "work",
      done: true,
      doneOn: "2026-03-01",
      partnerId: "acc-2",
      pinned: "PINNED",
      ...ts(1),
    },
  ],
  AccountProjects: [
    { id: "ap1", projectsId: "prj-1", accountId: "acc-1", ...ts(1) },
  ],
  Meeting: [
    {
      id: "m1",
      topic: "Kickoff",
      meetingOn: "2026-01-03T09:00:00.000Z",
      context: "work",
      sonicTranscript: "dropped",
      ...ts(1),
    },
  ],
  MeetingParticipant: [
    { id: "mp1", meetingId: "m1", personId: "p-ada", ...ts(1) },
    { id: "mp2", meetingId: "m1", personId: "p-ada", ...ts(2) },
  ],
  Activity: [
    {
      id: "act-2",
      meetingActivitiesId: "m1",
      formatVersion: 3,
      noteBlockIds: ["nb1", "nb2", "nb3"],
      name: "Kickoff notes",
      ...ts(3),
    },
    {
      id: "act-1",
      meetingActivitiesId: "m1",
      formatVersion: 2,
      notesJson: doc(mention("p-ghost")),
      ...ts(2),
    },
    { id: "act-0", notes: "plain\ntext", ...ts(1) },
    {
      id: "act-orphan",
      meetingActivitiesId: "m-deleted",
      formatVersion: 2,
      notesJson: doc({ type: "s3image", attrs: { s3Key: "k-orphan" } }),
      ...ts(4),
    },
  ],
  ProjectActivity: [
    { id: "pa1", activityId: "act-2", projectsId: "prj-1", ...ts(1) },
  ],
  NoteBlock: [
    {
      id: "nb1",
      activityId: "act-2",
      type: "paragraph",
      content: JSON.stringify(mention("p-ada")),
      ...ts(1),
    },
    {
      id: "nb2",
      activityId: "act-2",
      type: "taskItem",
      todoId: "todo-1",
      ...ts(1),
    },
    {
      id: "nb3",
      activityId: "act-2",
      type: "s3image",
      content: JSON.stringify({ type: "s3image", attrs: { s3Key: "k1" } }),
      imageDescription: "a whiteboard",
      imageDescriptionUpdatedAt: "2026-01-04T00:00:00.000Z",
      ...ts(1),
    },
  ],
  Todo: [
    {
      id: "todo-1",
      status: "OPEN",
      todo: JSON.stringify({
        type: "taskItem",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "x" }] },
        ],
      }),
      ...ts(1),
    },
  ],
});

describe("buildExport", () => {
  const data = buildExport(tables());

  it("maps the profile prompts per context", () => {
    expect(data.profile).toEqual({
      name: "Carsten",
      email: "c@example.com",
      ownPersonId: "p-me",
      promptGeneral: "who I am",
      contexts: {
        work: {
          activity: "consulting",
          goals3Years: "grow",
          goals12Months: null,
        },
        family: {
          activity: null,
          goals3Years: null,
          goals12Months: "holidays",
        },
        hobby: { activity: null, goals3Years: null, goals12Months: null },
      },
    });
  });

  it("sorts records by createdAt and embeds details and employments", () => {
    expect(data.people.map((p) => p.id)).toEqual(["p-me", "p-ada"]);
    const ada = data.people[1];
    expect(ada.details).toEqual([
      { id: "d1", label: "emailWork", detail: "a@x" },
    ]);
    expect(ada.employments).toEqual([
      {
        id: "e1",
        accountId: "acc-1",
        position: "CTO",
        startDate: "2020-01-01",
        endDate: null,
      },
    ]);
  });

  it("drops relationships without both ends", () => {
    expect(data.relationships.map((r) => r.id)).toEqual(["r1"]);
    expect(data.relationships[0].type).toBe("friend");
  });

  it("maps accounts without the dropped fields", () => {
    expect(data.accounts[0]).toEqual({
      id: "acc-1",
      name: "Analytical Engines",
      shortName: "AE",
      parentAccountId: null,
      introduction: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "line one" }] },
        ],
      },
      ...ts(1),
    });
    expect(data.accounts[1].parentAccountId).toBe("acc-1");
  });

  it("unions linked and mentioned people of account learnings", () => {
    expect(data.accountLearnings[0].mentionedPersonIds).toEqual([
      "p-ada",
      "p-me",
    ]);
    expect(learningStatusCounts(data)).toEqual({
      "person-learnings.json": { new: 1, archived: 0 },
      "account-learnings.json": { new: 0, archived: 1 },
    });
  });

  it("maps projects with their accounts and partner", () => {
    expect(data.projects[0]).toEqual({
      id: "prj-1",
      name: "Engine",
      context: "work",
      done: true,
      doneOn: "2026-03-01",
      dueOn: null,
      partnerAccountId: "acc-2",
      accountIds: ["acc-1"],
      ...ts(1),
    });
  });

  it("lists distinct participants and activities by createdAt", () => {
    expect(data.meetings[0].participantPersonIds).toEqual(["p-ada"]);
    expect(data.meetings[0].activityIds).toEqual(["act-1", "act-2"]);
  });

  it("builds activity documents from all three formats", () => {
    const [v1, v2, v3] = data.activities;
    expect(v1.sourceFormatVersion).toBe(1);
    expect(v1.document.content).toHaveLength(2);
    expect(v2.sourceFormatVersion).toBe(2);
    expect(v2.mentionedPersonIds).toEqual(["p-ghost"]);
    expect(v3.sourceFormatVersion).toBe(3);
    expect(v3.projectIds).toEqual(["prj-1"]);
    expect(v3.mentionedPersonIds).toEqual(["p-ada"]);
    expect(v3.document.content.map((n) => n.type)).toEqual([
      "paragraph",
      "taskList",
      "image",
    ]);
  });

  it("ignores activities whose meeting was deleted", () => {
    expect(data.activities.map((a) => a.id)).not.toContain("act-orphan");
    expect([...imageUsage(data).keys()]).not.toContain("k-orphan");
  });

  it("reports references to records outside the export", () => {
    expect(data.warnings).toEqual([
      {
        code: "DANGLING_REFERENCE",
        entity: "activities.json",
        id: "act-1",
        detail: "personId p-ghost",
      },
    ]);
  });

  it("collects image usage and descriptions", () => {
    expect([...imageUsage(data).entries()]).toEqual([
      ["k1", ["act-2"]],
      ["k-intro", []],
    ]);
    expect(data.imageBlocks.get("k1")).toEqual({
      description: "a whiteboard",
      descriptionUpdatedAt: "2026-01-04T00:00:00.000Z",
    });
    expect(allDocuments(data)).toHaveLength(3 + 1 + 1 + 2);
  });
});
