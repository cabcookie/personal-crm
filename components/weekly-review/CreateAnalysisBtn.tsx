import { Dispatch, FC, SetStateAction } from "react";
import {
  ProjectForReview,
  startProcessing,
} from "@/helpers/weeklyReviewHelpers";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useProjectsContext } from "@/api/ContextProjects";

interface CreateAnalysisBtnProps {
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setProcessingStatus: Dispatch<SetStateAction<string>>;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  projects: ReturnType<typeof useProjectsContext>["projects"];
}

export const CreateAnalysisBtn: FC<CreateAnalysisBtnProps> = ({
  setIsProcessing,
  projects,
  setProcessingStatus,
  setProjectNotes,
}) => {
  return (
    <Button
      disabled={!projects}
      onClick={() =>
        startProcessing({
          setIsProcessing,
          setProcessingStatus,
          setProjectNotes,
          projects,
        })
      }
    >
      <div className="flex flex-row gap-2 items-center">
        <Play className="size-4" />
        Create Analysis
      </div>
    </Button>
  );
};
