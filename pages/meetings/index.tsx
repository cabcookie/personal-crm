import MainLayout from "@/components/layouts/MainLayout";
import CreateOneOnOneMeeting from "@/components/meetings/create-one-on-one-meeting";
import MeetingDateList from "@/components/meetings/meeting-date-list";
import MeetingFilter from "@/components/meetings/meeting-filter";
import MeetingPagination from "@/components/meetings/meeting-pagination";
import {
  CreateMeetingProps,
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

  const createAndOpenNewMeeting = async (props: CreateMeetingProps) => {
    const id = await createMeeting(props);
    if (!id) return;
    router.push(`/meetings/${id}`);
  };

  return (
    <MainLayout
      title="Meetings"
      sectionName="Meetings"
      addButton={{
        label: "New",
        onClick: () =>
          createAndOpenNewMeeting({ topic: "New Meeting", context }),
      }}
    >
      <MeetingFilter />

      <MeetingPagination
        {...{ handleNextClick, handlePrevClick, fromDate, toDate }}
      />

      <CreateOneOnOneMeeting createMeeting={createAndOpenNewMeeting} />

      {meetingDates.map((date) => (
        <MeetingDateList key={date} meetingDate={date} meetings={meetings} />
      ))}
    </MainLayout>
  );
};

export default withMeetingFilter(MeetingsPage);
