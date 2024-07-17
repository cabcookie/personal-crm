import { useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { AlertCircle } from "lucide-react";
import { FC, useState } from "react";
import { debouncedUpdateNotes } from "../../activities/activity-helper";
import ActivityMetaData from "../../activities/activity-meta-data";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";
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
  const { activity, updateNotes, isLoadingActivity } = useActivity(activityId);
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

  return (
    <div className={className}>
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {isLoadingActivity ? (
          <LoadingAccordionItem value="loading-project" withSubtitle />
        ) : !activity ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load activities.</AlertTitle>
          </Alert>
        ) : (
          activity.projectIds.map((id) => (
            <ProjectAccordionItem
              key={id}
              project={getProjectById(id)}
              accordionSelectedValue={accordionValue}
            />
          ))
        )}
      </Accordion>

      {isLoadingActivity ? (
        <div className="my-2 space-y-4 mx-0 md:mx-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-80" />
        </div>
      ) : (
        activity && (
          <>
            <div className="mx-0 md:mx-2">
              <NotesWriter
                notes={activity.notes}
                saveNotes={handleNotesUpdate}
              />
            </div>
            <div className="mx-2 md:mx-4">
              <ActivityMetaData activity={activity} />
            </div>
          </>
        )
      )}
    </div>
  );
};

export default ProjectNotesForm;
