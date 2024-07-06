import usePeople from "@/api/usePeople";
import { FC } from "react";
import PersonDetails from "../people/PersonDetails";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type MeetingParticipantsProps = {
  participantIds: string[];
  accordionSelectedValue?: string;
};

const MeetingParticipants: FC<MeetingParticipantsProps> = ({
  accordionSelectedValue,
  participantIds,
}) => {
  const { getNamesByIds } = usePeople();

  return (
    participantIds.length > 0 && (
      <DefaultAccordionItem
        value="participants"
        triggerTitle="Participants"
        triggerSubTitle={getNamesByIds(participantIds)}
        accordionSelectedValue={accordionSelectedValue}
      >
        {participantIds?.map((personId) => (
          <PersonDetails personId={personId} key={personId} showNotes={false} />
        ))}
      </DefaultAccordionItem>
    )
  );
};

export default MeetingParticipants;
