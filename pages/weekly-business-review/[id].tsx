import MainLayout from "@/components/layouts/MainLayout";
import { BadgeType } from "@/components/CategoryTitle";
import { useWeeklyReview, WeeklyReview } from "@/api/useWeeklyReview";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import DefaultAccordionItem from "@/components/ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import { REVIEW_CATEGORIES } from "@/helpers/weeklyReviewHelpers";

const WeeklyBusinessReviewDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    reviews,
    loadingReviews,
    getRelevantProjects,
    categorizeProject,
    generateReviewContent,
    checkForDuplicates,
    saveReviewEntry,
    updateReviewStatus,
  } = useWeeklyReview();

  const [currentReview, setCurrentReview] = useState<WeeklyReview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [processedEntries, setProcessedEntries] = useState<any[]>([]);

  useEffect(() => {
    if (reviews && id && typeof id === "string") {
      const review = reviews.find((r) => r.id === id);
      setCurrentReview(review || null);
    }
  }, [reviews, id]);

  if (loadingReviews) {
    return (
      <MainLayout
        sectionName="Weekly Business Review"
        onBackBtnClick={() => router.push("/weekly-business-review")}
      >
        <div className="space-y-4">
          <Accordion type="multiple">
            <LoadingAccordionItem
              sizeTitle="sm"
              sizeSubtitle="2xl"
              value="loading"
            />
          </Accordion>
        </div>
      </MainLayout>
    );
  }

  if (!currentReview) {
    return (
      <MainLayout
        title="Review Not Found"
        sectionName="Weekly Business Review"
        onBackBtnClick={() => router.push("/weekly-business-review")}
      >
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            Weekly review not found.
          </div>
          <Link href="/weekly-business-review">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reviews
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const weekStart = startOfWeek(currentReview.date, { weekStartsOn: 1 });
  const weekTitle = `Week of ${format(weekStart, "MMMM do, yyyy")}`;

  const getStatusBadge = (status: string): BadgeType | undefined => {
    switch (status) {
      case "completed":
        return BadgeType.COMPLETED;
      case "in_progress":
        return BadgeType.IN_PROGRESS;
      case "draft":
        return BadgeType.DRAFT;
      default:
        return undefined;
    }
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setProcessingStatus("Identifying relevant projects...");

    try {
      await updateReviewStatus(currentReview.id, "in_progress");

      const relevantProjects = getRelevantProjects();
      setProcessingStatus(
        `Found ${relevantProjects.length} projects to analyze`
      );

      const entries: any[] = [];

      for (let i = 0; i < relevantProjects.length; i++) {
        const project = relevantProjects[i];
        setProcessingStatus(
          `Analyzing "${project.project}" (${i + 1}/${relevantProjects.length}) - Phase 1: Categorization`
        );

        // Phase 1: Categorization
        const categorization = await categorizeProject(project);
        if (!categorization) {
          continue; // Skip projects that don't categorize
        }

        setProcessingStatus(
          `Analyzing "${project.project}" (${i + 1}/${relevantProjects.length}) - Phase 2: Content Generation`
        );

        // Phase 2: Content Generation
        const content = await generateReviewContent(
          project,
          categorization.category
        );
        if (!content) {
          continue; // Skip if content generation fails
        }

        setProcessingStatus(
          `Analyzing "${project.project}" (${i + 1}/${relevantProjects.length}) - Phase 3: Duplicate Detection`
        );

        // Phase 3: Duplicate Detection
        const duplicateCheck = await checkForDuplicates(
          project,
          categorization.category,
          content.content
        );
        if (duplicateCheck?.decision === "exclude") {
          continue; // Skip if determined to be duplicate
        }

        // Save the entry
        const savedEntry = await saveReviewEntry(
          currentReview.id,
          project.id,
          categorization.category,
          content.content,
          content.content
        );

        if (savedEntry) {
          entries.push({
            ...savedEntry,
            project,
            justification: categorization.justification,
            duplicateReasoning: duplicateCheck?.reasoning,
          });
        }
      }

      setProcessedEntries(entries);
      setProcessingStatus(
        `Processing complete! Generated ${entries.length} entries.`
      );

      if (entries.length > 0) {
        await updateReviewStatus(currentReview.id, "completed");
      }
    } catch (error) {
      console.error("Error during processing:", error);
      setProcessingStatus("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case REVIEW_CATEGORIES.CUSTOMER_HIGHLIGHTS:
        return "Customer Highlights";
      case REVIEW_CATEGORIES.CUSTOMER_LOWLIGHTS:
        return "Customer Lowlights";
      case REVIEW_CATEGORIES.MARKET_OBSERVATIONS:
        return "Market Observations";
      case REVIEW_CATEGORIES.GENAI_OPPORTUNITIES:
        return "GenAI Opportunities";
      default:
        return category;
    }
  };

  const hasEntries =
    currentReview.entries.length > 0 || processedEntries.length > 0;
  const canStartProcessing = currentReview.status === "draft" && !isProcessing;

  return (
    <MainLayout
      title={weekTitle}
      sectionName="Weekly Business Review"
      recordName={weekTitle}
      onBackBtnClick={() => router.push("/weekly-business-review")}
      badge={getStatusBadge(currentReview.status)}
    >
      <div className="flex items-center justify-center">
        <Button onClick={startProcessing}>
          <div className="flex flex-row gap-2 items-center">
            <Play className="w-4 h-4" />
            Create Analysis
          </div>
        </Button>
      </div>
      <div className="space-y-6">
        {currentReview.description && (
          <div className="text-sm text-muted-foreground">
            {currentReview.description}
          </div>
        )}

        {isProcessing && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">Processing...</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {processingStatus}
            </div>
          </div>
        )}

        {!hasEntries && !isProcessing && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {currentReview.status === "draft"
                ? "Ready to analyze your projects and generate business intelligence."
                : "No entries found for this review."}
            </div>
            {canStartProcessing && (
              <div className="text-sm text-muted-foreground">
                Click &ldquo;Start Analysis&rdquo; to begin the three-phase AI
                processing of your project data.
              </div>
            )}
          </div>
        )}

        {hasEntries && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Review Entries</h2>
            <Accordion type="multiple">
              {Object.values(REVIEW_CATEGORIES)
                .filter((category) => category !== REVIEW_CATEGORIES.NONE)
                .map((category) => {
                  const categoryEntries = [
                    ...currentReview.entries.filter(
                      (entry) => entry.category === category
                    ),
                    ...processedEntries.filter(
                      (entry) => entry.category === category
                    ),
                  ];

                  if (categoryEntries.length === 0) return null;

                  return (
                    <DefaultAccordionItem
                      key={category}
                      value={category}
                      triggerTitle={getCategoryDisplayName(category)}
                      triggerSubTitle={`${categoryEntries.length} ${categoryEntries.length === 1 ? "entry" : "entries"}`}
                    >
                      <div className="space-y-4">
                        {categoryEntries.map((entry, index) => (
                          <div
                            key={entry.id || `temp-${index}`}
                            className="border rounded-lg p-4"
                          >
                            <div className="text-sm mb-2">
                              {typeof entry.content === "string"
                                ? entry.content
                                : entry.generatedContent ||
                                  "No content available"}
                            </div>
                            {entry.project && (
                              <div className="text-xs text-muted-foreground">
                                Project: {entry.project.project}
                              </div>
                            )}
                            {entry.isEdited && (
                              <div className="text-xs text-muted-foreground">
                                Edited by user
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </DefaultAccordionItem>
                  );
                })}
            </Accordion>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default WeeklyBusinessReviewDetailPage;
