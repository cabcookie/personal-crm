import { WeeklyReview, useWeeklyReview } from "@/api/useWeeklyReview";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { format } from "date-fns";
import { Accordion } from "../ui/accordion";
import { AccordionWeeklyReviewEntry } from "./AccordionWeeklyReviewEntry";
import {
  getEntryCount,
  getValidEntries,
  getIgnoredEntryCount,
} from "@/helpers/weeklyReviewHelpers";
import { IgnoredProjectsList } from "./IgnoredProjectsList";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle, RotateCcw } from "lucide-react";
interface AccordionWeeklyReviewProps {
  weeklyReview: WeeklyReview;
}

export const AccordionWeeklyReview: FC<AccordionWeeklyReviewProps> = ({
  weeklyReview,
}) => {
  const { updateWeeklyReviewStatus } = useWeeklyReview();
  const relevantCount = getEntryCount(weeklyReview);
  const ignoredCount = getIgnoredEntryCount(weeklyReview);

  const handleToggleStatus = async () => {
    const newStatus =
      weeklyReview.status === "completed" ? "draft" : "completed";
    await updateWeeklyReviewStatus(weeklyReview.id, newStatus);
  };

  const getStatusBadge = () => {
    const variant =
      weeklyReview.status === "completed" ? "default" : "secondary";
    const text = weeklyReview.status === "completed" ? "Completed" : "Draft";
    return <Badge variant={variant}>{text}</Badge>;
  };

  return (
    <DefaultAccordionItem
      value={weeklyReview.id}
      triggerTitle={
        <div className="flex items-center gap-2">
          <span>
            Weekly Business Review for {format(weeklyReview.date, "PP")}
          </span>
          {getStatusBadge()}
        </div>
      }
      triggerSubTitle={`Created on ${format(weeklyReview.createdAt, "PPp")}, Relevant: ${relevantCount}, Ignored: ${ignoredCount}`}
      className="tracking-tight"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {weeklyReview.status === "completed" ? (
              <>
                <RotateCcw className="size-4 mr-2" />
                Reopen Review
              </>
            ) : (
              <>
                <CheckCircle className="size-4 mr-2" />
                Complete Review
              </>
            )}
          </Button>
        </div>

        <Accordion type="single" collapsible>
          {(!weeklyReview.entries || weeklyReview.entries.length === 0) && (
            <div>No entries found</div>
          )}

          {getValidEntries(weeklyReview).map((e) => (
            <AccordionWeeklyReviewEntry key={e.id} weeklyReviewEntry={e} />
          ))}
        </Accordion>

        <IgnoredProjectsList weeklyReview={weeklyReview} />
      </div>
    </DefaultAccordionItem>
  );
};
