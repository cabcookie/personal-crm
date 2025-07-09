import { WeeklyReview } from "@/api/useWeeklyReview";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import { AccordionWeeklyReviewEntry } from "./AccordionWeeklyReviewEntry";
import { getValidEntries } from "@/helpers/weeklyReviewHelpers";
import { IgnoredProjectsList } from "./IgnoredProjectsList";
import { getWbrSubtitle, WbrTitle } from "./WbrTitle";
import { WbrStatusToggle } from "./WbrStatusToggle";

export const AccordionWeeklyReview: FC<AccordionWeeklyReviewProps> = ({
  weeklyReview,
}) => (
  <DefaultAccordionItem
    value={weeklyReview.id}
    triggerTitle={<WbrTitle {...{ weeklyReview }} />}
    triggerSubTitle={getWbrSubtitle(weeklyReview)}
    className="tracking-tight"
  >
    <div className="space-y-4">
      <WbrStatusToggle {...{ weeklyReview }} />

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

interface AccordionWeeklyReviewProps {
  weeklyReview: WeeklyReview;
}
