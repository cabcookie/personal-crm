import { Dispatch, FC, SetStateAction } from "react";
import {
  getWeekStart,
  ProjectForReview,
  startProcessing,
  hasProjectsToReview,
} from "@/helpers/weeklyReviewHelpers";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useProjectsContext } from "@/api/ContextProjects";
import { useWeeklyReview } from "@/api/useWeeklyReview";

interface CreateAnalysisBtnProps {
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setProcessingStatus: Dispatch<SetStateAction<string>>;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  projects: ReturnType<typeof useProjectsContext>["projects"];
  createWeeklyReview: (projects: ProjectForReview[]) => Promise<void>;
}

export const CreateAnalysisBtn: FC<CreateAnalysisBtnProps> = ({
  setIsProcessing,
  projects,
  setProcessingStatus,
  setProjectNotes,
  createWeeklyReview,
}) => {
  const { weeklyReviews: existingReviewsForReview } =
    useWeeklyReview(getWeekStart());

  const hasProjects = hasProjectsToReview(projects, existingReviewsForReview);

  return (
    <>
      {(!projects || hasProjects) && (
        <Button
          disabled={!projects}
          onClick={() =>
            startProcessing({
              setIsProcessing,
              setProcessingStatus,
              setProjectNotes,
              projects,
              existingReviewsForReview,
              createWeeklyReview,
            })
          }
        >
          <div className="flex flex-row gap-2 items-center">
            {!projects ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading Projects…
              </>
            ) : (
              <>
                <Play className="size-4" />
                Create Analysis
              </>
            )}
          </div>
        </Button>
      )}

      {projects && !hasProjects && (
        <p className="text-sm text-muted-foreground">
          All projects have already been considered in this week&apos;s review
          or don&apos;t meet the criteria for analysis.
        </p>
      )}
    </>
  );
};
