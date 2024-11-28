import { useProjectsContext } from "@/api/ContextProjects";
import usePersonActivities, { PersonActivity } from "@/api/usePersonActivities";
import { format } from "date-fns";
import { flatMap, flow } from "lodash/fp";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import NotesEditor from "../ui-elements/editors/notes-editor/NotesEditor";
import PersonNoteMeeting from "./PersonNoteMeeting";
import PersonNoteProject from "./PersonNoteProject";

type PersonNotesProps = {
  personId?: string;
  showNotes?: boolean;
};

const PersonNotes: FC<PersonNotesProps> = ({ showNotes, personId }) => {
  const { activities } = usePersonActivities(personId);
  const { getProjectNamesByIds } = useProjectsContext();

  return !personId ? (
    <LoadingAccordionItem
      value="loading-notes"
      sizeTitle="xs"
      sizeSubtitle="lg"
    />
  ) : (
    <DefaultAccordionItem
      value="notes"
      triggerTitle="Notes"
      triggerSubTitle={[
        flow(
          flatMap((a: PersonActivity) => a.projectIds),
          getProjectNamesByIds
        )(activities),
      ]}
      isVisible={!!showNotes}
    >
      <div className="space-y-6">
        {activities?.map((a) => (
          <div key={a.id} className="space-y-2">
            <div className="font-semibold text-base">
              {format(a.finishedOn, "PPp")}
              <Link href={`/activities/${a.id}`}>
                <ExternalLink className="inline-block ml-2 w-5 h-5 -translate-y-0.5 text-muted-foreground hover:text-primary" />
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              {a.projectIds.map((pId) => (
                <PersonNoteProject key={pId} projectId={pId} />
              ))}
              <PersonNoteMeeting meetingId={a.meetingId} />
            </div>

            <NotesEditor activityId={a.id} readonly />
          </div>
        ))}
      </div>
    </DefaultAccordionItem>
  );
};

export default PersonNotes;
