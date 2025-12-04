import { addProjectActivity } from "@/api/projects/add-project-activity";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import NoteLean from "../activities/note-lean";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Button } from "../ui/button";
import useProjectNotes from "./useProjectNotes";

interface ProjectNotesProps {
  isVisible?: boolean;
  projectId: string;
}

const ProjectNotes: FC<ProjectNotesProps> = ({ isVisible, projectId }) => {
  const { notes } = useProjectNotes(projectId);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  if (!isVisible) return null;

  const onCreate = async () => {
    setIsCreating(true);
    const data = await addProjectActivity({
      data: { projectId },
      options: { confirm: () => setIsCreating(false) },
    });
    if (!data) return;
    router.push(`/activities/${data.id}`);
  };

  return !notes ? (
    <LoadingAccordionItem
      value="loading-notes"
      sizeTitle="base"
      sizeSubtitle="sm"
    />
  ) : (
    <DefaultAccordionItem value="project-notes" triggerTitle="Project Notes">
      <div className="space-y-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={onCreate}
          disabled={isCreating}
        >
          {!isCreating ? (
            <PlusCircle className="w-4 h-4" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          Activity
        </Button>

        <div className="space-y-10 pt-4">
          {notes.map((a) => (
            <NoteLean key={a.id} activity={a} readonly />
          ))}
        </div>
      </div>
    </DefaultAccordionItem>
  );
};

export default ProjectNotes;
