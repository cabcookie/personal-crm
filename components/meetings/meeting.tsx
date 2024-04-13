import { FC } from "react";
import { Meeting } from "@/api/useMeetings";
import styles from "./Meeting.module.css";
import ActivityComponent from "../activities/activity";
import PersonName from "../ui-elements/tokens/person-name";

type MeetingRecordProps = {
  meeting: Meeting;
  updateActivityNotes: (notes: string, activityId: string) => Promise<string>;
};
const MeetingRecord: FC<MeetingRecordProps> = ({
  meeting,
  updateActivityNotes,
}) => (
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
      {meeting.participants.length > 0 && "Attendees: "}
      {meeting.participants.map(
        (person) => person && <PersonName key={person.id} person={person} />
      )}
      {meeting.activities.length > 0 && <h3>Meeting notes:</h3>}
      {meeting.activities.map((activity) => (
        <ActivityComponent
          key={activity.id}
          activity={activity}
          updateActivityNotes={updateActivityNotes}
          showProjects
        />
      ))}
    </div>
  </div>
);

export default MeetingRecord;
