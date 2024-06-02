import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC, useState } from "react";
import { debouncedUpdateAccountDetails } from "../ui-elements/account-details/account-updates-helpers";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import { Accordion } from "../ui/accordion";
import AccountNotes from "./AccountNotes";
import AccountsList from "./AccountsList";
import AddControllerDialog from "./AddControllerDialog";
import LeanAccordianItem from "./LeanAccordionItem";
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
        <LeanAccordianItem
          title="Responsibilities"
          isVisible={showResponsibilities}
        >
          <ResponsibilitiesList responsibilities={account.responsibilities} />
          <div className="mt-4" />
          <ResponsibilitiesDialog
            account={account}
            addResponsibility={addResponsibility}
          />
        </LeanAccordianItem>

        {accounts && (
          <LeanAccordianItem title="Subsidiaries" isVisible={showSubsidaries}>
            <Accordion type="single" collapsible>
              <AccountsList
                accounts={accounts}
                controllerId={account.id}
                addResponsibility={addResponsibility}
              />
            </Accordion>
          </LeanAccordianItem>
        )}

        <LeanAccordianItem title="Introduction" isVisible={showIntroduction}>
          <NotesWriter
            notes={account.introduction}
            placeholder="Describe the account..."
            saveNotes={handleUpdateIntroduction}
          />
        </LeanAccordianItem>

        <LeanAccordianItem title="Projects" isVisible={showProjects}>
          <ProjectList accountId={account.id} />
        </LeanAccordianItem>

        <LeanAccordianItem title="Contacts" isVisible={showContacts}>
          WORK IN PROGRESS
        </LeanAccordianItem>

        <LeanAccordianItem title="Notes" isVisible={showNotes}>
          <AccountNotes accountId={account.id} />
        </LeanAccordianItem>
      </Accordion>
    </>
  );
};

export default AccountDetails;
