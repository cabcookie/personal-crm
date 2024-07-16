import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import { emptyDocument } from "@/helpers/ui-notes-writer";
import { generateClient } from "aws-amplify/data";
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
  if (errors) throw errors;
  if (!data) throw new Error("fetchMeeting didn't retrieve data");
  return mapMeeting(data);
};

const useMeeting = (meetingId?: string) => {
  const {
    data: meeting,
    error: errorMeeting,
    isLoading: loadingMeeting,
    mutate: mutateMeeting,
  } = useSWR(`/api/meetings/${meetingId}`, fetchMeeting(meetingId));

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

  const createMeetingActivity = async (projectId: string) => {
    if (!meeting) return;
    const { data: activity, errors: errorsActivity } =
      await client.models.Activity.create({
        meetingActivitiesId: meetingId,
        notes: JSON.stringify(emptyDocument),
        formatVersion: 2,
        hasOpenTasks: "false",
        openTasks: JSON.stringify([]),
        closedTasks: JSON.stringify([]),
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

  return {
    meeting,
    errorMeeting,
    loadingMeeting,
    updateMeeting,
    createMeetingParticipant,
    createMeetingActivity,
    updateMeetingContext,
  };
};

export default useMeeting;
