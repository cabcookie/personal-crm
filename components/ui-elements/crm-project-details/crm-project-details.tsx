import { useProjectsContext } from "@/api/ContextProjects";
import useCrmProject from "@/api/useCrmProject";
import CrmData from "@/components/crm/CrmData";
import LabelData from "@/components/crm/label-data";
import NextStep from "@/components/crm/next-steps";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUsdCurrency } from "@/helpers/functional";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";
import ProjectSelector from "../selectors/project-selector";
import CrmProjectForm from "./CrmProjectForm";

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
        <>
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          <div className="space-y-2">
            <Skeleton className="w-44 h-5" />
            <Skeleton className="w-36 h-5" />
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-52 h-5" />
            <Skeleton className="w-72 h-5" />
            <div className="space-y-1">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-10 h-5" />
            </div>
            <Skeleton className="w-64 h-5" />
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-64 h-5" />
            <Skeleton className="w-56 h-5" />
            {showProjects && (
              <Accordion type="single" collapsible>
                <LoadingAccordionItem
                  value={`loading-crm-${crmProjectId}`}
                  sizeTitle="lg"
                  sizeSubtitle="base"
                />
              </Accordion>
            )}
          </div>
        </>
      ) : (
        crmProject && (
          <>
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

            {showProjects && crmProject.projectIds.length === 0 && (
              <div className="space-y-2">
                <div className="text-destructive font-semibold">
                  No project linked
                </div>
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
