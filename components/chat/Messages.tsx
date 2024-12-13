import useCurrentUser from "@/api/useUser";
import { ConversationMessage } from "@aws-amplify/ui-react-ai";
import { format } from "date-fns";
import { flow, identity, map, uniq } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import Message from "./Message";
import MessageDate from "./MessageDate";

interface MessagesProps {
  messages: ConversationMessage[];
}

const Messages: FC<MessagesProps> = ({ messages }) => {
  const [messageDates, setMessageDates] = useState<string[]>([]);
  const { user } = useCurrentUser();

  useEffect(() => {
    flow(
      identity<typeof messages>,
      map("createdAt"),
      map((date) => format(date, "yyyy-MM-dd")),
      uniq,
      setMessageDates
    )(messages);
  }, [messages]);

  return messageDates?.map((date) => (
    <div key={date} className="flex flex-col items-center space-y-2">
      <MessageDate
        date={date}
        className="flex text-center text-xs text-muted-foreground bg-bgTransparent w-fit rounded-xl py-0.5 px-2 sticky top-[8rem] md:top-[7rem]"
      />

      <div className="space-y-8">
        {messages
          .filter((m) => format(m.createdAt, "yyyy-MM-dd") === date)
          .map((message) => (
            <Message key={message.id} message={message} user={user} />
          ))}
      </div>
    </div>
  ));
};

export default Messages;
