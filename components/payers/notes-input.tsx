import { Payer } from "@/api/usePayer";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type NotesInputProps = {
  payer: Payer | undefined;
  onChange: (notes: string) => void;
  className?: string;
};

const NotesInput: FC<NotesInputProps> = ({ payer, onChange, className }) => {
  const [notes, setNotes] = useState(payer?.notes ?? "");
  const [lastPayer, setLastPayer] = useState(payer);

  // Adjusting state during render is React's documented alternative to
  // syncing it in an effect, and avoids the extra render pass.
  if (lastPayer !== payer) {
    setLastPayer(payer);
    setNotes(payer?.notes ?? "");
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes…"
      />
      <Button
        disabled={notes === (payer?.notes ?? "")}
        onClick={() => onChange(notes)}
        size="sm"
      >
        Save
      </Button>
    </div>
  );
};

export default NotesInput;
