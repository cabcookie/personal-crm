import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC } from "react";
import CrmLink from "../crm/CrmLink";
import { Accordion } from "../ui/accordion";
import AccountIntroduction from "./AccountIntroduction";
import AccountNotes from "./AccountNotes";
import AccountPayerAccounts from "./AccountPayerAccounts";
import AccountPeople from "./AccountPeople";
import AccountProjects from "./AccountProjects";
import AccountTerritories from "./AccountTerritories";
import AccountUpdateForm from "./AccountUpdateForm";
import Subsidiaries from "./Subsidaries";

type AccountDetailsProps = {
  account: Account;
  showSubsidaries?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
  showContacts?: boolean;
  showAwsAccounts?: boolean;
  showTerritories?: boolean;
  updateFormControl?: {
    open: boolean;
    setOpen: (val: boolean) => void;
  };
};

const AccountDetails: FC<AccountDetailsProps> = ({
  account,
  showContacts,
  showIntroduction,
  showProjects,
  updateFormControl,
  showAwsAccounts,
  showTerritories,
  showSubsidaries = true,
}) => {
  const { accounts, updateAccount } = useAccountsContext();

  return (
    <>
      <div className="ml-2">
        <AccountUpdateForm
          account={account}
          onUpdate={(props) => updateAccount({ id: account.id, ...props })}
          formControl={updateFormControl}
        />
        {account.crmId && (
          <CrmLink
            category="Account"
            id={account.crmId}
            className="font-semibold"
          />
        )}
      </div>

      <Accordion type="single" collapsible>
        <Subsidiaries
          {...{
            account,
            accounts,
            showContacts,
            showIntroduction,
            showSubsidaries,
            showProjects,
          }}
        />

        <AccountIntroduction {...{ account, showIntroduction }} />
        <AccountProjects {...{ account, showProjects }} />
        <AccountPeople accountId={account.id} isVisible={!!showContacts} />
        <AccountNotes accountId={account.id} />
        <AccountPayerAccounts {...{ account, showAwsAccounts }} />
        <AccountTerritories {...{ account, showTerritories }} />
      </Accordion>
    </>
  );
};

export default AccountDetails;
