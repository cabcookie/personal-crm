import useMeetings, { Meeting } from "@/api/useMeetings";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingRecord from "@/components/meetings/meeting";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useContextContext } from "@/contexts/ContextContext";
import { addDaysToDate, toLocaleDateString } from "@/helpers/functional";
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
      {!meetings ? (
        "Loading meetings…"
      ) : (
        <>
          <Pagination className="bg-bgTransparent sticky top-[7rem] z-8">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage(page - 1)} />
                </PaginationItem>
              )}
              <PaginationItem>
                {toLocaleDateString(fromDate)} – {toLocaleDateString(toDate)}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={() => setPage(page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {meetingDates.map((date) => (
            <div key={date.toLocaleDateString()}>
              <h2 className="text-center text-lg md:text-xl font-bold bg-bgTransparent sticky top-[9rem] z-8 tracking-tight">
                {date.toLocaleDateString()}
              </h2>
              {meetings
                ?.filter(
                  ({ meetingOn }) =>
                    meetingOn.toISOString().split("T")[0] ===
                    date.toISOString().split("T")[0]
                )
                .map((meeting: Meeting) => (
                  <MeetingRecord key={meeting.id} meeting={meeting} />
                ))}
            </div>
          ))}
        </>
      )}
    </MainLayout>
  );
}
