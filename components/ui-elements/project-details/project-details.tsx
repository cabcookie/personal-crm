import { Project, useProjectsContext } from "@/api/ContextProjects";
import { contexts } from "@/components/navigation-menu/ContextSwitcher";
import { Accordion } from "@/components/ui/accordion";
import { Context } from "@/contexts/ContextContext";
import { FC, useEffect, useState } from "react";
import ButtonGroup from "../btn-group/btn-group";
import ContextWarning from "../context-warning/context-warning";
import CrmProjectsList from "../crm-project-details/crm-projects-list";
import SavedState from "../project-notes-form/saved-state";
import RecordDetails from "../record-details/record-details";
import NextActions from "./next-actions";
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
    saveNextActions,
    saveProjectDates,
    addAccountToProject,
    updateProjectContext,
    removeAccountFromProject,
  } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [projectContext, setProjectContext] = useState(project?.context);
  const [detailsSaved, setDetailsSaved] = useState(true);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

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
    setDetailsSaved(false);
    const data = await saveProjectDates({ projectId: project.id, ...props });
    if (data) setDetailsSaved(true);
    return data;
  };

  const handleSelectAccount = async (accountId: string | null) => {
    if (!project) return;
    if (!accountId) return;
    setDetailsSaved(false);
    const data = await addAccountToProject(project.id, accountId);
    if (data) setDetailsSaved(true);
    return data;
  };

  const updateContext = async (context: Context) => {
    if (!project) return;
    setDetailsSaved(false);
    setProjectContext(context);
    const data = await updateProjectContext(project.id, context);
    if (data) setDetailsSaved(true);
  };

  return (
    project && (
      <div>
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

        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          <ProjectAccountDetails
            accoundIds={project.accountIds}
            onAddAccount={handleSelectAccount}
            accordionSelectedValue={accordionValue}
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

          <CrmProjectsList
            crmProjects={project.crmProjects}
            isVisible={showCrmDetails}
            accordionSelectedValue={accordionValue}
            projectId={project.id}
          />

          <ProjectDates
            project={project}
            updateDatesFn={handleDateChange}
            accordionSelectedValue={accordionValue}
          />

          <NextActions
            own={project.myNextActions}
            others={project.othersNextActions}
            saveFn={(own, others) => saveNextActions(project.id, own, others)}
            accordionSelectedValue={accordionValue}
          />

          <SavedState saved={detailsSaved} />

          <ProjectActivities
            accordionSelectedValue={accordionValue}
            isVisible={showNotes}
            project={project}
          />
        </Accordion>
      </div>
    )
  );
};

export default ProjectDetails;
