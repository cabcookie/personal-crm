import MainLayout from "@/components/layouts/MainLayout";
import { useProjectsContext } from "@/api/ContextProjects";
import { useState } from "react";
import {
  hasMissingCategories,
  hasMissingNarratives,
  ProjectForReview,
} from "@/helpers/weeklyReviewHelpers";
import { CreateAnalysisBtn } from "@/components/weekly-review/CreateAnalysisBtn";
import { ShowProcessingStatus } from "@/components/weekly-review/ShowProcessingStatus";
import { ShowProjectNotes } from "@/components/weekly-review/ShowProjectNotes";
import { CopyCategorizationResult } from "@/components/weekly-review/CopyCategorizationResult";
import { CopyNarrativeResult } from "@/components/weekly-review/CopyNarrativeResult";
import { useWeeklyReview } from "@/api/useWeeklyReview";
import { Accordion } from "@/components/ui/accordion";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import { AlertLoadingError } from "@/components/weekly-review/AlertLoadingError";
import { AccordionWeeklyReview } from "@/components/weekly-review/AccordionWeeklyReview";

const WeeklyBusinessReviewPage = () => {
  const { projects } = useProjectsContext();
  const { isLoading, weeklyReviews, errorLoading, createWeeklyReview } =
    useWeeklyReview();
  const [projectNotes, setProjectNotes] = useState<ProjectForReview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  return (
    <MainLayout
      title="Weekly Business Review"
      sectionName="Weekly Business Review"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <CreateAnalysisBtn
            {...{
              setIsProcessing,
              projects,
              setProcessingStatus,
              setProjectNotes,
            }}
          />
        </div>

        {isProcessing && <ShowProcessingStatus {...{ processingStatus }} />}

        <ShowProjectNotes {...{ projectNotes, isProcessing }} />

        {!isProcessing && (
          <>
            {hasMissingCategories(projectNotes) && (
              <CopyCategorizationResult {...{ setProjectNotes }} />
            )}

            {!hasMissingCategories(projectNotes) && (
              <>
                {hasMissingNarratives(projectNotes) && (
                  <CopyNarrativeResult
                    {...{ setProjectNotes, createWeeklyReview }}
                  />
                )}
              </>
            )}
          </>
        )}

        <Accordion type="single" collapsible>
          {isLoading ? (
            <LoadingAccordionItem
              value="loading-wbr"
              sizeTitle="xl"
              sizeSubtitle="lg"
            />
          ) : errorLoading ? (
            <AlertLoadingError />
          ) : !weeklyReviews ? (
            <div className="text-sm text-muted-foreground text-center">
              No weekly reviews.
            </div>
          ) : (
            weeklyReviews?.map((w) => (
              <AccordionWeeklyReview key={w.id} weeklyReview={w} />
            ))
          )}
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default WeeklyBusinessReviewPage;
