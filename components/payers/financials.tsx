import { Badge } from "@/components/ui/badge";
import {
  RevenueMonth,
  setIsResellerForPayer,
  setLastMonthsPayerRevenue,
  setPayerColumnDataFromMrr,
  setPayerColumnDefFromMrr,
} from "@/helpers/analytics/account-data";
import { formatDate, formatRevenue } from "@/helpers/functional";
import { ColumnDef } from "@tanstack/react-table";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import AnalyticsTable from "../analytics/analytics-table";
import { AccountMrr } from "../analytics/analytics-table-column";
import MrrFilterBtnGrp from "../analytics/mrr-filter-btn-grp";
import { useMrrFilter, withMrrFilter } from "../analytics/useMrrFilter";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type PayerFinancialsProps = {
  payerId: string;
  showFinancials?: boolean;
};

const PayerFinancials: FC<PayerFinancialsProps> = ({
  payerId,
  showFinancials,
}) => {
  const { mrrFilter, mrr } = useMrrFilter();
  const [noOfMonths, setNoOfMonths] = useState(0);
  const [columnDef, setColumnDef] = useState<ColumnDef<AccountMrr>[]>([]);
  const [columnData, setColumnData] = useState<AccountMrr[]>([]);
  const [revenueLastMonths, setRevenueLastMonths] = useState<RevenueMonth[]>(
    []
  );
  const [isReseller, setIsReseller] = useState(false);

  useEffect(() => {
    flow(parseInt, setNoOfMonths)(mrrFilter);
  }, [mrrFilter]);

  useEffect(() => {
    setPayerColumnDefFromMrr(mrr, noOfMonths, setColumnDef);
  }, [mrr, noOfMonths]);

  useEffect(() => {
    setPayerColumnDataFromMrr(payerId, mrr, noOfMonths, setColumnData);
  }, [mrr, noOfMonths, payerId]);

  useEffect(() => {
    setLastMonthsPayerRevenue(3, payerId, mrr, setRevenueLastMonths);
  }, [mrr, payerId]);

  useEffect(() => {
    setIsResellerForPayer(payerId, mrr, noOfMonths, setIsReseller);
  }, [payerId, mrr, noOfMonths]);

  return (
    <DefaultAccordionItem
      value="financials"
      triggerTitle="AWS Revenue"
      triggerSubTitle={revenueLastMonths.map(
        ({ month, mrr }) =>
          `${formatDate("MMM yyyy")(month)}: ${formatRevenue(mrr)}`
      )}
      isVisible={!!showFinancials}
    >
      <div className="space-y-6">
        <MrrFilterBtnGrp />

        {isReseller && (
          <div className="flex justify-start md:justify-center mb-4 md:mb-6">
            <Badge className="bg-green-500">Reseller</Badge>
          </div>
        )}

        <AnalyticsTable columns={columnDef} data={columnData} />
      </div>
    </DefaultAccordionItem>
  );
};

export default withMrrFilter(PayerFinancials);
