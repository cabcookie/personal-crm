import { Project, useProjectsContext } from "@/api/ContextProjects";
import { contexts } from "@/components/navigation-menu/ContextSwitcher";
import DecisionSection from "@/components/planning/DecisionSection";
import ProjectInvolvedPeople from "@/components/projects/project-involved-people";
import ProjectNameForm from "@/components/projects/project-name-form";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Context } from "@/contexts/ContextContext";
import { addDays } from "date-fns";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import ButtonGroup from "../btn-group/btn-group";
import ContextWarning from "../context-warning/context-warning";
import CrmProjectsList from "../crm-project-details/crm-projects-list";
import RecordDetails from "../record-details/record-details";
import ProjectNextActions from "./next-actions";
import ProjectAccountDetails from "./project-account-details";
import ProjectActivities from "./project-activities";
import ProjectDates from "./project-dates";

type ProjectDetailsProps = {
  projectId: string;
  includeAccounts?: boolean;
  showContext?: boolean;
  showCrmDetails?: boolean;
  showNotes?: boolean;
};

const ProjectDetails: FC<ProjectDetailsProps> = ({
  projectId,
  includeAccounts,
  showContext,
  showCrmDetails,
  showNotes,
}) => {
  const {
    getProjectById,
    saveProjectName,
    saveProjectDates,
    addAccountToProject,
    updatePartnerOfProject,
    updateProjectContext,
    removeAccountFromProject,
  } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [projectContext, setProjectContext] = useState(project?.context);
  const [pushingInProgress, setPushingInProgress] = useState(false);

  useEffect(() => {
    setProject(getProjectById(projectId));
    setProjectContext(project?.context);
  }, [getProjectById, project, projectId]);

  const handleDateChange = async (props: {
    dueOn?: Date | undefined;
    onHoldTill?: Date | undefined;
    doneOn?: Date | undefined;
  }) => {
    if (!project) return;
    return await saveProjectDates({ projectId: project.id, ...props });
  };

  const handleSelectAccount = async (accountId: string | null) => {
    if (!project) return;
    if (!accountId) return;
    return await addAccountToProject(project.id, accountId);
  };

  const updateContext = (context: Context) => {
    if (!project) return;
    setProjectContext(context);
    updateProjectContext(project.id, context);
  };

  const handlePushToNextDay = async () => {
    if (!project) return;
    setPushingInProgress(true);
    const result = await saveProjectDates({
      projectId: project.id,
      onHoldTill: addDays(new Date(), 1),
    });
    if (result) return;
    setPushingInProgress(false);
  };

  return (
    project && (
      <div className="space-y-2">
        <div className="ml-1 md:ml-2 flex flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePushToNextDay}
            disabled={pushingInProgress}
          >
            {!pushingInProgress && (
              <ArrowRightCircle className="w-4 h-4 mr-1" />
            )}
            {pushingInProgress && (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            )}
            Push to next day
          </Button>

          <ProjectNameForm
            projectName={project.project}
            onUpdate={(name) => saveProjectName(project.id, name)}
          />
        </div>

        {showContext && (
          <RecordDetails title="Context">
            <ButtonGroup
              values={contexts}
              selectedValue={projectContext || "family"}
              onSelect={(val: string) => {
                if (!contexts.includes(val as Context)) return;
                updateContext(val as Context);
              }}
            />
            <ContextWarning recordContext={projectContext} />
          </RecordDetails>
        )}

        <DecisionSection
          project={project}
          saveOnHoldDate={(onHoldTill) =>
            saveProjectDates({ projectId: project.id, onHoldTill })
          }
          className="mx-1 md:mx-2"
        />

        <Accordion type="single" collapsible>
          <ProjectAccountDetails
            accountIds={project.accountIds}
            onAddAccount={handleSelectAccount}
            isVisible={includeAccounts}
            onRemoveAccount={(accountId, accountName) =>
              removeAccountFromProject(
                project.id,
                project.project,
                accountId,
                accountName
              )
            }
          />

          <ProjectAccountDetails
            title="Partner"
            addAccountPlaceHolder="Add partner…"
            accountIds={!project.partnerId ? [] : [project.partnerId]}
            onAddAccount={(partnerId) =>
              updatePartnerOfProject(project.id, partnerId)
            }
            isVisible={includeAccounts}
            onRemoveAccount={() => updatePartnerOfProject(project.id, null)}
          />

          <CrmProjectsList
            crmProjects={project.crmProjects}
            isVisible={showCrmDetails}
            projectId={project.id}
          />

          <ProjectDates project={project} updateDatesFn={handleDateChange} />

          <ProjectInvolvedPeople projectId={project.id} />

          <ProjectNextActions projectId={project.id} />

          <ProjectActivities isVisible={showNotes} project={project} />
        </Accordion>
      </div>
    )
  );
};

export default ProjectDetails;
