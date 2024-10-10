import { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser from "@/api/useUser";
import {
  hasHygieneIssues,
  hygieneIssues,
} from "@/components/crm/pipeline-hygiene";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckSquare2 } from "lucide-react";
import { FC } from "react";

type HygieneIssuesProps = {
  crmProject: CrmProject;
  confirmSolvingIssues?: () => void;
};

const HygieneIssues: FC<HygieneIssuesProps> = ({
  crmProject,
  confirmSolvingIssues,
}) => {
  const { user } = useCurrentUser();
  return (
    hasHygieneIssues(user)(crmProject) && (
      <Alert variant="default" className="bg-orange-400">
        <AlertCircle className="-mt-0.5 h-5 w-5 stroke-white" />
        <AlertTitle className="font-semibold text-white">
          Project has hygiene issues
        </AlertTitle>
        <AlertDescription>
          {hygieneIssues.map(
            ({ value, label, description, filterFn }) =>
              filterFn(user)(crmProject) && (
                <div key={value} className="text-white">
                  {label} ({description})
                </div>
              )
          )}

          {confirmSolvingIssues && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={confirmSolvingIssues}
            >
              <CheckSquare2 className="w-4 h-4 mr-2" />
              Confirm Issues Resolved
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  );
};

export default HygieneIssues;
