import usePerson from "@/api/usePerson";
import useCurrentUser from "@/api/useUser";
import { setCurrentJobByUser } from "@/helpers/chat/current-job";
import { handlePromptSend } from "@/helpers/chat/handle-send";
import {
  MentionedPerson,
  setMentionedPeopleByPrompt,
} from "@/helpers/chat/set-mentioned-people";
import { cn } from "@/lib/utils";
import { PersonJob } from "@/pages/chat";
import { SendMessage } from "@aws-amplify/ui-react-ai";
import { JSONContent } from "@tiptap/core";
import { FC, useEffect, useState } from "react";
import { emptyDocument } from "../ui-elements/editors/helpers/document";
import ChatInput from "./ChatInput";
import ChatMetadata from "./ChatMetadata";
import ChatSendBtn from "./ChatSendBtn";
import ChatUiGradient from "./ChatUiGradient";

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
  const { person: chatUser } = usePerson(user?.personId);
  const [currentJob, setCurrentJob] = useState<PersonJob | undefined>();
  const [mentionedPeople, setMentionedPeople] = useState<
    MentionedPerson[] | undefined
  >();

  useEffect(() => {
    setCurrentJobByUser(user, chatUser, setCurrentJob);
  }, [chatUser, user]);

  useEffect(() => {
    setMentionedPeopleByPrompt(prompt, setMentionedPeople);
  }, [prompt]);

  const handleSend = () =>
    handlePromptSend(
      setIsSending,
      currentJob,
      mentionedPeople,
      onSend,
      prompt,
      setPrompt
    );

  return (
    <div className={cn(className)}>
      <ChatUiGradient />
      <div className="relative bg-white/95">
        <ChatInput key={id} {...{ prompt, setPrompt, handleSend }} />
        <ChatSendBtn {...{ isSending, handleSend }} />
      </div>
      <ChatMetadata {...{ currentJob, mentionedPeople }} />
    </div>
  );
};

export default MessageInput;
