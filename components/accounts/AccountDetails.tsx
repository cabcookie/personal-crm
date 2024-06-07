import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { debouncedUpdateAccountDetails } from "../ui-elements/account-details/account-updates-helpers";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import { Accordion } from "../ui/accordion";
import AccountNotes from "./AccountNotes";
import AccountsList from "./AccountsList";
import AddControllerDialog from "./AddControllerDialog";
import ProjectList from "./ProjectList";
import ResponsibilitiesList from "./ResponsibilitiesList";
import ResponsibilitiesDialog from "./responsibilities-dialog";

type AccountDetailsProps = {
  account: Account;
  addResponsibility: (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => void;
  showResponsibilities?: boolean;
  showSubsidaries?: boolean;
  showIntroduction?: boolean;
  showProjects?: boolean;
  showContacts?: boolean;
  showNotes?: boolean;
};

const AccountDetails: FC<AccountDetailsProps> = ({
  account,
  addResponsibility,
  showContacts,
  showIntroduction,
  showProjects,
  showNotes,
  showResponsibilities = true,
  showSubsidaries = true,
}) => {
  const { accounts, updateAccount } = useAccountsContext();
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
      <div className="px-4">
        <AddControllerDialog account={account} />
      </div>
      <div className="mt-8" />

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        <DefaultAccordionItem
          value="responsibilities"
          triggerTitle="Responsibilities"
          isVisible={!!showResponsibilities}
          accordionSelectedValue={accordionValue}
        >
          <ResponsibilitiesList responsibilities={account.responsibilities} />
          <div className="mt-4" />
          <ResponsibilitiesDialog
            account={account}
            addResponsibility={addResponsibility}
          />
        </DefaultAccordionItem>

        {accounts && (
          <DefaultAccordionItem
            value="subsidaries"
            triggerTitle="Subsidiaries"
            isVisible={!!showSubsidaries}
            accordionSelectedValue={accordionValue}
          >
            <Accordion type="single" collapsible>
              <AccountsList
                accounts={accounts}
                controllerId={account.id}
                addResponsibility={addResponsibility}
              />
            </Accordion>
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
    </>
  );
};

export default AccountDetails;
