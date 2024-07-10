import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import useAccountPeople from "@/api/useAccountPeople";
import PeopleList from "../people/PeopleList";

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

  return (
    <DefaultAccordionItem
      value="Contacts"
      triggerTitle="Contacts"
      triggerSubTitle={people?.map((p) => p.name)}
      isVisible={isVisible}
      accordionSelectedValue={accordionSelectedValue}
    >
      <PeopleList personIds={people?.map((p) => p.id)} />
    </DefaultAccordionItem>
  );
};

export default AccountPeople;
