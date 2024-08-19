import { useProjectsContext } from "@/api/ContextProjects";
import useActivity from "@/api/useActivity";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { FC, useState } from "react";
import ActivityMetaData from "../../activities/activity-meta-data";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";
import { getTextFromEditorJsonContent } from "../editors/helpers/text-generation";
import NotesEditor from "../editors/notes-editor/NotesEditor";
import DeleteWarning from "./DeleteWarning";

type ProjectNotesFormProps = {
  activityId: string;
  className?: string;
  deleteActivity?: () => void;
  hideProjects?: boolean;
  readOnly?: boolean;
};

const ProjectNotesForm: FC<ProjectNotesFormProps> = ({
  activityId,
  className,
  deleteActivity,
  hideProjects,
  readOnly,
}) => {
  const { getProjectById } = useProjectsContext();
  const { activity, isLoadingActivity, errorActivity, deleteProjectActivity } =
    useActivity(activityId);
  const [openDeleteActivityConfirmation, setOpenDeleteActivityConfirmation] =
    useState(false);

  return (
    <div className={className}>
      <ApiLoadingError title="Loading activity failed" error={errorActivity} />

      {deleteActivity && (
        <DeleteWarning
          open={openDeleteActivityConfirmation}
          onOpenChange={setOpenDeleteActivityConfirmation}
          confirmText={`Are you sure you want to delete the activity with the following information? ${activity?.projectIds.map(
            (id) =>
              `Project: ${getProjectById(id)?.project}${
                activity &&
                `; Notes: ${getTextFromEditorJsonContent(activity?.notes).slice(
                  0,
                  200
                )}`
              }`
          )}`}
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
              <NotesEditor activityId={activity.id} readonly={readOnly} />
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
