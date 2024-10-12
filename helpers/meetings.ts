import { MeetingUpdateProps } from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import { LeanPerson } from "@/api/usePeople";
import { debounce } from "lodash";
import { first, flow, identity, split } from "lodash/fp";

const getFirstName = flow(identity<string>, split(" "), first);
const getAccountName = flow(identity<string>, split(","), first);

type CreateMeetingNameProps = {
  people?: LeanPerson[];
  participantId?: string;
};
export const createMeetingName = ({
  people,
  participantId,
}: CreateMeetingNameProps) => {
  const person = people?.find((p) => p.id === participantId);
  if (!person) return;
  return `Meet ${getFirstName(person.name)}${
    !person.accountNames ? "" : `/${getAccountName(person.accountNames)}`
  }`;
};

export const debouncedUpdateMeeting = (
  meeting: Meeting,
  updateMeeting: (props: MeetingUpdateProps) => void
) =>
  debounce(
    async ({ meetingOn, title }: { meetingOn?: Date; title?: string }) => {
      if (!meeting) return;
      await updateMeeting({
        title: title || meeting.topic,
        meetingOn: meetingOn || meeting.meetingOn,
      });
    },
    1500
  );
