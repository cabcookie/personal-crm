import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { Meeting, mapMeeting, meetingSelectionSet } from "./useMeetings";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type Person = {
  id: string;
  name: string;
};

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
  } = useSWR(`/api/meeting/${meetingId}`, fetchMeeting(meetingId));

  const updateMeeting = async ({
    meetingId,
    meetingOn,
    title,
  }: MeetingUpdateProps) => {
    const updated: Meeting = {
      id: meetingId,
      topic: title,
      meetingOn,
      participants: [],
      activities: [],
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

  const createMeetingParticipant = async (person: Person) => {
    if (!meeting) return;
    const updated: Meeting = {
      ...meeting,
      participants: [...(meeting?.participants || []), person],
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.MeetingParticipant.create({
      personId: person.id,
      meetingId,
    });
    if (errors) handleApiErrors(errors, "Error creating meeting participant");
    mutateMeeting(updated);
    return data.meetingId;
  };

  const updateActivityNotes = async (notes: string, activityId: string) => {
    if (!meeting) return;
    const updated: Meeting = {
      ...meeting,
      activities: meeting.activities.map((activity) =>
        activity.id !== activityId ? activity : { ...activity, notes }
      ),
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activityId,
      notes,
    });
    if (errors) handleApiErrors(errors, "Error updating activity notes");
    mutateMeeting(updated);
    return data.id;
  };

  const createMeetingActivity = async (activityId: string, notes?: string) => {
    if (!meeting) return;
    const newActivity = {
      id: activityId,
      notes: notes || "",
      finishedOn: new Date(),
      updatedAt: new Date(),
      projectIds: [],
    };
    const updated: Meeting = {
      ...meeting,
      activities: [...meeting.activities, newActivity],
    };
    mutateMeeting(updated, false);
    const { data, errors } = await client.models.Activity.create({
      id: activityId,
      meetingActivitiesId: meetingId,
      notes,
    });
    if (errors) handleApiErrors(errors, "Error creating activity for meeting");
    mutateMeeting(updated);
    return data.id;
  };

  const addProjectToActivity = async (
    projectId: string,
    activityId: string
  ) => {
    if (!meeting) return;
    if (!activityId) return;

    const updated: Meeting = {
      ...meeting,
      activities: meeting.activities.map((a) =>
        a.id !== activityId
          ? a
          : { ...a, projectIds: [...a.projectIds, projectId] }
      ),
    };
    mutateMeeting(updated, false);
    const { errors } = await client.models.ProjectActivity.create({
      activityId,
      projectsId: projectId,
    });
    if (errors)
      handleApiErrors(errors, "Error adding a project to an activity");
    mutateMeeting(updated);
  };

  return {
    meeting,
    errorMeeting,
    loadingMeeting,
    updateMeeting,
    createMeetingParticipant,
    createMeetingActivity,
    updateActivityNotes,
    addProjectToActivity,
  };
};

export default useMeeting;
