import useMeetings from "@/api/useMeetings";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingDateList from "@/components/meetings/meeting-date-list";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useContextContext } from "@/contexts/ContextContext";
import {
  addDaysToDate,
  toISODateTimeString,
  toLocaleDateString,
} from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const calculateDate = (page: number) =>
  addDaysToDate(page * -4 * 7 + 1)(new Date());

export default function MeetingsPage() {
  const { context } = useContextContext();
  const [page, setPage] = useState(1);
  const { meetings, meetingDates, createMeeting } = useMeetings({
    context,
    page,
  });
  const router = useRouter();
  const [fromDate, setFromDate] = useState(calculateDate(page));
  const [toDate, setToDate] = useState(calculateDate(page - 1));

  useEffect(() => {
    setFromDate(calculateDate(page));
    setToDate(calculateDate(page - 1));
  }, [page]);

  const createAndOpenNewMeeting = async () => {
    const id = await createMeeting("New Meeting", context);
    if (!id) return;
    router.push(`/meetings/${id}`);
  };

  return (
    <MainLayout
      title="Meetings"
      sectionName="Meetings"
      addButton={{ label: "New", onClick: createAndOpenNewMeeting }}
    >
      <Pagination className="bg-bgTransparent sticky top-[7rem] md:top-[8rem] z-[35] pb-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage(page + 1)} />
          </PaginationItem>
          <PaginationItem>
            {toLocaleDateString(fromDate)} – {toLocaleDateString(toDate)}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page - 1)}
              className={cn(page < 2 && "hidden")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {meetingDates.map((date) => (
        <MeetingDateList
          key={toISODateTimeString(date)}
          meetingDate={date}
          meetings={meetings}
        />
      ))}
    </MainLayout>
  );
}
