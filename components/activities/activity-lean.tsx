import PersonNoteMeeting from "@/components/people/PersonNoteMeeting";
import PersonNoteProject from "@/components/people/PersonNoteProject";
import NotesEditor from "@/components/ui-elements/editors/notes-editor/NotesEditor";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export interface ILeanActivity {
  id: string;
  finishedOn: Date;
  projectIds: string[];
  meetingId?: string;
}

type LeanActivitiyProps = {
  activity: ILeanActivity;
  readonly?: boolean;
};

const LeanActivitiy: FC<LeanActivitiyProps> = ({ activity, readonly }) => {
  return (
    <div key={activity.id} className="space-y-2">
      <div className="font-semibold text-base">
        {format(activity.finishedOn, "PPp")}
        <Link href={`/activities/${activity.id}`}>
          <ExternalLink className="inline-block ml-2 w-5 h-5 -translate-y-0.5 text-muted-foreground hover:text-primary" />
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        {activity.projectIds.map((pId) => (
          <PersonNoteProject key={pId} projectId={pId} />
        ))}
        <PersonNoteMeeting meetingId={activity.meetingId} />
      </div>

      <NotesEditor activityId={activity.id} readonly={readonly} />
    </div>
  );
};

export default LeanActivitiy;
