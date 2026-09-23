import usePeople, { LeanPerson } from "@/api/usePeople";
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
  const { getPeopleByIds } = usePeople();

  // Resolve from the cache; any id not yet loaded is fetched on demand and the
  // component re-renders once it lands (so a person is never invisible here).
  const resolved = getPeopleByIds(personIds);
  const byId = new Map(resolved.map((p) => [p.id, p]));

  const personName = (person?: LeanPerson) =>
    !person
      ? ""
      : `${person.name}${!person.howToSay ? "" : ` (say: ${person.howToSay})`}`;

  return (
    <Accordion type="single" collapsible>
      {personIds?.map((personId) => {
        const person = byId.get(personId);
        return (
          <DefaultAccordionItem
            key={personId}
            value={personId}
            triggerTitle={personName(person)}
            triggerSubTitle={person?.accountNames}
            onDelete={!onDelete ? undefined : () => onDelete(personId)}
            link={`/people/${personId}`}
          >
            <PersonDetails personId={personId} showNotes={showNotes} />
          </DefaultAccordionItem>
        );
      })}
    </Accordion>
  );
};

export default PeopleList;
