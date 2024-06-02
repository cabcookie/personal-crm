import useActivity from "@/api/useActivity";
import { FC, useEffect, useState } from "react";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import SavedState from "../ui-elements/project-notes-form/saved-state";
import DateSelector from "../ui-elements/selectors/date-selector";
import MeetingName from "../ui-elements/tokens/meeting-name";
import ProjectName from "../ui-elements/tokens/project-name";
import { debouncedUpdateNotes, debounedUpdateDate } from "./activity-helper";
import ActivityMetaData from "./activity-meta-data";

type ActivityComponentProps = {
  activityId: string;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  autoFocus?: boolean;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activityId,
  showDates,
  showMeeting,
  showProjects,
  autoFocus,
}) => {
  const { activity, updateNotes, updateDate } = useActivity(activityId);
  const [dateSaved, setDateSaved] = useState(true);
  const [date, setDate] = useState(activity?.finishedOn || new Date());

  useEffect(() => {
    setDate(activity?.finishedOn || new Date());
  }, [activity]);

  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    debouncedUpdateNotes({
      updateNotes,
      serializer,
    });
  };

  const handleDateUpdate = async (date: Date) => {
    setDateSaved(false);
    setDate(date);
    debounedUpdateDate({
      updateDate: () => updateDate(date),
      setSaveStatus: setDateSaved,
    });
  };

  return (
    <div className="pb-8">
      {showDates && (
        <div>
          <DateSelector
            date={date}
            setDate={handleDateUpdate}
            selectHours
            bold
          />
          <SavedState saved={dateSaved} />
        </div>
      )}

      {showProjects && (
        <div>
          On:
          {activity?.projectIds.map((id) => (
            <ProjectName key={id} projectId={id} />
          ))}
        </div>
      )}

      {showMeeting && activity?.meetingId && (
        <div>
          At:
          <MeetingName meetingId={activity.meetingId} />
        </div>
      )}

      <div>
        <NotesWriter
          notes={activity?.notes}
          saveNotes={handleNotesUpdate}
          autoFocus={autoFocus}
          key={activityId}
        />
      </div>

      <ActivityMetaData activity={activity} />
    </div>
  );
};

export default ActivityComponent;
