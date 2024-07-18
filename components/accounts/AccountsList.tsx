import { Account } from "@/api/ContextAccounts";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import AccountRecord from "./account-record";

type AccountsListProps = {
  controllerId?: string;
  accounts: Account[];
  showContacts?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
  showSubsidaries?: boolean;
};

const AccountsList: FC<AccountsListProps> = ({
  accounts,
  controllerId,
  showContacts,
  showIntroduction,
  showProjects,
  showSubsidaries = true,
}) =>
  !accounts ? (
    "Loading accounts…"
  ) : accounts.filter(
      ({ controller }) =>
        !controllerId || (controller && controller.id === controllerId)
    ).length === 0 ? (
    !controllerId ? (
      "No accounts"
    ) : (
      "No subsidiaries"
    )
  ) : (
    <Accordion type="single" collapsible>
      {accounts
        .filter(
          ({ controller }) =>
            !controllerId || (controller && controller.id === controllerId)
        )
        .map((account) => (
          <AccountRecord
            key={account.id}
            account={account}
            showContacts={showContacts}
            showIntroduction={showIntroduction}
            showProjects={showProjects}
            showSubsidaries={showSubsidaries}
          />
        ))}
    </Accordion>
  );

export default AccountsList;
