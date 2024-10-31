import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import useTerritories, { Territory } from "@/api/useTerritories";
import { formatRevenue } from "@/helpers/functional";
import {
  calcPipelineByAccountId,
  make2YearsRevenueText,
} from "@/helpers/projects";
import { Editor } from "@tiptap/core";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import CrmLink from "../crm/CrmLink";
import { ProjectFilterProvider } from "../projects/useProjectFilter";
import { SearchProvider } from "../search/useSearch";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { debouncedUpdateAccountDetails } from "../ui-elements/account-details/account-updates-helpers";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { Accordion } from "../ui/accordion";
import AccountNotes from "./AccountNotes";
import AccountPeople from "./AccountPeople";
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
  const {
    accounts,
    updateAccount,
    deletePayerAccount,
    getPipelineByControllerId,
  } = useAccountsContext();
  const { territories } = useTerritories();
  const { projects } = useProjectsContext();

  const handleUpdateIntroduction = (editor: Editor) => {
    if (!account) return;
    debouncedUpdateAccountDetails({
      id: account.id,
      editor,
      updateAccountFn: updateAccount,
    });
  };

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
        {accounts && (
          <DefaultAccordionItem
            value="subsidaries"
            triggerTitle="Subsidiaries"
            triggerSubTitle={[
              flow(
                getPipelineByControllerId,
                make2YearsRevenueText
              )(account.id),
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
        )}

        <DefaultAccordionItem
          value="introduction"
          triggerTitle="Introduction"
          isVisible={!!showIntroduction}
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
          triggerSubTitle={flow(
            calcPipelineByAccountId(account.id),
            make2YearsRevenueText
          )(projects)}
          isVisible={!!showProjects}
        >
          <SearchProvider>
            <ProjectFilterProvider accountId={account.id}>
              <ProjectList />
            </ProjectFilterProvider>
          </SearchProvider>
        </DefaultAccordionItem>

        <AccountPeople accountId={account.id} isVisible={!!showContacts} />

        <AccountNotes accountId={account.id} />

        <DefaultAccordionItem
          value="aws-accounts"
          triggerTitle="AWS Payer Accounts"
          triggerSubTitle={account.payerAccounts}
          isVisible={!!showAwsAccounts && account.payerAccounts.length > 0}
        >
          <ListPayerAccounts
            payerAccounts={account.payerAccounts}
            deletePayerAccount={deletePayerAccount}
            allowDeletion
            showLabel={false}
          />
        </DefaultAccordionItem>

        <DefaultAccordionItem
          value="territories"
          triggerTitle="Territories"
          triggerSubTitle={[
            account.latestQuota > 0 &&
              `Quota: ${formatRevenue(account.latestQuota)}`,
            ...flow(
              filter((t: Territory) => account.territoryIds.includes(t.id)),
              map("name")
            )(territories),
          ]}
          isVisible={!!showTerritories && account.territoryIds.length > 0}
        >
          <ListTerritories territoryIds={account.territoryIds} />
        </DefaultAccordionItem>
      </Accordion>
    </>
  );
};

export default AccountDetails;
