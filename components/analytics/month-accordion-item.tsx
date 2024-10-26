import { Mrr } from "@/api/useMrr";
import AccordionItemBadge from "@/components/accordion-item-badge/badge";
import { setMonthMrrByMonth } from "@/helpers/analytics/analytics";
import { formatRevenue } from "@/helpers/functional";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ResellerBadge from "./reseller-badge";

type MonthAccordionItemProps = {
  month: string;
  payerAccountMrr: Mrr[];
};

const MonthAccordionItem: FC<MonthAccordionItemProps> = ({
  month,
  payerAccountMrr,
}) => {
  const [monthMrr, setMonthMrr] = useState<Mrr | undefined>();

  useEffect(() => {
    setMonthMrrByMonth(month, payerAccountMrr, setMonthMrr);
  }, [month, payerAccountMrr]);

  return (
    <DefaultAccordionItem
      value={month}
      triggerTitle={month}
      triggerSubTitle={formatRevenue(monthMrr?.mrr ?? 0)}
      badge={
        <>
          {monthMrr?.isEstimated && (
            <AccordionItemBadge
              badgeLabel="Estimate"
              className="bg-orange-300"
            />
          )}
          {monthMrr?.isReseller && <ResellerBadge />}
        </>
      }
    >
      {monthMrr && (
        <div className="space-y-4">
          <div className="font-semibold">
            MRR: {formatRevenue(monthMrr.mrr ?? 0)}
          </div>
        </div>
      )}
    </DefaultAccordionItem>
  );
};

export default MonthAccordionItem;
