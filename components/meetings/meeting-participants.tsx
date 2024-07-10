import usePeople from "@/api/usePeople";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import PeopleList from "../people/PeopleList";

type MeetingParticipantsProps = {
  participantIds: string[];
  accordionSelectedValue?: string;
  addParticipant?: (personId: string | null) => void;
};

const MeetingParticipants: FC<MeetingParticipantsProps> = ({
  accordionSelectedValue,
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
        accordionSelectedValue={accordionSelectedValue}
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
