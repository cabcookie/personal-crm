import useMeetings from "@/api/useMeetings";
import { useContextContext } from "@/contexts/ContextContext";
import { first, flow, identity, split } from "lodash/fp";
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

const getFirstName = flow(identity<string>, split(" "), first);

const CreateOneOnOneMeeting: FC<CreateOneOnOneMeetingProps> = ({
  metaPressed,
  items,
}) => {
  const { context } = useContextContext();
  const { createMeeting, createMeetingParticipant } = useMeetings({ context });

  const handleCreate =
    (personId: string, personName: string, accountNames: string | undefined) =>
    async () => {
      const meetingName = `Meet ${getFirstName(personName)}${
        !accountNames ? "" : `/${getFirstName(accountNames)}`
      }`;
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
        processFn: handleCreate(id, name, accountNames),
      }))}
    />
  );
};

export default CreateOneOnOneMeeting;
