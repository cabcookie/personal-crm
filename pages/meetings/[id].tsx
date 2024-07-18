import useMeeting from "@/api/useMeeting";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingRecord from "@/components/meetings/meeting";
import DeleteWarning from "@/components/ui-elements/project-notes-form/DeleteWarning";
import { debouncedUpdateMeeting } from "@/helpers/meetings";
import { useRouter } from "next/router";
import { useState } from "react";

const MeetingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const meetingId: string | undefined = Array.isArray(id) ? id[0] : id;
  const { meeting, updateMeeting, deleteMeeting } = useMeeting(meetingId);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);

  const handleBackBtnClick = () => {
    router.push("/meetings");
  };

  const saveMeetingTitle = (newTitle: string) => {
    if (!meeting) return;
    if (newTitle.trim() === meeting.topic.trim()) return;
    debouncedUpdateMeeting(meeting, updateMeeting)({ title: newTitle });
  };

  return (
    <MainLayout
      title={meeting?.topic}
      recordName={meeting?.topic}
      sectionName="Meetings"
      onBackBtnClick={handleBackBtnClick}
      saveTitle={saveMeetingTitle}
      addButton={{ label: "Delete", onClick: () => setDeleteWarningOpen(true) }}
    >
      <DeleteWarning
        open={deleteWarningOpen}
        onOpenChange={setDeleteWarningOpen}
        confirmText="Are you sure you want to delete the meeting?"
        onConfirm={deleteMeeting}
      />

      <MeetingRecord
        meeting={meeting}
        addParticipants
        showContext
        showMeetingDate
        addProjects
      />
    </MainLayout>
  );
};

export default MeetingDetailPage;
