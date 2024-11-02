import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ListPayerAccounts from "./ListPayerAccounts";

type AccountPayerAccountsProps = {
  account: Account;
  showAwsAccounts?: boolean;
};

const AccountPayerAccounts: FC<AccountPayerAccountsProps> = ({
  account,
  showAwsAccounts,
}) => {
  const { deletePayerAccount } = useAccountsContext();

  return (
    <DefaultAccordionItem
      value="aws-accounts"
      triggerTitle="AWS Payer Accounts"
      triggerSubTitle={account.payerAccounts}
      isVisible={!!showAwsAccounts && account.payerAccounts.length > 0}
    >
      <ListPayerAccounts
        payerAccounts={account.payerAccounts}
        deletePayerAccount={(payerId) =>
          deletePayerAccount(account.id, payerId)
        }
        allowDeletion
        showLabel={false}
      />
    </DefaultAccordionItem>
  );
};

export default AccountPayerAccounts;
