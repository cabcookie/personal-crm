import ChatConversation from "@/components/chat/ChatConversation";
import ChatLayout from "@/components/layouts/ChatLayout";
import { useRouter } from "next/router";

const ChatConversationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const chatId = Array.isArray(id) ? id[0] : id;

  return (
    <ChatLayout>
      {chatId && <ChatConversation key={chatId} {...{ chatId }} />}
    </ChatLayout>
  );
};

export default ChatConversationPage;
