import { FC } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  meetingId: string;
};

/** Toast action for a finished meeting summary: jump straight to the meeting. */
const MeetingSummaryNotificationAction: FC<Props> = ({ meetingId }) => (
  <Button asChild variant="outline" size="sm">
    <Link href={`/meetings/${meetingId}`}>View</Link>
  </Button>
);

export default MeetingSummaryNotificationAction;
