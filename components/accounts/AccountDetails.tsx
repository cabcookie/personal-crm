import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { make2YearsRevenueText } from "@/helpers/projects";
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
    <>
      <AccountUpdateForm
        account={account}
        onUpdate={(props) => updateAccount({ id: account.id, ...props })}
      />
      <div>
        Name: {account.name}{" "}
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
          triggerSubTitle={
            account.pipeline === 0
              ? ""
              : make2YearsRevenueText(account.pipeline)
          }
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
    </>
  );
};

export default AccountDetails;
