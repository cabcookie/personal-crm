import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { make2YearsRevenueText } from "@/helpers/projects";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import AccountsList from "./AccountsList";

type SubsidiariesProps = {
  account: Account;
  accounts: Account[] | undefined;
  showSubsidaries?: boolean;
  showContacts?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
};

const Subsidiaries: FC<SubsidiariesProps> = ({
  account,
  accounts,
  showContacts,
  showIntroduction,
  showSubsidaries,
  showProjects,
}) => {
  const { getPipelineByControllerId } = useAccountsContext();

  return (
    accounts && (
      <DefaultAccordionItem
        value="subsidaries"
        triggerTitle="Subsidiaries"
        triggerSubTitle={[
          flow(getPipelineByControllerId, make2YearsRevenueText)(account.id),
          ...flow(
            filter((a: Account) => a.controller?.id === account.id),
            map((a) => a.name)
          )(accounts),
        ]}
        isVisible={!!showSubsidaries}
      >
        <AccountsList
          accounts={accounts}
          controllerId={account.id}
          showContacts={showContacts}
          showIntroduction={showIntroduction}
          showProjects={showProjects}
        />
      </DefaultAccordionItem>
    )
  );
};

export default Subsidiaries;
