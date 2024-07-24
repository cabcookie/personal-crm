import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getEditorContentAndTaskData,
  getTextFromEditorJsonContent,
  TWithGetJsonFn,
} from "@/helpers/ui-notes-writer";
import { AlertCircle } from "lucide-react";
import { FC, useState } from "react";
import { debouncedUpdateNotes } from "../../activities/activity-helper";
import ActivityMetaData from "../../activities/activity-meta-data";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";
import NotesWriter from "../notes-writer/NotesWriter";
import DeleteWarning from "./DeleteWarning";

type ProjectNotesFormProps = {
  className?: string;
  activityId: string;
  deleteActivity?: () => void;
  hideProjects?: boolean;
};

const ProjectNotesForm: FC<ProjectNotesFormProps> = ({
  activityId,
  className,
  deleteActivity,
  hideProjects,
}) => {
  const { getProjectById } = useProjectsContext();
  const { mutateOpenTasks } = useOpenTasksContext();
  const { activity, updateNotes, isLoadingActivity, deleteProjectActivity } =
    useActivity(activityId);
  const [openDeleteActivityConfirmation, setOpenDeleteActivityConfirmation] =
    useState(false);

  const handleNotesUpdate = (editor: TWithGetJsonFn) => {
    if (!updateNotes) return;
    debouncedUpdateNotes({
      serializer: getEditorContentAndTaskData(editor, (tasks) =>
        mutateOpenTasks(tasks, activity)
      ),
      updateNotes,
    });
  };

  return (
    <div className={className}>
      {deleteActivity && (
        <DeleteWarning
          open={openDeleteActivityConfirmation}
          onOpenChange={setOpenDeleteActivityConfirmation}
          confirmText={
            <>
              <p>
                Are you sure you want to delete the activity with the following
                information?
              </p>
              {activity?.projectIds.map((id) => (
                <p key={id}>
                  <small>Project: {getProjectById(id)?.project}</small>
                </p>
              ))}
              {activity && (
                <p>
                  <small>
                    Notes:{" "}
                    {getTextFromEditorJsonContent(activity?.notes).slice(
                      0,
                      200
                    )}
                  </small>
                </p>
              )}
            </>
          }
          onConfirm={deleteActivity}
        />
      )}

      {!hideProjects && (
        <Accordion type="single" collapsible>
          {isLoadingActivity ? (
            <LoadingAccordionItem value="loading-project" sizeTitle="sm" />
          ) : !activity ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to load activities.</AlertTitle>
            </Alert>
          ) : (
            activity.projectIds.map((id, index) => (
              <ProjectAccordionItem
                key={id}
                onDelete={() => {
                  if (!deleteActivity) return;
                  const length = activity.projectActivityIds.length;
                  if (length < 2) setOpenDeleteActivityConfirmation(true);
                  else
                    deleteProjectActivity(activity.projectActivityIds[index]);
                }}
                project={getProjectById(id)}
              />
            ))
          )}
        </Accordion>
      )}

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
