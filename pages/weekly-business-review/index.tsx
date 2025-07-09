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
import { PasteCategorizationResult } from "@/components/weekly-review/PasteCategorizationResult";
import { PasteNarrativeResult } from "@/components/weekly-review/PasteNarrativeResult";
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
        {!isProcessing && (!projectNotes || projectNotes.length === 0) ? (
          <div className="flex items-center justify-center">
            <CreateAnalysisBtn
              {...{
                setIsProcessing,
                projects,
                setProcessingStatus,
                setProjectNotes,
                createWeeklyReview,
              }}
            />
          </div>
        ) : (
          <div className="h-8" />
        )}

        {isProcessing && <ShowProcessingStatus {...{ processingStatus }} />}

        <ShowProjectNotes
          {...{
            projectNotes,
            isProcessing,
            setProjectNotes,
            createWeeklyReview,
          }}
        />

        {!isProcessing && (
          <>
            {hasMissingCategories(projectNotes) && (
              <PasteCategorizationResult
                {...{ setProjectNotes, createWeeklyReview }}
              />
            )}

            {!hasMissingCategories(projectNotes) && (
              <>
                {hasMissingNarratives(projectNotes) && (
                  <PasteNarrativeResult
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
