import usePersonLearnings from "@/api/usePersonLearnings";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type PersonLearningsProps = {
  personId?: string;
  accordionSelectedValue?: string;
};

const PersonLearnings: FC<PersonLearningsProps> = ({
  personId,
  accordionSelectedValue,
}) => {
  const { learnings } = usePersonLearnings(personId);

  return (
    <DefaultAccordionItem
      value="learnings"
      triggerTitle="Learnings"
      triggerSubTitle={"test"}
      accordionSelectedValue={accordionSelectedValue}
    >
      Implementieren wie bei ProjectActivity. Button click erzeugt einfach eine
      weitere Zeile mit aktuellem Datum. Kann dann easy angepasst werden.
      {learnings?.map((l) => (
        <div key={l.id}>{JSON.stringify(l)}</div>
      ))}
    </DefaultAccordionItem>
  );
};

export default PersonLearnings;
