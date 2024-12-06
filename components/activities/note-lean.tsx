import PersonNoteMeeting from "@/components/people/PersonNoteMeeting";
import PersonNoteProject from "@/components/people/PersonNoteProject";
import NotesEditor from "@/components/ui-elements/editors/notes-editor/NotesEditor";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Project {
  id: string;
}

interface Meeting {
  id: string;
}

interface LeanNote {
  id: string;
  finishedOn: Date;
  projects: Project[];
  meeting?: Meeting;
}

interface NoteLeanProps {
  activity: LeanNote;
  readonly?: boolean;
}

const NoteLean: FC<NoteLeanProps> = ({ activity, readonly }) => (
  <div key={activity.id} className="space-y-2">
    <div className="font-semibold text-base">
      {format(activity.finishedOn, "PPp")}
      <Link href={`/activities/${activity.id}`}>
        <ExternalLink className="inline-block ml-2 w-5 h-5 -translate-y-0.5 text-muted-foreground hover:text-primary" />
      </Link>
    </div>

    <div className="text-sm text-muted-foreground">
      {activity.projects.map(({ id }) => (
        <PersonNoteProject key={id} projectId={id} />
      ))}
      <PersonNoteMeeting meetingId={activity.meeting?.id} />
    </div>

    <NotesEditor activityId={activity.id} readonly={readonly} />
  </div>
);

export default NoteLean;
