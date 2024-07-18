import usePeople from "@/api/usePeople";
import { FC } from "react";
import PeopleList from "../people/PeopleList";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import PeopleSelector from "../ui-elements/selectors/people-selector";

type MeetingParticipantsProps = {
  participantIds: string[];
  addParticipant?: (personId: string | null) => void;
};

const MeetingParticipants: FC<MeetingParticipantsProps> = ({
  participantIds,
  addParticipant,
}) => {
  const { getNamesByIds } = usePeople();

  return (
    participantIds.length > 0 && (
      <DefaultAccordionItem
        value="participants"
        triggerTitle="Participants"
        triggerSubTitle={getNamesByIds(participantIds)}
      >
        {addParticipant && (
          <PeopleSelector
            placeholder="Add participant…"
            value=""
            onChange={addParticipant}
            allowNewPerson
          />
        )}
        <div className="my-2" />

        <PeopleList personIds={participantIds} showNotes={false} />
      </DefaultAccordionItem>
    )
  );
};

export default MeetingParticipants;
