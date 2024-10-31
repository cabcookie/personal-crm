import { useAccountsContext } from "@/api/ContextAccounts";
import { Mrr, MrrMutator } from "@/api/useMrr";
import {
  MrrDataIssue,
  setPayerAccountIssues,
} from "@/helpers/analytics/issues";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import PayerAccountIssue from "./payer-account-issue";

type PayerAccountIssuesProps = {
  mrr?: Mrr[];
  mutate: MrrMutator;
};

const PayerAccountIssues: FC<PayerAccountIssuesProps> = ({ mrr, mutate }) => {
  const { accounts } = useAccountsContext();
  const [issues, setIssues] = useState<MrrDataIssue[]>([]);

  useEffect(() => {
    setPayerAccountIssues(mrr, accounts, setIssues);
  }, [mrr, accounts]);

  return (
    issues.length > 0 && (
      <DefaultAccordionItem
        value="issues"
        triggerTitle="Issues"
        triggerSubTitle={`${issues.length} Issues`}
      >
        <div className="space-y-6">
          <div>Open issues: {issues.length}</div>

          <Accordion type="single" collapsible>
            {issues.map((issue) => (
              <PayerAccountIssue
                key={issue.awsAccountNumber}
                issue={issue}
                mutate={() => mutate(mrr)}
              />
            ))}
          </Accordion>
        </div>
      </DefaultAccordionItem>
    )
  );
};

export default PayerAccountIssues;
