import useAccountPeople from "@/api/useAccountPeople";
import { map } from "lodash";
import { FC } from "react";
import PeopleList from "../people/PeopleList";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type AccountPeopleProps = {
  accountId: string;
  isVisible?: boolean;
};

const AccountPeople: FC<AccountPeopleProps> = ({
  accountId,
  isVisible = true,
}) => {
  const { people } = useAccountPeople(accountId);

  return (
    <DefaultAccordionItem
      value="Contacts"
      triggerTitle="Contacts"
      triggerSubTitle={map(people, "name")}
      isVisible={isVisible}
    >
      <PeopleList personIds={people?.map((p) => p.id)} />
    </DefaultAccordionItem>
  );
};

export default AccountPeople;
