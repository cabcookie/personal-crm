import { useProjectsContext } from "@/api/ContextProjects";
import useAccountActivities from "@/api/useAccountActivities";
import { format } from "date-fns";
import { FC } from "react";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";

type AccountNotesProps = {
  accountId: string;
};

const AccountNotes: FC<AccountNotesProps> = ({ accountId }) => {
  const { activities } = useAccountActivities(accountId);
  const { projects } = useProjectsContext();

  return activities
    ?.sort((a, b) => b.finishedOn.getTime() - a.finishedOn.getTime())
    .map(({ id, projectId, notes, finishedOn }) => (
      <div key={id} className="mb-4">
        <div className="font-semibold md:text-lg">
          {format(finishedOn, "PPP")}
        </div>
        {projectId && (
          <a
            href={`/projects/${projectId}`}
            className="text-muted-foreground hover:underline"
          >
            On: {projects?.find((p) => p.id === projectId)?.project}
          </a>
        )}
        <NotesWriter notes={notes} readonly />
      </div>
    ));
};

export default AccountNotes;
