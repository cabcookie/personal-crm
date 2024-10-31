import { Account } from "@/api/ContextAccounts";
import {
  RevenueMonth,
  setAccountColumnDataFromMrr,
  setAccountColumnDefFromMrr,
  setLastMonthsRevenue,
  setTotalRevenueFromRevenueMonth,
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
    setLastMonthsRevenue(3, account.name, mrr, setRevenueLastMonths);
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
