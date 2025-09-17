import { Dispatch, FC, SetStateAction, useState } from "react";
import { Send } from "lucide-react";
import { improveWeeklyNarrative } from "@/helpers/weeklyReviewHelpers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useWeeklyReview, WeeklyReviewEntry } from "@/api/useWeeklyReview";

interface ImprovementInputProps {
  weeklyReviewEntry: WeeklyReviewEntry;
  setContent: Dispatch<SetStateAction<string>>;
}

export const ImprovementInput: FC<ImprovementInputProps> = ({
  weeklyReviewEntry,
  setContent,
}) => {
  const { updateWeeklyReviewEntryContent } = useWeeklyReview();

  const [feedback, setFeedback] = useState("");
  const [isImproving, setIsImproving] = useState(false);

  const handleImproveNarrative = async () => {
    if (!feedback.trim() || isImproving) return;

    try {
      setIsImproving(true);
      const improvedContent = await improveWeeklyNarrative(
        weeklyReviewEntry,
        feedback
      );

      if (improvedContent) {
        await updateWeeklyReviewEntryContent(
          weeklyReviewEntry.id,
          improvedContent
        );
        setContent(improvedContent);
        setFeedback("");
      }
    } catch (error) {
      console.error("Failed to improve narrative:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleImproveNarrative();
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Input
        placeholder="Provide feedback to improve the narrative..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isImproving}
        className="flex-1"
      />
      <Button
        onClick={handleImproveNarrative}
        disabled={!feedback.trim() || isImproving}
        size="sm"
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {isImproving ? "Improving..." : "Improve"}
      </Button>
    </div>
  );
};
