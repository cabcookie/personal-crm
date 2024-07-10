import { FC, useState } from "react";
import { Accordion } from "../ui/accordion";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import usePeople from "@/api/usePeople";
import PersonDetails from "./PersonDetails";
import { filter, find, flatMap, flow, get } from "lodash/fp";
import { Person, PersonAccount } from "@/api/usePerson";

type PeopleListProps = {
  personIds?: string[];
  showNotes?: boolean;
};

const PeopleList: FC<PeopleListProps> = ({ personIds, showNotes }) => {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );
  const { people } = usePeople();

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={(val) =>
        setAccordionValue(val === accordionValue ? undefined : val)
      }
    >
      {personIds?.map((personId) => (
        <DefaultAccordionItem
          key={personId}
          value={personId}
          triggerTitle={people?.find((p) => p.id === personId)?.name}
          triggerSubTitle={flow(
            find((p: Person) => p.id === personId),
            get("accounts"),
            filter((a: PersonAccount) => a.isCurrent),
            flatMap((a) => [a.position, a.accountName])
          )(people)}
        >
          <PersonDetails personId={personId} showNotes={showNotes} />
        </DefaultAccordionItem>
      ))}
    </Accordion>
  );
};

export default PeopleList;
