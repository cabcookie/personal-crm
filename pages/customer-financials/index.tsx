import AnalyticsTable from "@/components/analytics/analytics-table";
import { AccountMrr } from "@/components/analytics/analytics-table-column";
import InstructionsUpload from "@/components/analytics/instructions-upload";
import MrrFilterBtnGrp from "@/components/analytics/mrr-filter-btn-grp";
import UploadIssues from "@/components/analytics/upload-issues";
import {
  useMrrFilter,
  withMrrFilter,
} from "@/components/analytics/useMrrFilter";
import MainLayout from "@/components/layouts/MainLayout";
import { Accordion } from "@/components/ui/accordion";
import {
  setColumnDataFromMrr,
  setColumnDefFromMrr,
} from "@/helpers/analytics/prep-table-data";
import { ColumnDef } from "@tanstack/react-table";
import { flow } from "lodash/fp";
import { useEffect, useState } from "react";

const CustomerFinancialsPage = () => {
  const { mrrFilter, mrr } = useMrrFilter();
  const [noOfMonths, setNoOfMonths] = useState(0);
  const [columnDef, setColumnDef] = useState<ColumnDef<AccountMrr>[]>([]);
  const [columnData, setColumnData] = useState<AccountMrr[]>([]);

  useEffect(() => {
    flow(parseInt, setNoOfMonths)(mrrFilter);
  }, [mrrFilter]);

  useEffect(() => {
    setColumnDataFromMrr(mrr, noOfMonths, setColumnData);
  }, [mrr, noOfMonths]);

  useEffect(() => {
    setColumnDefFromMrr(mrr, noOfMonths, setColumnDef);
  }, [mrr, noOfMonths]);

  return (
    <MainLayout title="Customer Financials" sectionName="Customer Financials">
      <div className="space-y-6">
        <MrrFilterBtnGrp />

        <Accordion type="single" collapsible>
          <InstructionsUpload />
          <UploadIssues />
        </Accordion>

        <AnalyticsTable columns={columnDef} data={columnData} />
      </div>
    </MainLayout>
  );
};

export default withMrrFilter(CustomerFinancialsPage);
