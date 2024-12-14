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
  <div key={message.id} className="space-y-4">
    <MessageAvatar
      messageDate={message.createdAt}
      role={message.role}
      user={user}
    />

    {message.content.map((content, index) => (
      <ReactMarkdown
        key={index}
        components={{
          pre: ({ node: _n, ...props }) => (
            <pre
              className="bg-muted text-sm text-muted-foreground rounded-sm border-solid border border-slate-300 px-2 overflow-x-auto"
              {...props}
            />
          ),
        }}
      >
        {content.text}
      </ReactMarkdown>
    ))}
  </div>
);

export default Message;
