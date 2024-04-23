import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import useSWR from "swr";
const client = generateClient<Schema>();

export type MeetingParticipant = {
  personId: string | undefined;
};

const mapMeetingParticipant = ({
  personId,
}: Schema["MeetingParticipant"]): MeetingParticipant => ({
  personId,
});

const fetchMeetingParticipants = (meetingId?: string) => async () => {
  if (!meetingId) return;
  const { data, errors } = await client.models.MeetingParticipant.list({
    filter: { meetingId: { eq: meetingId } },
  });
  if (errors) throw errors;
  return data.map(mapMeetingParticipant);
};

const useMeetingParticipants = (meetingId?: string) => {
  const {
    data: meetingParticipants,
    error: errorMeetingParticipants,
    isLoading: loadingMeetingParticipants,
    mutate: mutateMeetingParticipants,
  } = useSWR(
    `/api/meeting/${meetingId}/participants`,
    fetchMeetingParticipants(meetingId)
  );

  const createMeetingParticipant = async (
    personId: string,
    meetingId?: string
  ) => {
    if (!meetingId) return;
    const newMp: MeetingParticipant = { personId };
    const updated = [...(meetingParticipants || []), newMp];
    mutateMeetingParticipants(updated, false);
    const { data, errors } = await client.models.MeetingParticipant.create({
      personId,
      meetingId,
    });
    if (errors) handleApiErrors(errors, "Error creating meeting participant");
    mutateMeetingParticipants(updated);
    return data.meetingId;
  };

  return {
    meetingParticipants,
    errorMeetingParticipants,
    loadingMeetingParticipants,
    createMeetingParticipant,
  };
};

export default useMeetingParticipants;
