import { Account } from "@/api/ContextAccounts";
import MrrFilterBtnGrp from "@/components/analytics/mrr-filter-btn-grp";
import AnalyticsTable from "@/components/analytics/table/analytics-table";
import { AccountMrr } from "@/components/analytics/table/analytics-table-column";
import {
  useMrrFilter,
  withMrrFilter,
} from "@/components/analytics/useMrrFilter";
import {
  RevenueMonth,
  setAccountColumnDataFromMrr,
  setAccountColumnDefFromMrr,
  setLastMonthsAccountRevenue,
  setTotalRevenueFromRevenueMonth,
} from "@/helpers/analytics/account-data";
import { formatDate, formatRevenue } from "@/helpers/functional";
import { ColumnDef } from "@tanstack/react-table";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type AccountFinancialsProps = {
  account: Account;
  showFinancials?: boolean;
};

const AccountFinancials: FC<AccountFinancialsProps> = ({
  account,
  showFinancials,
}) => {
  const { mrrFilter, mrr } = useMrrFilter();
  const [noOfMonths, setNoOfMonths] = useState(0);
  const [columnDef, setColumnDef] = useState<ColumnDef<AccountMrr>[]>([]);
  const [columnData, setColumnData] = useState<AccountMrr[]>([]);
  const [revenueLastMonths, setRevenueLastMonths] = useState<RevenueMonth[]>(
    []
  );
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    flow(parseInt, setNoOfMonths)(mrrFilter);
  }, [mrrFilter]);

  useEffect(() => {
    setAccountColumnDefFromMrr(mrr, noOfMonths, setColumnDef);
  }, [mrr, noOfMonths]);

  useEffect(() => {
    setAccountColumnDataFromMrr(account.name, mrr, noOfMonths, setColumnData);
  }, [mrr, noOfMonths, account]);

  useEffect(() => {
    setLastMonthsAccountRevenue(3, account.name, mrr, setRevenueLastMonths);
  }, [mrr, account]);

  useEffect(() => {
    setTotalRevenueFromRevenueMonth(revenueLastMonths, setTotalRevenue);
  }, [revenueLastMonths]);

  return (
    <DefaultAccordionItem
      value="financials"
      triggerTitle="AWS Revenue"
      triggerSubTitle={revenueLastMonths.map(
        ({ month, mrr }) =>
          `${formatDate("MMM yyyy")(month)}: ${formatRevenue(mrr)}`
      )}
      isVisible={!!showFinancials && totalRevenue > 0}
    >
      <div className="space-y-6">
        <MrrFilterBtnGrp />
        <AnalyticsTable columns={columnDef} data={columnData} />
      </div>
    </DefaultAccordionItem>
  );
};

export default withMrrFilter(AccountFinancials);
