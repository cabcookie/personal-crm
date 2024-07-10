import useMeeting from "@/api/useMeeting";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingRecord from "@/components/meetings/meeting";
import ProjectNotesForm from "@/components/ui-elements/project-notes-form/project-notes-form";
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
      title={meeting?.topic || "Loading..."}
      recordName={meeting?.topic}
      sectionName="Meetings"
      onBackBtnClick={handleBackBtnClick}
      saveTitle={saveMeetingTitle}
    >
      {!meeting ? (
        "Load meeting..."
      ) : (
        <div className="space-y-6">
          <MeetingRecord
            meeting={meeting}
            addParticipants
            showContext
            showMeetingDate
            addProjects
            hideNotes
          />

          <h3 className="mx-2 md:mx-4 font-semibold tracking-tight">
            Meeting notes
          </h3>
          {meeting.activities.map((a) => (
            <ProjectNotesForm key={a.id} activityId={a.id} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default MeetingDetailPage;
