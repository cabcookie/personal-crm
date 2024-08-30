import MainLayout from "@/components/layouts/MainLayout";
import MeetingDateList from "@/components/meetings/meeting-date-list";
import MeetingFilter from "@/components/meetings/meeting-filter";
import MeetingPagination from "@/components/meetings/meeting-pagination";
import {
  useMeetingFilter,
  withMeetingFilter,
} from "@/components/meetings/useMeetingFilter";
import { useContextContext } from "@/contexts/ContextContext";
import { useRouter } from "next/router";

const MeetingsPage = () => {
  const { context } = useContextContext();
  const {
    createMeeting,
    meetingDates,
    meetings,
    fromDate,
    toDate,
    handleNextClick,
    handlePrevClick,
  } = useMeetingFilter();
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
      <MeetingFilter />

      <MeetingPagination
        {...{ handleNextClick, handlePrevClick, fromDate, toDate }}
      />
      {meetingDates.map((date) => (
        <MeetingDateList key={date} meetingDate={date} meetings={meetings} />
      ))}
    </MainLayout>
  );
};

export default withMeetingFilter(MeetingsPage);
