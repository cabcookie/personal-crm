import { useGeneralChat } from "@/api/useGeneralChat";
import ConversationName from "@/components/chat/ConversationName";
import MessageInput from "@/components/chat/MessageInput";
import ChatLayout from "@/components/layouts/ChatLayout";
import { SendMessage } from "@aws-amplify/ui-react-ai";
import { useRouter } from "next/router";

export interface PersonJob {
  user?: string;
  employer: string;
  jobRole?: string;
}

const ChatPage = () => {
  const { createConversation, setConversationName } = useGeneralChat();
  const router = useRouter();

  const sendMessage: SendMessage = async (message) => {
    const conversation = await createConversation();
    if (!conversation) return;
    await conversation.sendMessage(message);
    await setConversationName(conversation.id, [message]);
    router.push(`/chat/${conversation.id}`);
  };

  return (
    <ChatLayout>
      <div className="space-y-4">
        <ConversationName name="Start new chat" />
        <MessageInput id="NEW" onSend={sendMessage} />
      </div>
    </ChatLayout>
  );
};

export default ChatPage;
