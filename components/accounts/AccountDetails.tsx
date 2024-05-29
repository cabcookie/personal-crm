import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC } from "react";
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
import { Responsibility } from "./ResponsibilityRecord";
import ResponsibilitiesDialog from "./responsibilities-dialog";

type AccountDetailsProps = {
  account: Account;
  addResponsibility: (resp: Responsibility) => void;
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
      <AddControllerDialog account={account} />
      <div className="mt-8" />

      {accounts &&
        accounts.filter(({ controller }) => controller?.id === account.id)
          .length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <LeanAccordianItem
              title="Responsibilities"
              isVisible={showResponsibilities}
            >
              <ResponsibilitiesList
                responsibilities={account.responsibilities}
                onlyCurrent
              />
              <div className="mt-4" />
              <ResponsibilitiesDialog
                account={account}
                addResponsibility={addResponsibility}
              />
            </LeanAccordianItem>

            <LeanAccordianItem title="Subsidiaries" isVisible={showSubsidaries}>
              <Accordion type="single" collapsible className="w-full">
                <AccountsList
                  accounts={accounts}
                  controllerId={account.id}
                  addResponsibility={addResponsibility}
                />
              </Accordion>
            </LeanAccordianItem>

            <LeanAccordianItem
              title="Introduction"
              isVisible={showIntroduction}
            >
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
              Test
            </LeanAccordianItem>

            <LeanAccordianItem title="Notes" isVisible={showNotes}>
              <AccountNotes accountId={account.id} />
            </LeanAccordianItem>
          </Accordion>
        )}
    </>
  );
};

export default AccountDetails;
