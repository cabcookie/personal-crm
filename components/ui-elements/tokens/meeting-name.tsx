import useMeeting from "@/api/useMeeting";
import { FC } from "react";
import PersonName from "./person-name";

type MeetingNameProps = {
  meetingId: string;
  noLinks?: boolean;
};

const NameAndDate: FC<{ topic: string; meetingOn: Date }> = ({
  topic,
  meetingOn,
}) => (
  <>
    {topic}
    <small> on </small>
    <small>
      {meetingOn.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </small>
  </>
);

const MeetingName: FC<MeetingNameProps> = ({ meetingId, noLinks }) => {
  const { meeting } = useMeeting(meetingId);

  return !meeting ? (
    "…"
  ) : (
    <div>
      {noLinks ? (
        <NameAndDate topic={meeting.topic} meetingOn={meeting.meetingOn} />
      ) : (
        <a href={`/meetings/${meeting.id}`} className="hover:underline">
          <NameAndDate topic={meeting.topic} meetingOn={meeting.meetingOn} />
        </a>
      )}
      {meeting.participantIds.length > 0 && (
        <div className="flex flex-row gap-2">
          with:
          {meeting.participantIds.map((personId) => (
            <PersonName key={personId} personId={personId} noLinks={noLinks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingName;
