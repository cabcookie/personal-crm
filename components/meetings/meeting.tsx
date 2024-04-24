import { FC } from "react";
import { Meeting } from "@/api/useMeetings";
import styles from "./Meeting.module.css";
import ActivityComponent from "../activities/activity";
import PersonName from "../ui-elements/tokens/person-name";

type MeetingRecordProps = {
  meeting: Meeting;
};

const MeetingRecord: FC<MeetingRecordProps> = ({ meeting }) => (
  <div>
    <h2>
      <a href={`/meetings/${meeting.id}`} className={styles.title}>
        {meeting.meetingOn.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        – {meeting.topic}
        <small style={{ color: "gray" }}>
          {" "}
          {(meeting.context || "none").toUpperCase()}
        </small>
      </a>
    </h2>
    <div>
      {meeting.participantIds.length > 0 && "Attendees: "}
      {meeting.participantIds.map((personId) => (
        <PersonName key={personId} personId={personId} />
      ))}
      {meeting.activityIds.length > 0 && <h3>Meeting notes:</h3>}
      {meeting.activityIds.map((activityId) => (
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
