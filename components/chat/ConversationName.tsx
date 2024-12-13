import { cn } from "@/lib/utils";
import { FC } from "react";

interface ConversationNameProps {
  name?: string;
  className?: string;
}

const ConversationName: FC<ConversationNameProps> = ({ name, className }) => (
  <h2
    className={cn(
      "text-xl md:text-2xl md:text-center font-semibold",
      className
    )}
  >
    {name || "New chat"}
  </h2>
);

export default ConversationName;
