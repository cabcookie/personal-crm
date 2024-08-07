import { Account, useAccountsContext } from "@/api/ContextAccounts";
import useTerritories, { Territory } from "@/api/useTerritories";
import { formatRevenue } from "@/helpers/functional";
import { make2YearsRevenueText } from "@/helpers/projects";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import AccountDetails from "./AccountDetails";

type AccountRecordProps = {
  account: Account;
  selectedAccordionItem?: string;
  showContacts?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
  showSubsidaries?: boolean;
};

const AccountRecord: FC<AccountRecordProps> = ({
  account,
  showContacts,
  showIntroduction,
  showProjects,
  showSubsidaries = true,
}) => {
  const { territories } = useTerritories();
  const { accounts } = useAccountsContext();

  return (
    <DefaultAccordionItem
      value={account.id}
      triggerTitle={account.name}
      triggerSubTitle={[
        account.pipeline > 0 && make2YearsRevenueText(account.pipeline),
        account.latestQuota > 0 &&
          `Quota: ${formatRevenue(account.latestQuota)}`,
        !account.controller ? "" : `Parent: ${account.controller.name}`,
        ...flow(
          filter((t: Territory) => account.territoryIds.includes(t.id)),
          map((t) => t.name)
        )(territories),
        ...flow(
          filter((a: Account) => account.id === a.controller?.id),
          map((a) => a.name)
        )(accounts),
      ]}
      link={`/accounts/${account.id}`}
    >
      <AccountDetails
        account={account}
        showContacts={showContacts}
        showIntroduction={showIntroduction}
        showProjects={showProjects}
        showSubsidaries={showSubsidaries}
      />
    </DefaultAccordionItem>
  );
};

export default AccountRecord;
