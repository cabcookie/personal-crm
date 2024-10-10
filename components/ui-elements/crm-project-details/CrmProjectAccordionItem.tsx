import useCrmProject from "@/api/useCrmProject";
import useCurrentUser from "@/api/useUser";
import HygieneIssueBadge from "@/components/crm/hygiene-issue-badge";
import { hasHygieneIssues } from "@/components/crm/pipeline-hygiene";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import { Badge } from "@/components/ui/badge";
import { getRevenue2Years } from "@/helpers/projects";
import { Circle } from "lucide-react";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../accordion/LoadingAccordionItem";
import CrmProjectDetails from "./crm-project-details";

type CrmProjectAccordionItemProps = {
  crmProjectId: string;
  showProjects?: boolean;
};

const CrmProjectAccordionItem: FC<CrmProjectAccordionItemProps> = ({
  crmProjectId,
  showProjects,
}) => {
  const {
    crmProject,
    isLoading: loadingCrmProject,
    error: errorCrmProject,
  } = useCrmProject(crmProjectId);
  const { user } = useCurrentUser();

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
          crmProject.projectIds.length === 0 ? (
            <>
              <Circle className="mt-[0.2rem] w-4 min-w-4 h-4 md:hidden bg-destructive rounded-full text-destructive-foreground" />
              <Badge variant="destructive" className="hidden md:block">
                No project
              </Badge>
            </>
          ) : (
            hasHygieneIssues(user)(crmProject) && <HygieneIssueBadge />
          )
        }
        link={`/crm-projects/${crmProject.id}`}
        triggerSubTitle={[crmProject.stage, getRevenue2Years([crmProject])]}
      >
        <CrmProjectDetails
          crmProjectId={crmProjectId}
          showProjects={showProjects}
        />
      </DefaultAccordionItem>
    )
  );
};

export default CrmProjectAccordionItem;
