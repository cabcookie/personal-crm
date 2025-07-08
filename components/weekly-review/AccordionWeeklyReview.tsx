import { WeeklyReview } from "@/api/useWeeklyReview";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { format, startOfWeek } from "date-fns";

import { Accordion } from "../ui/accordion";
import { AccordionWeeklyReviewEntry } from "./AccordionWeeklyReviewEntry";
interface AccordionWeeklyReviewProps {
  weeklyReview: WeeklyReview;
}

export const AccordionWeeklyReview: FC<AccordionWeeklyReviewProps> = ({
  weeklyReview,
}) => {
  const weekStart = startOfWeek(weeklyReview.date, { weekStartsOn: 1 });
  return (
    <DefaultAccordionItem
      value={weeklyReview.id}
      triggerTitle={`Weekly Business Review for ${format(weekStart, "PP")}`}
      triggerSubTitle={`Created on ${format(weeklyReview.createdAt, "PPp")}`}
      className="tracking-tight"
    >
      <Accordion type="single" collapsible>
        {(!weeklyReview.entries || weeklyReview.entries.length === 0) && (
          <div>No entries found</div>
        )}

        {weeklyReview.entries.map((e) => (
          <AccordionWeeklyReviewEntry key={e.id} weeklyReviewEntry={e} />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};
