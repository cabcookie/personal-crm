import useMeetings from "@/api/useMeetings";
import { useContextContext } from "@/contexts/ContextContext";
import { createMeetingName } from "@/helpers/meetings";
import { FC } from "react";
import SearchableDataGroup from "./SearchableDataGroup";

type CreateOneOnOneMeetingProps = {
  metaPressed?: boolean;
  items?: {
    id: string;
    name: string;
    accountNames?: string;
  }[];
};

const CreateOneOnOneMeeting: FC<CreateOneOnOneMeetingProps> = ({
  metaPressed,
  items,
}) => {
  const { context } = useContextContext();
  const { createMeeting, createMeetingParticipant } = useMeetings({ context });

  const handleCreate = (personId: string) => async () => {
    const meetingName = createMeetingName({
      // Resolve the name from the items shown in the palette (recent + search
      // matches), not a full in-memory people list.
      people: items,
      participantId: personId,
    });
    if (!meetingName) return;
    const meetingId = await createMeeting(meetingName, context);
    if (!meetingId) return;
    await createMeetingParticipant(meetingId, personId);
    return meetingId;
  };

  return (
    <SearchableDataGroup
      heading="Start meeting…"
      metaPressed={metaPressed}
      items={items?.map(({ id, name, accountNames }) => ({
        id,
        value: `…with ${name}${!accountNames ? "" : ` (${accountNames})`}`,
        link: "/meetings",
        processFn: handleCreate(id),
      }))}
    />
  );
};

export default CreateOneOnOneMeeting;
