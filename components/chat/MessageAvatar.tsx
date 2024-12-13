import { User } from "@/api/useUser";
import { differenceInHours, format, formatDistanceToNow } from "date-fns";
import { Bot } from "lucide-react";
import { FC } from "react";
import CircleProfileImg from "../profile/CircleProfileImg";

interface MessageAvatarProps {
  user?: User;
  role: "user" | "assistant";
  messageDate: string | Date;
}

const MessageAvatar: FC<MessageAvatarProps> = ({ user, role, messageDate }) => (
  <div className="flex flex-row gap-2 items-center">
    {role === "user" ? (
      <CircleProfileImg user={user} fallbackInitials="US" className="w-8 h-8" />
    ) : (
      <div className="w-8 h-8 rounded-full bg-[--context-color] p-1">
        <Bot className="w-6 h-6 text-slate-600" />
      </div>
    )}

    <div className="flex flex-row gap-2 items-baseline">
      <div className="font-semibold">
        {role === "user" ? (user?.userName ?? "User") : "Assistant"}
      </div>
      <div className="text-muted-foreground text-xs">
        {differenceInHours(new Date(), messageDate) < 4
          ? formatDistanceToNow(messageDate, { addSuffix: true })
          : format(messageDate, "p")}
      </div>
    </div>
  </div>
);

export default MessageAvatar;
