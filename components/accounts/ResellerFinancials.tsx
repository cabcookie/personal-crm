import { Account } from "@/api/ContextAccounts";
import {
  RevenueMonth,
  setTotalRevenueFromRevenueMonth,
} from "@/helpers/analytics/account-data";
import { setColumnDefFromMrr } from "@/helpers/analytics/prep-table-data";
import {
  setLastMonthsResellerRevenue,
  setResellerColumnDataFromMrr,
} from "@/helpers/analytics/reseller-data";
import { formatDate, formatRevenue } from "@/helpers/functional";
import { ColumnDef } from "@tanstack/react-table";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import MrrFilterBtnGrp from "../analytics/mrr-filter-btn-grp";
import AnalyticsTable from "../analytics/table/analytics-table";
import { AccountMrr } from "../analytics/table/analytics-table-column";
import { useMrrFilter, withMrrFilter } from "../analytics/useMrrFilter";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type ResellerFinancialsProps = {
  account: Account;
  showResellerFinancials?: boolean;
};

const ResellerFinancials: FC<ResellerFinancialsProps> = ({
  account,
  showResellerFinancials,
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
    setColumnDefFromMrr(mrr, noOfMonths, setColumnDef);
  }, [mrr, noOfMonths]);

  useEffect(() => {
    setResellerColumnDataFromMrr(account.id, mrr, noOfMonths, setColumnData);
  }, [account, mrr, noOfMonths]);

  useEffect(() => {
    setLastMonthsResellerRevenue(account.id, 3, mrr, setRevenueLastMonths);
  }, [account, mrr]);

  useEffect(() => {
    setTotalRevenueFromRevenueMonth(revenueLastMonths, setTotalRevenue);
  }, [revenueLastMonths]);

  return (
    <DefaultAccordionItem
      value="reseller-financials"
      triggerTitle="AWS Revenue (as Reseller)"
      triggerSubTitle={revenueLastMonths.map(
        ({ month, mrr }) =>
          `${formatDate("MMM yyyy")(month)}: ${formatRevenue(mrr)}`
      )}
      isVisible={!!showResellerFinancials && totalRevenue > 0}
    >
      <div className="space-y-6">
        <MrrFilterBtnGrp />
        <AnalyticsTable columns={columnDef} data={columnData} />
      </div>
    </DefaultAccordionItem>
  );
};

export default withMrrFilter(ResellerFinancials);
