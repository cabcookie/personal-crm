import { useAIConversation, useGeneralChat } from "@/api/useGeneralChat";
import useCurrentUser from "@/api/useUser";
import { AIConversation, Avatars, SendMessage } from "@aws-amplify/ui-react-ai";
import { FC, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import CircleProfileImg from "../profile/CircleProfileImg";

interface ChatConversationProps {
  chatId: string;
}

const ChatConversation: FC<ChatConversationProps> = ({ chatId }) => {
  const [
    {
      data: { messages, conversation },
      messages: errors,
      hasError,
      isLoading,
    },
    sendMessage,
  ] = useAIConversation("generalChat", { id: chatId });
  const { setConversationName } = useGeneralChat();
  const { user } = useCurrentUser();
  const [avatars, setAvatars] = useState<Avatars | undefined>();
  const [messageRenderer] = useState<
    Parameters<typeof AIConversation>[number]["messageRenderer"]
  >({ text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown> });

  useEffect(() => {
    if (!user) return;
    setAvatars({
      user: {
        username: user.userName,
        avatar: (
          <CircleProfileImg
            user={user}
            fallbackInitials="US"
            className="w-8 h-8"
          />
        ),
      },
    });
  }, [user]);

  const handleSendMessage: SendMessage = async (message) => {
    if (!chatId) return;
    if (!conversation) return;
    await sendMessage(message);
    if (conversation.name) return;
    await setConversationName(chatId, [...messages, message]);
  };

  return (
    <>
      <AIConversation
        {...{
          handleSendMessage,
          isLoading,
          messages,
          messageRenderer,
          avatars,
        }}
      />
      {hasError &&
        errors?.map((error, index) => (
          <div key={index} className="text-sm p-2 text-red-600 font-semibold">
            {error.message}
          </div>
        ))}
    </>
  );
};

export default ChatConversation;
