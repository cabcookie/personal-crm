import { Project, useProjectsContext } from "@/api/ContextProjects";
import { contexts } from "@/components/navigation-menu/ContextSwitcher";
import { Context } from "@/contexts/ContextContext";
import { FC, useEffect, useState } from "react";
import AccountSelector from "../account-selector";
import ButtonGroup from "../btn-group/btn-group";
import ContextWarning from "../context-warning/context-warning";
import CrmProjectDetails from "../crm-project-details/crm-project-details";
import SavedState from "../project-notes-form/saved-state";
import RecordDetails from "../record-details/record-details";
import AccountName from "../tokens/account-name";
import NextActions from "./next-actions";
import ProjectDates from "./project-dates";

type ProjectDetailsProps = {
  projectId: string;
  includeAccounts?: boolean;
  showContext?: boolean;
  showCrmDetails?: boolean;
};

const ProjectDetails: FC<ProjectDetailsProps> = ({
  projectId,
  includeAccounts,
  showContext,
  showCrmDetails,
}) => {
  const {
    getProjectById,
    saveNextActions,
    saveProjectDates,
    addAccountToProject,
    updateProjectContext,
  } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [projectContext, setProjectContext] = useState(project?.context);
  const [detailsSaved, setDetailsSaved] = useState(true);
  const [newCrmProjectId] = useState(crypto.randomUUID());

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

        {includeAccounts && (
          <RecordDetails title="Accounts">
            <div className="flex flex-row gap-4">
              {project.accountIds.map((accountId) => (
                <AccountName key={accountId} accountId={accountId} />
              ))}
            </div>
            <AccountSelector
              value=""
              allowCreateAccounts
              onChange={handleSelectAccount}
            />
          </RecordDetails>
        )}

        {(!showCrmDetails
          ? project.crmProjectIds
          : [
              ...project.crmProjectIds.filter((id) => id !== newCrmProjectId),
              newCrmProjectId,
            ]
        ).map((id) => (
          <CrmProjectDetails
            key={id}
            crmProjectId={id}
            projectId={project.id}
            crmProjectDetails={showCrmDetails}
          />
        ))}

        <RecordDetails>
          <ProjectDates project={project} updateDatesFn={handleDateChange} />
        </RecordDetails>

        <NextActions
          own={project.myNextActions}
          others={project.othersNextActions}
          saveFn={(own, others) => saveNextActions(project.id, own, others)}
        />

        <SavedState saved={detailsSaved} />
      </div>
    )
  );
};

export default ProjectDetails;
