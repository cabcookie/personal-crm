import { Meeting } from "@/api/useMeetings";
import { toLocaleDateString } from "@/helpers/functional";
import { parseISO } from "date-fns";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import MeetingAccordionItem from "./MeetingAccordionItem";

type MeetingDateListProps = {
  meetings?: Meeting[];
  meetingDate: string;
};

const MeetingDateList: FC<MeetingDateListProps> = ({
  meetings,
  meetingDate,
}) => (
  <div>
    <h1 className="text-center text-lg md:text-xl font-bold bg-bgTransparent sticky top-[10rem] md:top-[11rem] z-30 tracking-tight pb-1">
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
