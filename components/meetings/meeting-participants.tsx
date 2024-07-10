import usePeople from "@/api/usePeople";
import { FC, useState } from "react";
import PersonDetails from "../people/PersonDetails";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import PeopleSelector from "../ui-elements/selectors/people-selector";

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
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

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

        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          {participantIds?.map((personId) => (
            <PersonDetails
              personId={personId}
              key={personId}
              showNotes={false}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default MeetingParticipants;
