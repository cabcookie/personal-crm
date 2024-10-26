import { setAccountsFromMrr, totalMrr } from "@/helpers/analytics/analytics";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import AccountWithPayersAccordionItem from "./account-with-payers-accordion-item";
import MrrLoading from "./mrr-loading";
import { useMrrFilter } from "./useMrrFilter";

type AccountsWithPayersProps = {
  className?: string;
};

const AccountsWithPayers: FC<AccountsWithPayersProps> = ({ className }) => {
  const { mrr, isLoading, error } = useMrrFilter();
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    setAccountsFromMrr(mrr, setAccounts);
  }, [mrr]);

  return (
    <DefaultAccordionItem
      value="analytics"
      triggerTitle="Analytics"
      triggerSubTitle={totalMrr(mrr ?? [])}
    >
      <div className={cn("space-y-6", className)}>
        <ApiLoadingError title="Loading MRR data failed" error={error} />

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
  );
};

export default AccountsWithPayers;
