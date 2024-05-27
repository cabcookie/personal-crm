import { Meeting } from "@/api/useMeetings";
import { toLocaleTimeString } from "@/helpers/functional";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import PersonName from "../ui-elements/tokens/person-name";

type MeetingRecordProps = {
  meeting: Meeting;
};

const MeetingRecord: FC<MeetingRecordProps> = ({ meeting }) => (
  <div>
    <h3 className="md:text-lg font-semibold tracking-tight">
      <a href={`/meetings/${meeting.id}`} className="hover:underline">
        {toLocaleTimeString(meeting.meetingOn)} – {meeting.topic}
        <small className="text-muted-foreground uppercase">
          {" "}
          {meeting.context || "none"}
        </small>
      </a>
    </h3>

    {meeting.participantIds.length > 0 && (
      <div className="flex flex-row gap-4">
        Attendees:
        {meeting.participantIds.map((personId) => (
          <PersonName
            className="font-semibold"
            key={personId}
            personId={personId}
          />
        ))}
      </div>
    )}
    <div>
      {meeting.activityIds.length > 0 && (
        <div>
          Notes:
          {meeting.activityIds.map((activityId) => (
            <ActivityComponent
              key={activityId}
              activityId={activityId}
              showProjects
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

export default MeetingRecord;
