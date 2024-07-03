import { Account } from "@/api/ContextAccounts";
import { FC, useState } from "react";
import { Accordion } from "../ui/accordion";
import AccountRecord from "./account-record";

type AccountsListProps = {
  controllerId?: string;
  accounts: Account[];
  showContacts?: boolean;
  showIntroduction?: boolean;
  showNotes?: boolean;
  showProjects?: boolean;
  showSubsidaries?: boolean;
};

const AccountsList: FC<AccountsListProps> = ({
  accounts,
  controllerId,
  showContacts,
  showIntroduction,
  showNotes,
  showProjects,
  showSubsidaries = true,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    undefined
  );

  return !accounts ? (
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
    <Accordion
      type="single"
      collapsible
      value={selectedAccount}
      onValueChange={(val) =>
        setSelectedAccount(val === selectedAccount ? undefined : val)
      }
    >
      {accounts
        .filter(
          ({ controller }) =>
            !controllerId || (controller && controller.id === controllerId)
        )
        .map((account) => (
          <AccountRecord
            key={account.id}
            account={account}
            selectedAccordionItem={selectedAccount}
            showContacts={showContacts}
            showIntroduction={showIntroduction}
            showNotes={showNotes}
            showProjects={showProjects}
            showSubsidaries={showSubsidaries}
          />
        ))}
    </Accordion>
  );
};

export default AccountsList;
