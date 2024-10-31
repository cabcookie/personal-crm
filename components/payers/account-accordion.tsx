import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { find, flow, identity } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import AccountDetails from "../accounts/AccountDetails";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Button } from "../ui/button";

type PayerAccountAccordionProps = {
  accountId: string;
  removeLinkToPayer: (accountId: string) => void;
};

const PayerAccountAccordion: FC<PayerAccountAccordionProps> = ({
  accountId,
  removeLinkToPayer,
}) => {
  const { accounts } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>();

  useEffect(() => {
    flow(
      identity<Account[] | undefined>,
      find(["id", accountId]),
      setAccount
    )(accounts);
  }, [accounts, accountId]);

  return !account ? (
    <LoadingAccordionItem
      value={`account-${accountId}`}
      sizeTitle="lg"
      sizeSubtitle="base"
    />
  ) : (
    <DefaultAccordionItem
      value={accountId}
      triggerTitle={account.name}
      link={`/accounts/${accountId}`}
    >
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeLinkToPayer(accountId)}
        >
          Remove link to payer
        </Button>
      </div>
      <AccountDetails account={account} />
    </DefaultAccordionItem>
  );
};

export default PayerAccountAccordion;
