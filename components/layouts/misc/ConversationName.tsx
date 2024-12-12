import { format } from "date-fns";
import { FC } from "react";

interface ConversationNameProps {
  name?: string;
  updatedAt: Date | string;
  className?: string;
}

const ConversationName: FC<ConversationNameProps> = ({
  name,
  updatedAt,
  className,
}) => (
  <div className={className}>
    <div>{name || "Untitled conversation"}</div>
    <div className="text-xs text-muted-foreground">
      {format(updatedAt, "PPp")}
    </div>
  </div>
);

export default ConversationName;
