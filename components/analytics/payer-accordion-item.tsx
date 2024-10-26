import { Mrr } from "@/api/useMrr";
import {
  hasResellerItems,
  setMonthsByPayer,
  setPayerAccountMrrByPayer,
  totalMrr,
} from "@/helpers/analytics/analytics";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import MonthAccordionItem from "./month-accordion-item";
import ResellerBadge from "./reseller-badge";

type PayerAccordionItemProps = {
  accountMrr: Mrr[];
  payerAccount: string;
};

const PayerAccordionItem: FC<PayerAccordionItemProps> = ({
  payerAccount,
  accountMrr,
}) => {
  const [payerAccountMrr, setPayerAccountMrr] = useState<Mrr[]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    setPayerAccountMrrByPayer(payerAccount, accountMrr, setPayerAccountMrr);
  }, [payerAccount, accountMrr]);

  useEffect(() => {
    setMonthsByPayer(payerAccountMrr, setMonths);
  }, [payerAccountMrr]);

  return (
    <DefaultAccordionItem
      value={payerAccount}
      triggerTitle={payerAccount}
      triggerSubTitle={totalMrr(payerAccountMrr)}
      badge={hasResellerItems(payerAccountMrr) && <ResellerBadge />}
    >
      <Accordion type="single" collapsible>
        {months.map((month) => (
          <MonthAccordionItem
            key={month}
            month={month}
            payerAccountMrr={payerAccountMrr}
          />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default PayerAccordionItem;
