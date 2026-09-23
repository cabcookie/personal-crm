import { FC, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

/**
 * A labelled textarea that saves ON BLUR, but only when the content actually
 * changed since it was last loaded/saved. Shows a brief "saving…" then
 * "saved ✓" indicator next to the label so the user gets feedback without a
 * save button.
 */
type Props = {
  label: string;
  hint?: string;
  value: string;
  rows?: number;
  placeholder?: string;
  /** Persist the new value. Resolve when done. */
  onSave: (value: string) => Promise<unknown> | void;
};

type Status = "idle" | "saving" | "saved";

const AutoSaveTextarea: FC<Props> = ({
  label,
  hint,
  value,
  rows = 2,
  placeholder,
  onSave,
}) => {
  const [draft, setDraft] = useState(value);
  const [savedValue, setSavedValue] = useState(value);
  const [status, setStatus] = useState<Status>("idle");

  // Adopt an externally loaded/changed value (render-time sync, no effect).
  const [lastExternal, setLastExternal] = useState(value);
  if (value !== lastExternal) {
    setLastExternal(value);
    // Only overwrite the draft if the user isn't mid-edit on a diverged value.
    if (draft === savedValue) setDraft(value);
    setSavedValue(value);
  }

  const handleBlur = async () => {
    if (draft === savedValue) return; // nothing changed
    setStatus("saving");
    try {
      await onSave(draft);
      setSavedValue(draft);
      setStatus("saved");
      // Fade the "saved" hint back to idle shortly after.
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Label className="text-xs">{label}</Label>
        {status === "saving" && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> speichert…
          </span>
        )}
        <span
          className={cn(
            "flex items-center gap-1 text-[10px] text-green-600 transition-opacity duration-300",
            status === "saved" ? "opacity-100" : "opacity-0"
          )}
        >
          <Check className="w-3 h-3" /> gespeichert
        </span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Textarea
        rows={rows}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default AutoSaveTextarea;
