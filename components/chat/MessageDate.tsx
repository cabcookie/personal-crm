import { cn } from "@/lib/utils";
import {
  format,
  isSameISOWeek,
  isToday,
  isYesterday,
  startOfToday,
} from "date-fns";
import { FC } from "react";

interface MessageDateProps {
  date: string | Date;
  className?: string;
}

const MessageDate: FC<MessageDateProps> = ({ date, className }) => (
  <div className={cn(className)}>
    {isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : format(date, isSameISOWeek(date, startOfToday()) ? "eeee" : "PPP")}
  </div>
);

export default MessageDate;
