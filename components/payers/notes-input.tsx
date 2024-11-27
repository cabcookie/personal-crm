import { Payer } from "@/api/usePayer";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type NotesInputProps = {
  payer: Payer | undefined;
  onChange: (notes: string) => void;
  className?: string;
};

const NotesInput: FC<NotesInputProps> = ({ payer, onChange, className }) => {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(payer?.notes ?? "");
  }, [payer]);

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
