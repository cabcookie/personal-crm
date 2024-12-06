import useMeeting from "@/api/useMeeting";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { FC } from "react";

type PersonNoteMeetingProps = {
  meetingId?: string;
  className?: string;
};

const PersonNoteMeeting: FC<PersonNoteMeetingProps> = ({
  meetingId,
  className,
}) => {
  const { meeting } = useMeeting(meetingId);

  return (
    meeting && (
      <div className={cn(className)}>
        Meeting:{" "}
        <Link
          href={`/meetings/${meeting.id}`}
          className="hover:text-blue-600 font-semibold"
        >
          {meeting.topic} ({format(meeting.meetingOn, "PPp")})
        </Link>
      </div>
    )
  );
};

export default PersonNoteMeeting;
