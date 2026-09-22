import { FC, useState } from "react";
import { Sparkles } from "lucide-react";
import useCurrentUser, { type PromptContext } from "@/api/useUser";
import UserPromptEditor from "../profile/UserPromptEditor";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

/**
 * Unobtrusive opener next to the meeting actions. Shows the general AI prompt
 * plus the prompt for THIS meeting's context, editable inline (auto-saves on
 * blur, per field) without leaving the meeting. Reuses UserPromptEditor +
 * useUser so it stays in sync with the Tools page.
 */
type Props = { context?: PromptContext };

const MeetingPromptDialog: FC<Props> = ({ context }) => {
  const { user, savePromptField } = useCurrentUser();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          aria-label="KI-Kontext (User-Prompt)"
        >
          <Sparkles className="w-4 h-4" />
          KI-Kontext
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>KI-Kontext für dieses Meeting</DialogTitle>
          <DialogDescription>
            Dieser Hintergrund fließt in den Meeting-Assistenten ein. Änderungen
            werden automatisch gespeichert.
          </DialogDescription>
        </DialogHeader>

        <UserPromptEditor
          value={user?.prompts}
          onSaveField={savePromptField}
          onlyContext={context}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MeetingPromptDialog;
