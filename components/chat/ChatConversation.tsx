import { Schema } from "@/amplify/data/resource";
import { useAIConversation, useGeneralChat } from "@/api/useGeneralChat";
import { cn } from "@/lib/utils";
import { SendMessage } from "@aws-amplify/ui-react-ai";
import { find, flow, get, identity, last } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import ConversationName from "./ConversationName";
import Errors from "./Errors";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

type Conversation = Schema["generalChat"]["type"];

interface ChatConversationProps {
  chatId: string;
}

const ChatConversation: FC<ChatConversationProps> = ({ chatId }) => {
  const [
    {
      data: { messages },
      messages: errors,
      hasError,
    },
    sendMessage,
  ] = useAIConversation("generalChat", { id: chatId });
  const { conversations, setConversationName } = useGeneralChat();
  const [conversation, setConversation] = useState<Conversation | undefined>();
  const { open } = useSidebar();

  const getInputFieldKey = () =>
    `${get("id")(conversation) ?? "NA"}-${flow(identity<typeof messages>, last, get("id"))(messages)}`;

  useEffect(() => {
    flow(
      identity<Conversation[] | undefined>,
      find<Conversation>(["id", chatId]),
      setConversation
    )(conversations);
  }, [chatId, conversations]);

  const handleSendMessage: SendMessage = async (message) => {
    if (!chatId) return;
    if (!conversation) return;
    await sendMessage(message);
    if (conversation.name) return;
    await setConversationName(chatId, [...messages, message]);
  };

  return (
    <div className="space-y-4">
      <ConversationName
        name={conversation?.name}
        className={cn(
          "sticky top-[5.25rem] bg-bgTransparent pb-2 z-30",
          open && "md:static",
          !open && "md:top-[6.25rem]"
        )}
      />

      <Messages {...{ messages }} />

      <Errors {...{ hasError, errors }} />

      <MessageInput
        id={getInputFieldKey()}
        onSend={handleSendMessage}
        className="sticky bottom-0 left-0 right-0 md:left-1 md:right-1"
      />
    </div>
  );
};

export default ChatConversation;
