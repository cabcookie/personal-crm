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
  <div className="flex flex-row gap-2">
    <div>
      <Link href={`/accounts/${accountId}`} className="hover:underline">
        {accountName}
      </Link>
    </div>
    {removeAccount && accountName && (
      <Trash2
        className="pt-[0.1rem] pb-[0.4rem] text-muted-foreground hover:text-primary"
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
        title="Accounts"
        accordionSelectedValue={accordionSelectedValue}
        subTitle={accoundIds.map((id) => (
          <small key={id} className="hover:underline">
            <Link href={`/accounts/${id}`}>{getAccountById(id)?.name}</Link>
          </small>
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
