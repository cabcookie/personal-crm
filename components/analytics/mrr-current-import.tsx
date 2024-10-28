import useMrr from "@/api/useMrr";
import { setAccountsFromMrr, totalMrr } from "@/helpers/analytics/analytics";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import AccountWithPayersAccordionItem from "./account-with-payers-accordion-item";
import AnalyticsTable from "./analytics-table";
import { columns } from "./analytics-table-column";
import { getData } from "./analytics-table-example-data";
import MrrLoading from "./mrr-loading";
import PayerAccountIssues from "./payer-account-issues";

type MrrCurrentImportProps = {
  className?: string;
};

const MrrCurrentImport: FC<MrrCurrentImportProps> = ({ className }) => {
  const { mrr, isLoading, error } = useMrr("WIP");
  const [accounts, setAccounts] = useState<string[]>([]);
  const data = getData();

  useEffect(() => {
    setAccountsFromMrr(mrr, setAccounts);
  }, [mrr]);

  return (
    <>
      <div className="container mx-auto py-10">
        <AnalyticsTable columns={columns} data={data} />
      </div>

      <PayerAccountIssues mrr={mrr} />

      <DefaultAccordionItem
        value="wip"
        triggerTitle="Current import"
        triggerSubTitle={totalMrr(mrr ?? [])}
      >
        <div className={cn("space-y-6", className)}>
          <ApiLoadingError
            title="Loading MRR current import failed"
            error={error}
          />

          <Accordion type="single" collapsible>
            {isLoading && <MrrLoading />}

            {accounts.map((account) => (
              <AccountWithPayersAccordionItem
                key={account}
                account={account}
                mrr={mrr}
              />
            ))}
          </Accordion>
        </div>
      </DefaultAccordionItem>
    </>
  );
};

export default MrrCurrentImport;
