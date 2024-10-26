import { FC, useState, useEffect } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import PayerAccordionItem from "./payer-accordion-item";
import { Mrr } from "@/api/useMrr";
import {
  setAccountMrrByAccount,
  setPayerAccountsFromMrr,
  totalMrr,
} from "@/helpers/analytics/analytics";

type AccountWithPayersAccordionItemProps = {
  account: string;
  mrr: Mrr[] | undefined;
};

const AccountWithPayersAccordionItem: FC<
  AccountWithPayersAccordionItemProps
> = ({ account, mrr }) => {
  const [accountMrr, setAccountMrr] = useState<Mrr[]>([]);
  const [payerAccounts, setPayerAccounts] = useState<string[]>([]);

  useEffect(() => {
    setAccountMrrByAccount(account, mrr, setAccountMrr);
  }, [mrr, account]);

  useEffect(() => {
    setPayerAccountsFromMrr(accountMrr, setPayerAccounts);
  }, [accountMrr]);

  return (
    <DefaultAccordionItem
      value={account}
      triggerTitle={account}
      triggerSubTitle={totalMrr(accountMrr)}
      className="tracking-tight"
    >
      <Accordion type="single" collapsible>
        {payerAccounts.map((payer) => (
          <PayerAccordionItem
            key={payer}
            accountMrr={accountMrr}
            payerAccount={payer}
          />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default AccountWithPayersAccordionItem;
