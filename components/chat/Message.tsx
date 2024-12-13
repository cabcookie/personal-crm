import { User } from "@/api/useUser";
import { ConversationMessage } from "@aws-amplify/ui-react-ai";
import { FC } from "react";
import ReactMarkdown from "react-markdown";
import MessageAvatar from "./MessageAvatar";

interface MessageProps {
  message: ConversationMessage & { isLoading?: boolean };
  user?: User;
}

const Message: FC<MessageProps> = ({ message, user }) => (
  <div key={message.id} className="space-y-4 w-full">
    <MessageAvatar
      messageDate={message.createdAt}
      role={message.role}
      user={user}
    />

    {message.content.map((content, index) => (
      <ReactMarkdown key={index} className="w-full overflow-x-auto">
        {content.text}
      </ReactMarkdown>
    ))}
  </div>
);

export default Message;
