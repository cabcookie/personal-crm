import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC } from "react";
import CrmLink from "../crm/CrmLink";
import { Accordion } from "../ui/accordion";
import AccountFinancials from "./AccountFinancials";
import AccountIntroduction from "./AccountIntroduction";
import AccountLearnings from "./AccountLearnings";
import AccountNotes from "./AccountNotes";
import AccountPayerAccounts from "./AccountPayerAccounts";
import AccountPeople from "./AccountPeople";
import AccountProjects from "./AccountProjects";
import AccountTerritories from "./AccountTerritories";
import AccountUpdateForm from "./AccountUpdateForm";
import ResellerFinancials from "./ResellerFinancials";
import Subsidiaries from "./Subsidaries";
import { ExportButton } from "@/components/exports/ExportButton";

type AccountDetailsProps = {
  account: Account;
  showSubsidaries?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
  showContacts?: boolean;
  showAwsAccounts?: boolean;
  showFinancials?: boolean;
  showTerritories?: boolean;
  showResellerFinancials?: boolean;
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
  showFinancials,
  showTerritories,
  showResellerFinancials,
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

        <ExportButton
          dataSource="account"
          itemId={account.id}
          itemName={account.name}
          presets={[30, 180, 360]}
        />
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
        <AccountLearnings accountId={account.id} />
        <AccountProjects {...{ account, showProjects }} />
        <AccountPeople accountId={account.id} isVisible={!!showContacts} />
        <AccountNotes accountId={account.id} />
        <AccountPayerAccounts {...{ account, showAwsAccounts }} />
        <AccountTerritories {...{ account, showTerritories }} />
        <AccountFinancials {...{ account, showFinancials }} />
        <ResellerFinancials {...{ account, showResellerFinancials }} />
      </Accordion>
    </>
  );
};

export default AccountDetails;
