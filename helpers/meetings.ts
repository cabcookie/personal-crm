import { MeetingUpdateProps } from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import { debounce } from "lodash";

const debouncedUpdateMeeting = (
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

export { debouncedUpdateMeeting };
