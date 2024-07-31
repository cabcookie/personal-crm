import { useProjectsContext } from "@/api/ContextProjects";
import useCrmProject from "@/api/useCrmProject";
import { makeCrmLink } from "@/components/crm/CrmLink";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { formatUsdCurrency } from "@/helpers/functional";
import { getRevenue2Years } from "@/helpers/projects";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import ProjectSelector from "../selectors/project-selector";
import CrmProjectForm from "./CrmProjectForm";

type CrmProjectDetailsProps = {
  crmProjectId: string;
};

const CrmProjectDetails: FC<CrmProjectDetailsProps> = ({ crmProjectId }) => {
  const { crmProject, updateCrmProject, addProjectToCrmProject } =
    useCrmProject(crmProjectId);
  const { getProjectById } = useProjectsContext();

  return !crmProject ? (
    "Loading..."
  ) : (
    <DefaultAccordionItem
      value={crmProject.id}
      triggerTitle={crmProject.name}
      link={
        crmProject.crmId && crmProject.crmId.length > 6
          ? makeCrmLink("Opportunity", crmProject.crmId)
          : undefined
      }
      triggerSubTitle={[crmProject.stage, getRevenue2Years([crmProject])]}
    >
      <div className="space-y-2">
        <CrmProjectForm crmProject={crmProject} onChange={updateCrmProject} />
        <div>
          <div>Stage: {crmProject.stage}</div>
          {crmProject.arr > 0 && (
            <div>
              Annual recurring revenue: {formatUsdCurrency(crmProject.arr)}
            </div>
          )}
          {crmProject.tcv > 0 && (
            <div>
              Total contract volume: {formatUsdCurrency(crmProject.tcv)}
            </div>
          )}
          <div>Close date: {format(crmProject.closeDate, "PPP")}</div>
        </div>

        {crmProject.projectIds.length === 0 && (
          <div className="space-y-2">
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

        {crmProject.projectIds.length > 0 && (
          <Accordion type="single" collapsible>
            {crmProject.projectIds.map((id) => (
              <ProjectAccordionItem key={id} project={getProjectById(id)} />
            ))}
          </Accordion>
        )}
      </div>
    </DefaultAccordionItem>
  );
};

export default CrmProjectDetails;
