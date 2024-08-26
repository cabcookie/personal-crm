import useMeetings from "@/api/useMeetings";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingDateList from "@/components/meetings/meeting-date-list";
import MeetingPagination from "@/components/meetings/meeting-pagination";
import useMeetingPagination from "@/components/meetings/useMeetingPagination";
import { useContextContext } from "@/contexts/ContextContext";
import { useRouter } from "next/router";

export default function MeetingsPage() {
  const { context } = useContextContext();
  const { fromDate, toDate, handleNextClick, handlePrevClick } =
    useMeetingPagination();
  const { meetings, meetingDates, createMeeting } = useMeetings({
    context,
    startDate: fromDate,
  });
  const router = useRouter();

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
      <MeetingPagination
        {...{ handleNextClick, handlePrevClick, fromDate, toDate }}
      />
      {meetingDates.map((date) => (
        <MeetingDateList key={date} meetingDate={date} meetings={meetings} />
      ))}
    </MainLayout>
  );
}
