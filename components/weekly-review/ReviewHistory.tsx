import { Accordion } from "@/components/ui/accordion";
import DefaultAccordionItem from "@/components/ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import { useWeeklyReview } from "@/api/useWeeklyReview";
import { format, startOfWeek } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { REVIEW_CATEGORIES } from "@/helpers/weeklyReviewHelpers";

const ReviewHistory = () => {
  const { reviews, loadingReviews, errorReviews } = useWeeklyReview();

  if (loadingReviews) {
    return (
      <Accordion type="multiple">
        <LoadingAccordionItem
          sizeTitle="sm"
          sizeSubtitle="2xl"
          value="loading"
        />
      </Accordion>
    );
  }

  if (errorReviews) {
    return (
      <div className="text-sm text-muted-foreground">
        Error loading weekly reviews. Please try again.
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          No weekly business reviews found.
        </div>
        <div className="text-sm text-muted-foreground">
          Click &ldquo;Create New Review&rdquo; to generate your first business
          intelligence report.
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "in_progress":
        return <Badge variant="outline">In Progress</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return null;
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

  const getCategoryEntries = (entries: any[], category: string) => {
    return entries.filter((entry) => entry.category === category);
  };

  return (
    <Accordion type="multiple">
      {reviews.map((review) => {
        const weekStart = startOfWeek(review.date, { weekStartsOn: 1 });
        const weekTitle = `Week of ${format(weekStart, "MMMM do, yyyy")}`;

        return (
          <DefaultAccordionItem
            key={review.id}
            value={`review-${review.id}`}
            triggerTitle={weekTitle}
            triggerSubTitle={[
              `${review.entries.length} entries`,
              format(review.date, "MMM do, yyyy"),
            ]}
            badge={getStatusBadge(review.status)}
            link={`/weekly-business-review/${review.id}`}
          >
            <div className="space-y-4">
              {review.title && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Title
                  </h3>
                  <p className="text-sm">{review.title}</p>
                </div>
              )}

              {review.description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p className="text-sm">{review.description}</p>
                </div>
              )}

              {review.entries.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">
                    Categories
                  </h3>
                  <Accordion type="multiple" className="ml-4">
                    {Object.values(REVIEW_CATEGORIES)
                      .filter((category) => category !== REVIEW_CATEGORIES.NONE)
                      .map((category) => {
                        const categoryEntries = getCategoryEntries(
                          review.entries,
                          category
                        );
                        if (categoryEntries.length === 0) return null;

                        return (
                          <DefaultAccordionItem
                            key={category}
                            value={`${review.id}-${category}`}
                            triggerTitle={getCategoryDisplayName(category)}
                            triggerSubTitle={`${categoryEntries.length} ${categoryEntries.length === 1 ? "entry" : "entries"}`}
                          >
                            <div className="space-y-3">
                              {categoryEntries.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="border-l-2 border-muted pl-3"
                                >
                                  <div className="text-sm">
                                    {typeof entry.content === "string"
                                      ? entry.content
                                      : entry.generatedContent ||
                                        "No content available"}
                                  </div>
                                  {entry.isEdited && (
                                    <div className="text-xs text-muted-foreground mt-1">
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

              <div className="pt-2">
                <Link
                  href={`/weekly-business-review/${review.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View and edit full review →
                </Link>
              </div>
            </div>
          </DefaultAccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ReviewHistory;
