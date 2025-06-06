import { useProjectsContext } from "@/api/ContextProjects";
import useCrmProject from "@/api/useCrmProject";
import CrmData from "@/components/crm/CrmData";
import LabelData from "@/components/crm/label-data";
import NextStep from "@/components/crm/next-steps";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { formatUsdCurrency } from "@/helpers/functional";
import { format } from "date-fns";
import { FC } from "react";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";
import ProjectSelector from "../selectors/project-selector";
import CrmProjectLoader from "./crm-project-loader";
import CrmProjectForm from "./CrmProjectForm";
import HygieneIssues from "./hygiene-issues";

type CrmProjectDetailsProps = {
  crmProjectId: string;
  showProjects?: boolean;
};

const CrmProjectDetails: FC<CrmProjectDetailsProps> = ({
  crmProjectId,
  showProjects,
}) => {
  const {
    crmProject,
    updateCrmProject,
    addProjectToCrmProject,
    confirmSolvingHygieneIssues,
    removeProjectFromCrmProject,
    isLoading,
    error,
  } = useCrmProject(crmProjectId);
  const { getProjectById, loadingProjects } = useProjectsContext();

  return (
    <div className="space-y-2">
      <ApiLoadingError
        title="Loading CRM Project Details failed"
        error={error}
      />

      {isLoading ? (
        <CrmProjectLoader {...{ crmProjectId, showProjects }} />
      ) : (
        crmProject && (
          <>
            <HygieneIssues
              crmProject={crmProject}
              confirmSolvingIssues={confirmSolvingHygieneIssues}
            />

            <CrmProjectForm
              crmProject={crmProject}
              onChange={updateCrmProject}
            />

            <div className="space-y-1">
              <LabelData label="Stage" data={crmProject.stage} />
              <LabelData label="ARR" data={formatUsdCurrency(crmProject.arr)} />
              <LabelData label="TCV" data={formatUsdCurrency(crmProject.tcv)} />
              <LabelData
                label="Close date"
                data={format(crmProject.closeDate, "PP")}
              />
              <LabelData label="Account" data={crmProject.accountName} />
              <NextStep crmProject={crmProject} />
              <LabelData label="Partner" data={crmProject.partnerName} />
              <LabelData label="Owner" data={crmProject.opportunityOwner} />
              <CrmData crmId={crmProject.crmId} label={crmProject.name} />
              <LabelData
                label="Created Date"
                data={format(crmProject.createdDate, "PP")}
              />
            </div>

            {showProjects && (
              <div className="space-y-2">
                {crmProject.projectIds.length === 0 && (
                  <div className="text-destructive font-semibold">
                    No project linked
                  </div>
                )}

                <ProjectSelector
                  value=""
                  onChange={(projectId) => {
                    if (!projectId) return;
                    const projectName = getProjectById(projectId)?.project;
                    addProjectToCrmProject(projectId, projectName ?? "");
                  }}
                  allowCreateProjects
                  placeholder="Link a project…"
                />
              </div>
            )}

            {showProjects && crmProject.projectIds.length > 0 && (
              <Accordion type="single" collapsible>
                {crmProject.projectIds.map((id) =>
                  loadingProjects ? (
                    <LoadingAccordionItem
                      key={id}
                      value={`loading-crm-${crmProjectId}`}
                      sizeTitle="lg"
                      sizeSubtitle="base"
                    />
                  ) : (
                    <ProjectAccordionItem
                      key={id}
                      project={getProjectById(id)}
                      onDelete={() =>
                        removeProjectFromCrmProject(
                          id,
                          getProjectById(id)?.project ?? ""
                        )
                      }
                      disableOrderControls
                    />
                  )
                )}
              </Accordion>
            )}
          </>
        )
      )}
    </div>
  );
};

export default CrmProjectDetails;
