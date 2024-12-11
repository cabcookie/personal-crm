import { useGeneralChat } from "@/api/useGeneralChat";
import ChatLayout from "@/components/layouts/ChatLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useRouter } from "next/router";
import { FormEvent } from "react";

const ChatPage = () => {
  const { createConversation } = useGeneralChat();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const prompt = data.get("message") as string;
    const conversation = await createConversation();
    if (!conversation) return;
    await conversation.sendMessage({
      content: [{ text: prompt }],
    });
    router.push(`/chat/${conversation.id}`);
  };

  return (
    <ChatLayout title="Chat" sectionName="Chat">
      <div className="mt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            name="message"
            aria-label="message"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <Button type="submit" className="gap-1">
            <SendHorizonal className="w-5 h-5" /> Send
          </Button>
        </form>
      </div>
    </ChatLayout>
  );
};

export default ChatPage;
