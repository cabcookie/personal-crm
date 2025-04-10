type LearningData = {
  id: string;
  learnedOn: string;
  createdAt: string;
  learning: string;
};

type AccountPersonData = {
  personId: string;
};

type AccountData = {
  id: string;
  name: string;
  shortName: string | null;
  createdAt: string;
  introduction: string | null;
  introductionJson: string | null;
  people: { items: AccountPersonData[] };
  learnings: { items: LearningData[] };
  subsidiaries?: {
    items: AccountData[];
  };
};

type ProjectData = {
  getProjects: {
    project: string;
    accounts: {
      items: {
        account: AccountData;
      }[];
    } | null;
    activities: {
      items: {
        activity: ActivityData;
      }[];
    } | null;
  };
};

type PositionAccountData = {
  id: string;
  name: string;
};

type PersonPositionData = {
  startDate: string | null;
  endDate: string | null;
  position: string | null;
  account: PositionAccountData | null;
};

type PersonData = {
  getPerson: InnerPersonData;
};

type InnerPersonData = {
  id: string;
  name: string;
  learnings: {
    items: LearningData[];
  } | null;
  accounts: {
    items: PersonPositionData[];
  } | null;
};

type ActivityData = {
  id: string;
  finishedOn: string;
  createdAt: string;
  notes: string | null;
  notesJson: string | null;
  noteBlockIds: string[] | null;
  noteBlocks: {
    items: NoteBlockData[];
  };
  forMeeting: MeetingData | null;
};

type NoteBlockData = {
  id: string;
  content: string;
  type: string;
  todo: TodoData | null;
};

type TodoData = {
  id: string;
  todo: string;
  status: string;
};

type MeetingData = {
  topic: string;
  participants: { items: { person: ParticipantData }[] };
};

type ParticipantData = {
  id: string;
  name: string;
};
