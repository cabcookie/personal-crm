import usePeople, { LeanPerson } from "@/api/usePeople";
import { find, flow, get } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import PersonDetails from "./PersonDetails";

type PeopleListProps = {
  personIds?: string[];
  showNotes?: boolean;
  onDelete?: (personId: string) => void;
};

const PeopleList: FC<PeopleListProps> = ({
  personIds,
  showNotes,
  onDelete,
}) => {
  const { people } = usePeople();

  const personName = (person?: LeanPerson) =>
    !person
      ? ""
      : `${person.name}${!person.howToSay ? "" : ` (say: ${person.howToSay})`}`;

  return (
    <Accordion type="single" collapsible>
      {personIds?.map((personId) => (
        <DefaultAccordionItem
          key={personId}
          value={personId}
          triggerTitle={personName(people?.find((p) => p.id === personId))}
          triggerSubTitle={flow(
            find((p: LeanPerson) => p.id === personId),
            get("accountNames")
          )(people)}
          onDelete={!onDelete ? undefined : () => onDelete(personId)}
          link={`/people/${personId}`}
        >
          <PersonDetails personId={personId} showNotes={showNotes} />
        </DefaultAccordionItem>
      ))}
    </Accordion>
  );
};

export default PeopleList;
