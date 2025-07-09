import { WeeklyReview } from "@/api/useWeeklyReview";
import { format } from "date-fns";
import { FC } from "react";
import { Badge } from "../ui/badge";
import {
  getEntryCount,
  getIgnoredEntryCount,
} from "@/helpers/weeklyReviewHelpers";

export const WbrTitle: FC<WbrTitleProps> = ({ weeklyReview }) => (
  <div className="flex items-center gap-2">
    <span>Weekly Business Review for {format(weeklyReview.date, "PP")}</span>
    {getStatusBadge(weeklyReview)}
  </div>
);

export const getWbrSubtitle = (weeklyReview: WeeklyReview) =>
  `Created on ${format(weeklyReview.createdAt, "PPp")}, Relevant: ${getEntryCount(weeklyReview)}, Ignored: ${getIgnoredEntryCount(weeklyReview)}`;

interface WbrTitleProps {
  weeklyReview: WeeklyReview;
}

const getStatusBadge = (weeklyReview: WeeklyReview) => {
  const variant = weeklyReview.status === "completed" ? "default" : "secondary";
  const text = weeklyReview.status === "completed" ? "Completed" : "Draft";
  return <Badge variant={variant}>{text}</Badge>;
};
