import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC, useState } from "react";
import CrmLink from "../crm/CrmLink";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { debouncedUpdateAccountDetails } from "../ui-elements/account-details/account-updates-helpers";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import { Accordion } from "../ui/accordion";
import AccountNotes from "./AccountNotes";
import AccountUpdateForm from "./AccountUpdateForm";
import AccountsList from "./AccountsList";
import ListPayerAccounts from "./ListPayerAccounts";
import ListTerritories from "./ListTerritories";
import ProjectList from "./ProjectList";

type AccountDetailsProps = {
  account: Account;
  showSubsidaries?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
  showContacts?: boolean;
  showNotes?: boolean;
};

const AccountDetails: FC<AccountDetailsProps> = ({
  account,
  showContacts,
  showIntroduction,
  showProjects,
  showNotes,
  showSubsidaries = true,
}) => {
  const { accounts, updateAccount, deletePayerAccount } = useAccountsContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const handleUpdateIntroduction = (serializer: () => SerializerOutput) => {
    if (!account) return;
    debouncedUpdateAccountDetails({
      id: account.id,
      serializeIntroduction: serializer,
      updateAccountFn: updateAccount,
    });
  };

  return (
    <div className="cursor-default m-2">
      <div className="flex flex-col gap-1 text-sm mb-2">
        <div className="flex flex-row gap-1 items-center">
          <div>Name:</div>
          <div>{account.name}</div>
          {account.crmId && <CrmLink category="Account" id={account.crmId} />}
        </div>
        {account.controller && (
          <div>{`Parent account: ${account.controller?.name}`}</div>
        )}
        <ListTerritories territoryIds={account.territoryIds} />
        <ListPayerAccounts
          payerAccounts={account.payerAccounts}
          deletePayerAccount={deletePayerAccount}
        />
      </div>
      <AccountUpdateForm
        account={account}
        onUpdate={(props) => updateAccount({ id: account.id, ...props })}
      />

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {accounts && (
          <DefaultAccordionItem
            value="subsidaries"
            triggerTitle="Subsidiaries"
            triggerSubTitle={accounts
              .filter((a) => a.controller?.id === account.id)
              .map((a) => a.name)
              .join(", ")}
            isVisible={!!showSubsidaries}
            accordionSelectedValue={accordionValue}
          >
            <AccountsList
              accounts={accounts}
              controllerId={account.id}
              showContacts={showContacts}
              showIntroduction={showIntroduction}
              showProjects={showProjects}
            />
          </DefaultAccordionItem>
        )}

        <DefaultAccordionItem
          value="introduction"
          triggerTitle="Introduction"
          isVisible={!!showIntroduction}
          accordionSelectedValue={accordionValue}
        >
          <NotesWriter
            notes={account.introduction}
            placeholder="Describe the account..."
            saveNotes={handleUpdateIntroduction}
          />
        </DefaultAccordionItem>

        <DefaultAccordionItem
          value="Projects"
          triggerTitle="Projects"
          isVisible={!!showProjects}
          accordionSelectedValue={accordionValue}
        >
          <ProjectList accountId={account.id} />
        </DefaultAccordionItem>

        <DefaultAccordionItem
          value="Contacts"
          triggerTitle="Contacts"
          isVisible={!!showContacts}
          accordionSelectedValue={accordionValue}
        >
          WORK IN PROGRESS
        </DefaultAccordionItem>

        <DefaultAccordionItem
          value="Notes"
          triggerTitle="Notes"
          isVisible={!!showNotes}
          accordionSelectedValue={accordionValue}
        >
          <AccountNotes accountId={account.id} />
        </DefaultAccordionItem>
      </Accordion>
    </div>
  );
};

export default AccountDetails;
