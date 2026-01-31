import MainLayout from "@/components/layouts/MainLayout";
import CreateOneOnOneMeeting from "@/components/meetings/create-one-on-one-meeting";
import MeetingDateList from "@/components/meetings/meeting-date-list";
import MeetingFilterBtnGrp from "@/components/meetings/meeting-filter";
import MeetingPagination from "@/components/meetings/meeting-pagination";
import {
  useMeetingFilter,
  withMeetingFilter,
} from "@/components/meetings/useMeetingFilter";
import SearchInput from "@/components/search/search-input";
import { useSearch } from "@/components/search/useSearch";
import { useContextContext } from "@/contexts/ContextContext";
import { CreateMeetingProps } from "@/helpers/meetings";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";

const MeetingsPage = () => {
  const { context } = useContextContext();
  const { isSearchActive } = useSearch();
  const {
    createMeeting,
    meetingDates,
    loadingMeetings,
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
      <div className="space-y-6">
        <SearchInput
          className={cn(
            "py-4",
            isSearchActive &&
              "bg-bgTransparent sticky top-[6.5rem] md:top-[8.25rem] z-[35] pb-0 md:pb-1"
          )}
        />

        <MeetingFilterBtnGrp className="bg-bgTransparent sticky top-[7rem] md:top-[8rem] z-[35] pb-1" />

        <MeetingPagination
          {...{ handleNextClick, handlePrevClick, fromDate, toDate }}
          className={cn(
            "bg-bgTransparent sticky z-[35] pb-1",
            isSearchActive
              ? "top-[12.5rem] md:top-[14.5rem]"
              : "top-[9.5rem] md:top-[10.5rem]"
          )}
        />

        <CreateOneOnOneMeeting createMeeting={createAndOpenNewMeeting} />

        {loadingMeetings && (
          <div className="flex gap-2 w-full items-center justify-center text-gray-400">
            <Loader2 className="animate-spin size-6" />
            <div className="text-lg animate-pulse">Loading…</div>
          </div>
        )}

        {!loadingMeetings && meetingDates.length === 0 && (
          <div className="flex w-full items-center justify-center text-gray-400">
            <div className="text-lg">No meetings found</div>
          </div>
        )}

        {meetingDates.map((date) => (
          <MeetingDateList
            key={date}
            meetingDate={date}
            meetings={meetings}
            className={cn(
              "bg-bgTransparent sticky z-30 pt-2 pb-1",
              isSearchActive
                ? "top-[15rem] md:top-[17.25rem]"
                : "top-[12rem] md:top-[13.25rem]"
            )}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default withMeetingFilter(MeetingsPage);
