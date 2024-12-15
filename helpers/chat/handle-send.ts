import { PromptWithContext } from "@/components/chat/MessageInput";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { createAiContext } from "@/helpers/chat/create-ai-context";
import { PersonJob } from "@/pages/chat";
import { SendMessage } from "@aws-amplify/ui-react-ai";
import { JSONContent } from "@tiptap/core";
import { Dispatch, SetStateAction } from "react";
import { MentionedPerson } from "./set-mentioned-people";

export const handlePromptSend = (
  setIsSending: Dispatch<SetStateAction<boolean>>,
  currentJob: PersonJob | undefined,
  mentionedPeople: MentionedPerson[] | undefined,
  onSend: SendMessage,
  prompt: JSONContent,
  setPrompt: Dispatch<SetStateAction<JSONContent>>
) => {
  setIsSending(true);
  const message = {
    content: [{ text: getTextFromJsonContent(prompt) }],
    aiContext: createAiContext(currentJob, mentionedPeople),
  } as PromptWithContext;
  console.log({ message });
  onSend(message);
  setPrompt(emptyDocument);
};
