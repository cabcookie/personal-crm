import { Meeting } from "@/api/useMeetings";
import { toLocaleDateString } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { parseISO } from "date-fns";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import MeetingAccordionItem from "./MeetingAccordionItem";

type MeetingDateListProps = {
  meetings?: Meeting[];
  meetingDate: string;
  className?: string;
};

const MeetingDateList: FC<MeetingDateListProps> = ({
  meetings,
  meetingDate,
  className,
}) => (
  <div>
    <h1
      className={cn(
        "text-center text-lg md:text-xl font-bold tracking-tight",
        className
      )}
    >
      {flow(parseISO, toLocaleDateString)(meetingDate)}
    </h1>

    <Accordion type="single" collapsible className="mb-8">
      {flow(
        filter((m: Meeting) => m.meetingDayStr === meetingDate),
        map((meeting) => (
          <MeetingAccordionItem key={meeting.id} meeting={meeting} />
        ))
      )(meetings)}
    </Accordion>
  </div>
);

export default MeetingDateList;
