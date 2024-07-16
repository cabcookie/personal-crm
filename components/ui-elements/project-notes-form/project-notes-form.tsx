import { useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { FC, useState } from "react";
import { debouncedUpdateNotes } from "../../activities/activity-helper";
import ActivityMetaData from "../../activities/activity-meta-data";
import NotesWriter from "../notes-writer/NotesWriter";

type ProjectNotesFormProps = {
  className?: string;
  activityId: string;
};

const ProjectNotesForm: FC<ProjectNotesFormProps> = ({
  activityId,
  className,
}) => {
  const { getProjectById } = useProjectsContext();
  const { activity, updateNotes } = useActivity(activityId);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    if (!updateNotes) return;
    debouncedUpdateNotes({
      serializer,
      updateNotes,
    });
  };

  return !activity ? (
    "Loading…"
  ) : (
    <div className={className}>
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {activity.projectIds.map((id) => (
          <ProjectAccordionItem
            key={id}
            project={getProjectById(id)}
            accordionSelectedValue={accordionValue}
          />
        ))}
      </Accordion>

      <div className="mx-0 md:mx-2">
        <NotesWriter
          notes={activity?.notes || ""}
          saveNotes={handleNotesUpdate}
        />
      </div>

      <div className="mx-2 md:mx-4">
        <ActivityMetaData activity={activity} />
      </div>
    </div>
  );
};

export default ProjectNotesForm;
