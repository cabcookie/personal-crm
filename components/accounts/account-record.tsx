import { Account, useAccountsContext } from "@/api/ContextAccounts";
import useTerritories from "@/api/useTerritories";
import { calcAccountAndSubsidariesPipeline } from "@/helpers/accounts";
import { formatRevenue } from "@/helpers/functional";
import { make2YearsRevenueText } from "@/helpers/projects";
import { flow } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import AccountDetails from "./AccountDetails";

type AccountRecordProps = {
  account: Account;
  selectedAccordionItem?: string;
  showContacts?: boolean;
  showIntroduction?: boolean;
  showNotes?: boolean;
  showProjects?: boolean;
  showSubsidaries?: boolean;
};

const AccountRecord: FC<AccountRecordProps> = ({
  account,
  selectedAccordionItem,
  showContacts,
  showIntroduction,
  showNotes,
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
        !accounts
          ? ""
          : flow(
              calcAccountAndSubsidariesPipeline(accounts),
              make2YearsRevenueText
            )(account),
        ...(territories
          ?.filter((t) => account.territoryIds.includes(t.id))
          .map(
            (t): string =>
              `${t.name}${
                t.latestQuota === 0 ? "" : ` (${formatRevenue(t.latestQuota)})`
              }`
          ) || []),
        ...(accounts
          ?.filter((a) => account.id === a.controller?.id)
          .map((a) => a.name) || []),
      ]
        .filter((t) => t !== "")
        .join(", ")}
      link={`/accounts/${account.id}`}
      accordionSelectedValue={selectedAccordionItem}
    >
      <AccountDetails
        account={account}
        showContacts={showContacts}
        showIntroduction={showIntroduction}
        showNotes={showNotes}
        showProjects={showProjects}
        showSubsidaries={showSubsidaries}
      />
    </DefaultAccordionItem>
  );
};

export default AccountRecord;
