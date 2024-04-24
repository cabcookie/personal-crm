import { Project, useProjectsContext } from "@/api/ContextProjects";
import ActivityComponent from "@/components/activities/activity";
import MainLayout from "@/components/layouts/MainLayout";
import NotesWriter from "@/components/ui-elements/notes-writer/NotesWriter";
import { TransformNotesToMdFunction } from "@/components/ui-elements/notes-writer/notes-writer-helpers";
import AccountName from "@/components/ui-elements/tokens/account-name";
import { toLocaleDateString } from "@/helpers/functional";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Descendant } from "slate";

type DebouncedUpdateActionsProps = {
  notes: Descendant[];
  transformerFn: TransformNotesToMdFunction;
  setSaveStatus: (status: boolean) => void;
  updateActions: (actions: string) => Promise<string | undefined>;
};

const debouncedUpdateActions = debounce(
  async ({
    notes,
    transformerFn,
    setSaveStatus,
    updateActions,
  }: DebouncedUpdateActionsProps) => {
    const actions = transformerFn(notes);
    const data = await updateActions(actions);
    if (data) setSaveStatus(true);
  },
  1000
);

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  const {
    getProjectById,
    loadingProjects,
    createProjectActivity,
    saveNextActions,
  } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [newActivityId, setNewActivityId] = useState(crypto.randomUUID());
  const [autoFocusActivityId, setAutoFocusActivitiyId] = useState("");
  const [myNextActionsSaved, setMyNextActionsSaved] = useState(true);
  const [othersNextActionsSaved, setOthersNextActionsSaved] = useState(true);

  useEffect(() => {
    if (projectId) {
      setProject(getProjectById(projectId));
    }
  }, [getProjectById, projectId]);

  const saveNewActivity = async (notes?: string) => {
    if (!projectId) return;
    console.log("saveNewActivity", { notes });
    const data = await createProjectActivity(projectId, notes);
    setNewActivityId(crypto.randomUUID());
    setAutoFocusActivitiyId(data || "");
    return data;
  };

  useEffect(() => {
    if (autoFocusActivityId.length > 5) {
      setTimeout(() => {
        setAutoFocusActivitiyId("");
      }, 2000);
    }
  }, [autoFocusActivityId]);

  const handleNextActionsUpdate =
    (
      setSaveStatus: (status: boolean) => void,
      updateActions: (
        actions: string,
        projectId: string
      ) => Promise<string | undefined>
    ) =>
    (notes: Descendant[], transformerFn: TransformNotesToMdFunction) => {
      if (!projectId) return;
      setSaveStatus(false);
      debouncedUpdateActions({
        notes,
        transformerFn,
        setSaveStatus,
        updateActions: (actions) => updateActions(actions, projectId),
      });
    };

  return (
    <MainLayout
      title={project?.project}
      recordName={project?.project}
      sectionName="Projects"
    >
      {loadingProjects ? (
        "Loading project..."
      ) : (
        <div>
          {project?.dueOn && (
            <div>Due On: {toLocaleDateString(project.dueOn)}</div>
          )}
          {project?.doneOn && (
            <div>Done On: {toLocaleDateString(project.doneOn)}</div>
          )}
          <h2>My next activities: </h2>
          <NotesWriter
            notes={project?.myNextActions || ""}
            unsaved={!myNextActionsSaved}
            saveNotes={handleNextActionsUpdate(
              setMyNextActionsSaved,
              (actions, projectId) =>
                saveNextActions(
                  projectId,
                  actions,
                  project?.othersNextActions || ""
                )
            )}
            key="MyNextActions"
          />
          <h2>Others next activities: </h2>
          <NotesWriter
            notes={project?.othersNextActions || ""}
            unsaved={!othersNextActionsSaved}
            saveNotes={handleNextActionsUpdate(
              setOthersNextActionsSaved,
              (actions, projectId) =>
                saveNextActions(
                  projectId,
                  project?.myNextActions || "",
                  actions
                )
            )}
            key="OthersNextActions"
          />
          {project?.accountIds.map((accountId) => (
            <AccountName key={accountId} accountId={accountId} />
          ))}
          {[newActivityId, ...(project?.activityIds || [])].map((id) => (
            <ActivityComponent
              key={id}
              activityId={id}
              showDates
              showMeeting
              autoFocus={id === autoFocusActivityId}
              createActivity={
                id === newActivityId ? saveNewActivity : undefined
              }
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};
export default ProjectDetailPage;
