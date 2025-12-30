import { Check, Copy, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { copyPersonNotes } from "./copyPersonNotes";

interface CopyPersonNotesButtonsProps {
  personId: string;
}

const CopyPersonNotesButtons: FC<CopyPersonNotesButtonsProps> = ({
  personId,
}) => {
  const [copyingNotes, setCopyingNotes] = useState(false);
  const [confirmCopied, setConfirmCopied] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const monthsToReview = [1, 3, 12];

  const onClick = async (months: number) => {
    setCopyingNotes(true);
    try {
      await copyPersonNotes(personId, months);
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
        <div>Copied notes about person to clipboard</div>
      </div>
    );

  return (
    <div className="flex gap-1 items-center text-muted-foreground">
      <span>Copy notes from last</span>
      {monthsToReview.map((months) => (
        <Button
          key={months}
          variant="ghost"
          size="sm"
          onClick={() => onClick(months)}
        >
          <Copy className="size-3 mr-1" />
          {months}
        </Button>
      ))}
      <span>months</span>
    </div>
  );
};

export default CopyPersonNotesButtons;
