import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/core";
import { ArrowUp } from "lucide-react";
import { FC, useState } from "react";
import { emptyDocument } from "../ui-elements/editors/helpers/document";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import InboxEditor from "../ui-elements/editors/inbox-editor/InboxEditor";
import { Button } from "../ui/button";

interface MessageInputProps {
  id: string;
  onSend: (prompt: string) => void;
  className?: string;
}

const MessageInput: FC<MessageInputProps> = ({ id, onSend, className }) => {
  const [prompt, setPrompt] = useState<JSONContent>(emptyDocument);

  const handleSend = () => {
    onSend(getTextFromJsonContent(prompt));
    setPrompt(emptyDocument);
  };

  return (
    <div className={cn(className)}>
      <div className="w-full h-8 bg-gradient-to-t from-background/95 via-background/80 to-background/0" />

      <div className="relativ bg-white/95 pb-2">
        <InboxEditor
          key={id}
          notes={prompt}
          saveNotes={(editor) => setPrompt(editor.getJSON())}
          autoFocus
          placeholder="Send a message"
          saveAtCmdEnter={handleSend}
          showSaveStatus={false}
          className="pb-12 max-h-60 md:max-h-80 overflow-y-auto"
        />
        <Button
          className="rounded-full w-10 h-10 absolute bottom-3 right-1"
          onClick={handleSend}
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
