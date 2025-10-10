import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { copyProjectNotes } from "./copyProjectNotes";

interface CopyProjectNotesButtonsProps {
  projectId: string;
}

const CopyProjectNotesButtons: FC<CopyProjectNotesButtonsProps> = ({
  projectId,
}) => {
  const [copyingNotes, setCopyingNotes] = useState(false);
  const [confirmCopied, setConfirmCopied] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const weeksToReview = [1, 2, 4];

  const onClick = async (weeks: number) => {
    setCopyingNotes(true);
    try {
      await copyProjectNotes(projectId, weeks);
    } catch (error) {
      console.error("Failed to copy notes:", error);
    } finally {
      setCopyingNotes(false);
      setConfirmCopied(true);
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 1000);
      setTimeout(() => setConfirmCopied(false), 2000);
    }
  };

  if (copyingNotes)
    return (
      <div className="h-9 flex items-center gap-1 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <div>Copying notes...</div>
      </div>
    );

  if (confirmCopied)
    return (
      <div
        className={`h-9 flex items-center gap-1 transition-colors duration-1000 ${
          fadeOut ? "text-white" : "text-muted-foreground"
        }`}
      >
        <Check className="size-4" />
        <div>Project Notes copied to clipboard</div>
      </div>
    );

  return (
    <div className="flex gap-1 items-center text-muted-foreground">
      <span>Copy notes from last</span>
      {weeksToReview.map((weeks) => (
        <Button
          key={weeks}
          variant="ghost"
          size="sm"
          onClick={() => onClick(weeks)}
        >
          <Copy className="size-3 mr-1" />
          {weeks}
        </Button>
      ))}
      <span>weeks</span>
    </div>
  );
};

export default CopyProjectNotesButtons;
