import { WeeklyReview } from "@/api/useWeeklyReview";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { format } from "date-fns";
import { Accordion } from "../ui/accordion";
import { AccordionWeeklyReviewEntry } from "./AccordionWeeklyReviewEntry";
import { getEntryCount, getValidEntries } from "@/helpers/weeklyReviewHelpers";
interface AccordionWeeklyReviewProps {
  weeklyReview: WeeklyReview;
}

export const AccordionWeeklyReview: FC<AccordionWeeklyReviewProps> = ({
  weeklyReview,
}) => (
  <DefaultAccordionItem
    value={weeklyReview.id}
    triggerTitle={`Weekly Business Review for ${format(weeklyReview.date, "PP")}`}
    triggerSubTitle={`Created on ${format(weeklyReview.createdAt, "PPp")}, Entries: ${getEntryCount(weeklyReview)}`}
    className="tracking-tight"
  >
    <Accordion type="single" collapsible>
      {(!weeklyReview.entries || weeklyReview.entries.length === 0) && (
        <div>No entries found</div>
      )}

      {getValidEntries(weeklyReview).map((e) => (
        <AccordionWeeklyReviewEntry key={e.id} weeklyReviewEntry={e} />
      ))}
    </Accordion>
  </DefaultAccordionItem>
);
