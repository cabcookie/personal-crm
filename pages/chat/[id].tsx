import ChatConversation from "@/components/chat/ChatConversation";
import ChatLayout from "@/components/layouts/ChatLayout";
import { useRouter } from "next/router";

/**
 * hier geht es weiter: https://github.com/aws-samples/amplify-ai-examples/blob/main/claude-ai/src/app/chat/%5Bid%5D/Chat.tsx
 * https://docs.amplify.aws/react/ai/set-up-ai/
 */

const ChatConversationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const chatId = Array.isArray(id) ? id[0] : id;

  return (
    <ChatLayout title="Chat" sectionName="Chat">
      {chatId && <ChatConversation {...{ chatId }} />}
    </ChatLayout>
  );
};

export default ChatConversationPage;
