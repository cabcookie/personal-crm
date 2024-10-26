import AccountsWithPayers from "@/components/analytics/accounts-with-payers";
import ImportMrrData from "@/components/analytics/import-data";
import MrrCurrentImport from "@/components/analytics/mrr-current-import";
import MrrDocumentation from "@/components/analytics/mrr-documentation";
import MrrFilterBtnGrp from "@/components/analytics/mrr-filter-btn-grp";
import { withMrrFilter } from "@/components/analytics/useMrrFilter";
import MainLayout from "@/components/layouts/MainLayout";
import { Accordion } from "@/components/ui/accordion";

const CustomerFinancialsPage = () => {
  return (
    <MainLayout title="Customer Financials" sectionName="Customer Financials">
      <div className="space-y-6">
        <ImportMrrData />

        <MrrFilterBtnGrp />

        <Accordion type="single" collapsible>
          <MrrDocumentation />

          <MrrCurrentImport />

          <AccountsWithPayers />
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default withMrrFilter(CustomerFinancialsPage);
