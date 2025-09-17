import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
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
import { useTimeFrameFilter } from "./useTimeFrameFilter";
import { useAccountsContext } from "@/api/ContextAccounts";

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
  const { weeksToReview } = useTimeFrameFilter();
  const [hasProjects, setHasProjects] = useState(false);
  const { accounts } = useAccountsContext();

  useEffect(() => {
    if (!projects) return;
    const updated = hasProjectsToReview(
      projects,
      existingReviewsForReview,
      weeksToReview
    );
    setHasProjects(updated);
  }, [projects, weeksToReview, existingReviewsForReview]);

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
              weeksToReview,
              accounts,
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
