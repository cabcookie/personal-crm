import { WeeklyReview, useWeeklyReview } from "@/api/useWeeklyReview";
import { FC } from "react";
import { CheckCircle, RotateCcw } from "lucide-react";
import { ToggleBtn } from "../ToggleBtn";

export const WbrStatusToggle: FC<WbrStatusToggleProps> = ({ weeklyReview }) => {
  const { updateWeeklyReviewStatus } = useWeeklyReview();

  const handleToggleStatus = async () => {
    const newStatus =
      weeklyReview.status === "completed" ? "draft" : "completed";
    await updateWeeklyReviewStatus(weeklyReview.id, newStatus);
  };

  return (
    <div className="flex items-center gap-2">
      <ToggleBtn
        {...{
          onClick: handleToggleStatus,
          isOn: weeklyReview.status === "completed",
          IconOn: RotateCcw,
          labelOn: "Reopen Review",
          IconOff: CheckCircle,
          labelOff: "Complete Review",
        }}
      />
    </div>
  );
};

interface WbrStatusToggleProps {
  weeklyReview: WeeklyReview;
}
