import usePerson from "@/api/usePerson";
import useCurrentUser from "@/api/useUser";
import { PersonAccount } from "@/helpers/person/accounts";
import { cn } from "@/lib/utils";
import { PersonJob } from "@/pages/chat";
import { SendMessage } from "@aws-amplify/ui-react-ai";
import { JSONContent } from "@tiptap/core";
import { find, flow, get, identity } from "lodash/fp";
import { ArrowUp, Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { emptyDocument } from "../ui-elements/editors/helpers/document";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import InboxEditor from "../ui-elements/editors/inbox-editor/InboxEditor";
import { Button } from "../ui/button";

export type PromptWithContext = Parameters<SendMessage>[0];

interface MessageInputProps {
  id: string;
  onSend: SendMessage;
  className?: string;
  currentJob?: PersonJob;
}

const MessageInput: FC<MessageInputProps> = ({ id, onSend, className }) => {
  const [prompt, setPrompt] = useState<JSONContent>(emptyDocument);
  const [isSending, setIsSending] = useState(false);
  const { user } = useCurrentUser();
  const { person } = usePerson(user?.personId);
  const [currentJob, setCurrentJob] = useState<PersonJob | undefined>();

  useEffect(() => {
    flow(
      identity<typeof person>,
      get("accounts"),
      find<PersonAccount>(["isCurrent", true]),
      (account) =>
        !account
          ? undefined
          : {
              user: user?.userName,
              employer: account.accountName,
              jobRole: account.position,
            },
      setCurrentJob
    )(person);
  }, [person, user?.userName]);

  const handleSend = () => {
    setIsSending(true);
    const message = {
      content: [{ text: getTextFromJsonContent(prompt) }],
      aiContext: () => ({
        user: currentJob,
      }),
    } as PromptWithContext;
    onSend(message);
    setPrompt(emptyDocument);
  };

  return (
    <div className={cn(className)}>
      <div className="w-full h-8 bg-gradient-to-t from-background/95 via-background/80 to-background/0" />

      <div className="relative bg-white/95">
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
          disabled={isSending}
        >
          {!isSending ? <ArrowUp /> : <Loader2 className="animate-spin" />}
        </Button>
      </div>

      {currentJob?.user && (
        <div className="text-xs text-muted-foreground p-2 pt-1 space-y-1 bg-white/95">
          <div>We will integrate the following information in the request:</div>
          <ul className="list-disc list-inside">
            <li>
              Your name: {currentJob.user} (
              {currentJob.jobRole && `${currentJob.jobRole} `}at{" "}
              {currentJob.employer})
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
