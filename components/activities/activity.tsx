import useActivity from "@/api/useActivity";
import { FC, useEffect, useState } from "react";
import {
  debouncedUpdateNotes,
  debounedUpdateDate,
} from "../ui-elements/activity-helper";
import ActivityMetaData from "../ui-elements/activity-meta-data";
import DateSelector from "../ui-elements/date-selector";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import SavedState from "../ui-elements/project-notes-form/saved-state";
import MeetingName from "../ui-elements/tokens/meeting-name";
import ProjectName from "../ui-elements/tokens/project-name";

type ActivityComponentProps = {
  activityId: string;
  showDates?: boolean;
  showProjects?: boolean;
  showMeeting?: boolean;
  autoFocus?: boolean;
  createActivity?: (notes?: EditorJsonContent) => Promise<string | undefined>;
};

const ActivityComponent: FC<ActivityComponentProps> = ({
  activityId,
  showDates,
  showMeeting,
  showProjects,
  autoFocus,
  createActivity,
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
      createActivity,
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
        <h1 className="flex flex-row gap-2  sticky top-[7rem] md:top-[8rem] bg-bgTransparent z-[20] pb-2">
          <DateSelector
            date={date}
            setDate={handleDateUpdate}
            selectHours
            bold
          />
          <SavedState saved={dateSaved} />
        </h1>
      )}

      {showProjects && (
        <div className="flex flex-row gap-2 sticky top-[14rem] md:top-[15rem] bg-bgTransparent z-[20] pb-2">
          On:
          {activity?.projectIds.map((id) => (
            <ProjectName key={id} projectId={id} />
          ))}
        </div>
      )}

      {showMeeting && activity?.meetingId && (
        <div className="flex flex-row gap-2 sticky top-[10rem] md:top-[11rem] bg-bgTransparent z-[20] pb-2">
          At:
          <MeetingName meetingId={activity.meetingId} />
        </div>
      )}

      <div>
        <h4 className="font-semibold tracking-tight">Notes:</h4>
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
