import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import useAccountPeople from "@/api/useAccountPeople";
import { Accordion } from "../ui/accordion";
import PersonDetails from "../people/PersonDetails";

type AccountPeopleProps = {
  accountId: string;
  isVisible?: boolean;
  accordionSelectedValue?: string;
};

const AccountPeople: FC<AccountPeopleProps> = ({
  accountId,
  accordionSelectedValue,
  isVisible = true,
}) => {
  const { people } = useAccountPeople(accountId);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return (
    <DefaultAccordionItem
      value="Contacts"
      triggerTitle="Contacts"
      triggerSubTitle={people?.map((p) => p.name)}
      isVisible={isVisible}
      accordionSelectedValue={accordionSelectedValue}
    >
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {people?.map(({ id: personId }) => (
          <PersonDetails personId={personId} key={personId} />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default AccountPeople;
