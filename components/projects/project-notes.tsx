import { FC } from "react";
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
  if (!isVisible) return null;
  const { notes } = useProjectNotes(projectId);
  return !notes ? (
    <LoadingAccordionItem
      value="loading-notes"
      sizeTitle="base"
      sizeSubtitle="sm"
    />
  ) : (
    <DefaultAccordionItem value="project-notes" triggerTitle="Project Notes">
      <div className="space-y-2">
        <Button size="sm">TEST</Button>

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
