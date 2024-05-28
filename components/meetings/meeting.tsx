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
    <h2 className="md:text-lg font-bold tracking-tight bg-bgTransparent sticky top-[12rem] md:top-[13rem] z-[25] pb-2">
      <a href={`/meetings/${meeting.id}`} className="hover:underline">
        {toLocaleTimeString(meeting.meetingOn)} – {meeting.topic}
        <small className="text-muted-foreground uppercase ml-2">
          {meeting.context || "none"}
        </small>
      </a>
    </h2>

    {meeting.participantIds.length > 0 && (
      <div className="flex flex-row gap-4 pb-2">
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
      {meeting.activityIds.length > 0 &&
        meeting.activityIds.map((activityId) => (
          <ActivityComponent
            key={activityId}
            activityId={activityId}
            showProjects
          />
        ))}
    </div>
  </div>
);

export default MeetingRecord;
