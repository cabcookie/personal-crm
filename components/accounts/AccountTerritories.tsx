import { Account } from "@/api/ContextAccounts";
import useTerritories, { Territory } from "@/api/useTerritories";
import { formatRevenue } from "@/helpers/functional";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ListTerritories from "./ListTerritories";

type AccountTerritoriesProps = {
  account: Account;
  showTerritories?: boolean;
};

const AccountTerritories: FC<AccountTerritoriesProps> = ({
  account,
  showTerritories,
}) => {
  const { territories } = useTerritories();

  return (
    <DefaultAccordionItem
      value="territories"
      triggerTitle="Territories"
      triggerSubTitle={[
        account.latestQuota > 0 &&
          `Quota: ${formatRevenue(account.latestQuota)}`,
        ...flow(
          filter((t: Territory) => account.territoryIds.includes(t.id)),
          map("name")
        )(territories),
      ]}
      isVisible={!!showTerritories && account.territoryIds.length > 0}
    >
      <ListTerritories territoryIds={account.territoryIds} />
    </DefaultAccordionItem>
  );
};

export default AccountTerritories;
