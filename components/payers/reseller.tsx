import { Account, useAccountsContext } from "@/api/ContextAccounts";
import usePayer from "@/api/usePayer";
import { setResellerByPayer } from "@/helpers/analytics/account-data";
import { FC, useEffect, useState } from "react";
import AccountDetails from "../accounts/AccountDetails";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type PayerResellerProps = {
  payerId: string;
  showReseller?: boolean;
};

const PayerReseller: FC<PayerResellerProps> = ({ payerId, showReseller }) => {
  const { accounts } = useAccountsContext();
  const { payer } = usePayer(payerId);
  const [reseller, setReseller] = useState<Account | undefined>();

  useEffect(() => {
    setResellerByPayer(payer, accounts, setReseller);
  }, [payer, accounts]);

  return (
    reseller && (
      <DefaultAccordionItem
        value="reseller"
        triggerTitle={`Reseller: ${reseller?.name}`}
        link={`/accounts/${reseller?.id}`}
        isVisible={!!showReseller}
      >
        <AccountDetails account={reseller} showResellerFinancials />
      </DefaultAccordionItem>
    )
  );
};

export default PayerReseller;
