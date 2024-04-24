import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { Meeting, mapMeeting, meetingSelectionSet } from "./useMeetings";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type MeetingUpdateProps = {
  meetingId: string;
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
  return mapMeeting(data);
};

const useMeeting = (meetingId?: string) => {
  const {
    data: meeting,
    error: errorMeeting,
    isLoading: loadingMeeting,
    mutate: mutateMeeting,
  } = useSWR(`/api/meetings/${meetingId}`, fetchMeeting(meetingId));

  const updateMeeting = async ({
    meetingId,
    meetingOn,
    title,
  }: MeetingUpdateProps) => {
    const updated: Meeting = {
      id: meetingId,
      topic: title,
      meetingOn,
      participantIds: [],
      activityIds: [],
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Meeting.update({
      id: meetingId,
      topic: title,
      meetingOn: meetingOn.toISOString(),
    });
    if (errors) handleApiErrors(errors, "Error updating the meeting");
    mutateMeeting(updated);
    return data.id;
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
    return data.meetingId;
  };

  const createMeetingActivity = async (activityId: string, notes?: string) => {
    if (!meeting) return;
    const updated: Meeting = {
      ...meeting,
      activityIds: [...meeting.activityIds, activityId],
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Activity.create({
      meetingActivitiesId: meetingId,
      notes,
    });
    if (errors) handleApiErrors(errors, "Error creating activity for meeting");
    mutateMeeting(updated);
    return data.id;
  };

  return {
    meeting,
    errorMeeting,
    loadingMeeting,
    updateMeeting,
    createMeetingParticipant,
    createMeetingActivity,
  };
};

export default useMeeting;
