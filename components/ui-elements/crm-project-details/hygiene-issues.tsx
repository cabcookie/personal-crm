import { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser from "@/api/useUser";
import {
  hasHygieneIssues,
  hygieneIssues,
} from "@/components/crm/pipeline-hygiene";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FC } from "react";

type HygieneIssuesProps = {
  crmProject: CrmProject;
};

const HygieneIssues: FC<HygieneIssuesProps> = ({ crmProject }) => {
  const { user } = useCurrentUser();
  return (
    hasHygieneIssues(user)(crmProject) && (
      <Alert variant="default" className="bg-orange-400 text-white">
        <AlertCircle className="-mt-0.5 h-5 w-5 stroke-white" />
        <AlertTitle className="font-semibold">
          Project has hygiene issues
        </AlertTitle>
        <AlertDescription>
          {hygieneIssues.map(
            ({ value, label, description, filterFn }) =>
              filterFn(user)(crmProject) && (
                <div key={value}>
                  {label} ({description})
                </div>
              )
          )}
        </AlertDescription>
      </Alert>
    )
  );
};

export default HygieneIssues;
