import usePeople from "@/api/usePeople";
import { Person, PersonAccount } from "@/api/usePerson";
import { filter, find, flatMap, flow, get } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import PersonDetails from "./PersonDetails";

type PeopleListProps = {
  personIds?: string[];
  showNotes?: boolean;
};

const PeopleList: FC<PeopleListProps> = ({ personIds, showNotes }) => {
  const { people } = usePeople();

  const personName = (person?: Person) =>
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
            find((p: Person) => p.id === personId),
            get("accounts"),
            filter((a: PersonAccount) => a.isCurrent),
            flatMap((a) => [a.position, a.accountName])
          )(people)}
          link={`/people/${personId}`}
        >
          <PersonDetails personId={personId} showNotes={showNotes} />
        </DefaultAccordionItem>
      ))}
    </Accordion>
  );
};

export default PeopleList;
