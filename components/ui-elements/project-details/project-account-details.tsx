import { useAccountsContext } from "@/api/ContextAccounts";
import { useContextContext } from "@/contexts/ContextContext";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import AccountSelector from "../selectors/account-selector";

type AccountNameProps = {
  accountId: string;
  accountName?: string;
  removeAccount?: (accountId: string, accountName: string) => void;
};

const AccountName: FC<AccountNameProps> = ({
  accountId,
  accountName,
  removeAccount,
}) => (
  <div className="flex flex-row gap-2 items-center">
    <Link href={`/accounts/${accountId}`} className="hover:underline">
      {accountName}
    </Link>
    {removeAccount && accountName && (
      <Trash2
        className="h-4 w-4 text-muted-foreground hover:text-primary"
        onClick={() => removeAccount(accountId, accountName)}
      />
    )}
  </div>
);

type ProjectAccountDetailsProps = {
  isVisible?: boolean;
  accordionSelectedValue?: string;
  accoundIds: string[];
  onRemoveAccount: (accountId: string, accountName: string) => void;
  onAddAccount: (accountId: string | null) => void;
};

const ProjectAccountDetails: FC<ProjectAccountDetailsProps> = ({
  isVisible,
  accordionSelectedValue,
  accoundIds,
  onRemoveAccount,
  onAddAccount,
}) => {
  const { isWorkContext } = useContextContext();
  const { getAccountById } = useAccountsContext();

  return (
    isWorkContext() && (
      <DefaultAccordionItem
        isVisible={isVisible}
        value="accounts"
        triggerTitle="Accounts"
        accordionSelectedValue={accordionSelectedValue}
        triggerSubTitle={accoundIds.map((id) => (
          <Link key={id} className="hover:underline" href={`/accounts/${id}`}>
            {getAccountById(id)?.name}
          </Link>
        ))}
      >
        {accoundIds.map((id) => (
          <AccountName
            key={id}
            accountId={id}
            accountName={getAccountById(id)?.name}
            removeAccount={onRemoveAccount}
          />
        ))}
        <div className="mt-4" />
        <AccountSelector
          value=""
          allowCreateAccounts
          placeholder="Add account…"
          onChange={onAddAccount}
        />
      </DefaultAccordionItem>
    )
  );
};

export default ProjectAccountDetails;
