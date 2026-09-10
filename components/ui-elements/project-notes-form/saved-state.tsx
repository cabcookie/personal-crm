import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";

type SavedStateProps = {
  saved: boolean;
};

const SavedState: FC<SavedStateProps> = (props) => {
  const [showSavedMsg, setShowSavedMsg] = useState(props.saved);
  const [lastSaved, setLastSaved] = useState(props.saved);

  // Adjusting state during render is React's documented alternative to
  // syncing it in an effect, and avoids the extra render pass.
  if (lastSaved !== props.saved) {
    setLastSaved(props.saved);
    setShowSavedMsg(props.saved);
  }

  useEffect(() => {
    if (!props.saved) return;
    const timer = setTimeout(() => setShowSavedMsg(false), 2000);
    return () => clearTimeout(timer);
  }, [props.saved]);

  return (
    <div
      className={cn(
        "text-xs pt-3 px-2 text-muted-foreground",
        props.saved
          ? showSavedMsg
            ? ""
            : "animate-fadeOut"
          : "border rounded-md"
      )}
    >
      {props.saved ? "Changes saved" : "Unsaved changes"}
    </div>
  );
};
export default SavedState;
