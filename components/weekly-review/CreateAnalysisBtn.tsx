import { Dispatch, FC, SetStateAction } from "react";
import {
  getWeekStart,
  ProjectForReview,
  startProcessing,
} from "@/helpers/weeklyReviewHelpers";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useProjectsContext } from "@/api/ContextProjects";
import { useWeeklyReview } from "@/api/useWeeklyReview";

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
  const { weeklyReviews: existingReviewsForReview } =
    useWeeklyReview(getWeekStart());

  return (
    <Button
      disabled={!projects}
      onClick={() =>
        startProcessing({
          setIsProcessing,
          setProcessingStatus,
          setProjectNotes,
          projects,
          existingReviewsForReview,
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
