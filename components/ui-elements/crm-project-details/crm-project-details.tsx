import { useProjectsContext } from "@/api/ContextProjects";
import useCrmProject from "@/api/useCrmProject";
import CrmData from "@/components/crm/CrmData";
import { makeCrmLink } from "@/components/crm/CrmLink";
import LabelData from "@/components/crm/label-data";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatUsdCurrency } from "@/helpers/functional";
import { getRevenue2Years } from "@/helpers/projects";
import { format } from "date-fns";
import { Circle } from "lucide-react";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
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
    isLoading: loadingCrmProject,
    error: errorCrmProject,
  } = useCrmProject(crmProjectId);
  const { getProjectById } = useProjectsContext();

  return loadingCrmProject ? (
    <LoadingAccordionItem
      value={`loading-crm-${crmProjectId}`}
      sizeTitle="lg"
      sizeSubtitle="base"
    />
  ) : errorCrmProject ? (
    <ApiLoadingError
      title="Loading CRM Project failed"
      error={errorCrmProject}
    />
  ) : (
    crmProject && (
      <DefaultAccordionItem
        value={crmProject.id}
        triggerTitle={crmProject.name}
        badge={
          crmProject.projectIds.length === 0 && (
            <>
              <Circle className="mt-[0.2rem] w-4 min-w-4 h-4 md:hidden bg-destructive rounded-full text-destructive-foreground" />
              <Badge variant="destructive" className="hidden md:block">
                No project
              </Badge>
            </>
          )
        }
        link={
          crmProject.crmId && crmProject.crmId.length > 6
            ? makeCrmLink("Opportunity", crmProject.crmId)
            : undefined
        }
        triggerSubTitle={[crmProject.stage, getRevenue2Years([crmProject])]}
      >
        <div className="space-y-2">
          <CrmProjectForm crmProject={crmProject} onChange={updateCrmProject} />
          <div className="space-y-1">
            <LabelData label="Stage" data={crmProject.stage} />
            <LabelData label="ARR" data={formatUsdCurrency(crmProject.arr)} />
            <LabelData label="TCV" data={formatUsdCurrency(crmProject.tcv)} />
            <LabelData
              label="Close date"
              data={format(crmProject.closeDate, "PP")}
            />
            <LabelData label="Account" data={crmProject.accountName} />
            <LabelData label="Next step" data={crmProject.nextStep} />
            <LabelData label="Partner" data={crmProject.partnerName} />
            <LabelData label="Owner" data={crmProject.opportunityOwner} />
            <CrmData crmId={crmProject.crmId} />
          </div>

          {crmProject.projectIds.length === 0 && (
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
              {crmProject.projectIds.map((id) => (
                <ProjectAccordionItem key={id} project={getProjectById(id)} />
              ))}
            </Accordion>
          )}
        </div>
      </DefaultAccordionItem>
    )
  );
};

export default CrmProjectDetails;
