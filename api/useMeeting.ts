import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import { emptyDocument } from "@/helpers/ui-notes-writer";
import { generateClient } from "aws-amplify/data";
import { format } from "date-fns";
import { useRouter } from "next/router";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Meeting, mapMeeting, meetingSelectionSet } from "./useMeetings";
const client = generateClient<Schema>();

export type MeetingUpdateProps = {
  meetingOn: Date;
  title: string;
};

const fetchMeeting = (meetingId?: string) => async () => {
  if (!meetingId) return;
  const { data, errors } = await client.models.Meeting.get(
    { id: meetingId },
    { selectionSet: meetingSelectionSet }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading meeting");
    throw errors;
  }
  if (!data) throw new Error("fetchMeeting didn't retrieve data");
  try {
    return mapMeeting(data);
  } catch (error) {
    console.error("fetchMeeting", { error });
    throw error;
  }
};

const useMeeting = (meetingId?: string) => {
  const {
    data: meeting,
    error: errorMeeting,
    isLoading: loadingMeeting,
    mutate: mutateMeeting,
  } = useSWR(`/api/meetings/${meetingId}`, fetchMeeting(meetingId));
  const router = useRouter();

  const updateMeeting = async ({ meetingOn, title }: MeetingUpdateProps) => {
    if (!meeting) return;
    const updated: Meeting = { ...meeting, topic: title, meetingOn };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Meeting.update({
      id: meeting.id,
      topic: title,
      meetingOn: meetingOn.toISOString(),
    });
    if (errors) handleApiErrors(errors, "Error updating the meeting");
    mutateMeeting(updated);
    return data?.id;
  };

  const createMeetingParticipant = async (personId: string) => {
    if (!meeting) return;

    const updated: Meeting = {
      ...meeting,
      participantIds: [...(meeting?.participantIds || []), personId],
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.MeetingParticipant.create({
      personId,
      meetingId: meeting.id,
    });
    if (errors) handleApiErrors(errors, "Error creating meeting participant");
    mutateMeeting(updated);
    return data?.meetingId;
  };

  const getMeetingParticipantId = (personId: string) => {
    if (!meeting) return;
    return meeting.participantMeetingIds[
      meeting.participantIds.findIndex((id) => id === personId)
    ];
  };

  const removeMeetingParticipant = async (personId: string) => {
    if (!meeting) return;
    const updated: Meeting = {
      ...meeting,
      participantIds: meeting.participantIds.filter((id) => id !== personId),
    };
    mutateMeeting(updated, false);
    const meetingParticipantId = getMeetingParticipantId(personId);
    if (!meetingParticipantId) return;
    const { data, errors } = await client.models.MeetingParticipant.delete({
      id: meetingParticipantId,
    });
    if (errors)
      handleApiErrors(errors, "Error deleting entry meeting participant");
    mutateMeeting(updated);
    return data?.id;
  };

  const deleteMeetingActivity = async (activityId: string) => {
    if (!meeting) return;
    const updated: Meeting = {
      ...meeting,
      activities: meeting.activities.filter(
        (activity) => activity.id !== activityId
      ),
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Activity.delete({
      id: activityId,
    });
    if (errors) handleApiErrors(errors, "Deleting activity failed");
    mutateMeeting(updated);
    if (!data) return;
    toast({ title: "Activity deleted" });
    return data.id;
  };

  const createMeetingActivity = async (projectId: string) => {
    if (!meeting) return;
    const { data: activity, errors: errorsActivity } =
      await client.models.Activity.create({
        meetingActivitiesId: meetingId,
        notes: JSON.stringify(emptyDocument),
        formatVersion: 2,
        hasOpenTasks: "false",
        finishedOn: new Date().toISOString(),
      });
    if (errorsActivity)
      return handleApiErrors(
        errorsActivity,
        "Error creating activity for meeting"
      );
    if (!activity)
      return toast({
        title: "Error creating activity",
        description:
          "The API didn't confirm the successful creation of the new activity.",
      });

    const { errors } = await client.models.ProjectActivity.create({
      activityId: activity.id,
      projectsId: projectId,
    });
    if (errors)
      return handleApiErrors(
        errors,
        "Error linking the project to the activity"
      );
    mutateMeeting(meeting);
    return activity.id;
  };

  const updateMeetingContext = async (newContext: Context) => {
    if (!meeting) return;
    const { data, errors } = await client.models.Meeting.update({
      id: meeting.id,
      context: newContext,
    });
    if (errors) {
      handleApiErrors(errors, "Error updating meeting's context");
      return;
    }
    return data?.id;
  };

  const deleteMeeting = async () => {
    if (!meeting) return;
    const { data, errors } = await client.models.Meeting.delete({
      id: meeting.id,
    });
    if (errors) handleApiErrors(errors, "Deleting meeting failed");
    if (data)
      toast({
        title: "Meeting deleted",
        description: `Meeting: ${data.topic} (on ${format(
          data.meetingOn || data.createdAt,
          "PPp"
        )})`,
      });
    router.replace("/meetings");
  };

  return {
    meeting,
    errorMeeting,
    loadingMeeting,
    updateMeeting,
    createMeetingParticipant,
    removeMeetingParticipant,
    createMeetingActivity,
    updateMeetingContext,
    deleteMeetingActivity,
    deleteMeeting,
  };
};

export default useMeeting;
