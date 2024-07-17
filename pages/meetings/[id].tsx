import useMeeting from "@/api/useMeeting";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingRecord from "@/components/meetings/meeting";
import { debouncedUpdateMeeting } from "@/helpers/meetings";
import { useRouter } from "next/router";

const MeetingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const meetingId: string | undefined = Array.isArray(id) ? id[0] : id;
  const { meeting, updateMeeting } = useMeeting(meetingId);

  const handleBackBtnClick = () => {
    router.replace("/meetings");
  };

  const saveMeetingTitle = (newTitle: string) => {
    if (!meeting) return;
    if (newTitle.trim() === meeting.topic.trim()) return;
    debouncedUpdateMeeting(meeting, updateMeeting)({ title: newTitle });
  };

  return (
    <MainLayout
      title={meeting?.topic || "Loading meeting..."}
      recordName={meeting?.topic}
      sectionName="Meetings"
      onBackBtnClick={handleBackBtnClick}
      saveTitle={saveMeetingTitle}
    >
      {!meeting ? (
        "Load meeting..."
      ) : (
        <MeetingRecord
          meeting={meeting}
          addParticipants
          showContext
          showMeetingDate
          addProjects
        />
      )}
    </MainLayout>
  );
};

export default MeetingDetailPage;
