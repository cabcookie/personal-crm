import { FC, useState, useEffect } from "react";
import { Mrr } from "@/api/useMrr";
import {
  MrrDataIssue,
  setPayerAccountIssues,
} from "@/helpers/analytics/analytics";
import { useAccountsContext } from "@/api/ContextAccounts";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";
import PayerAccountIssue from "./payer-account-issue";

type PayerAccountIssuesProps = {
  mrr?: Mrr[];
};

const PayerAccountIssues: FC<PayerAccountIssuesProps> = ({ mrr }) => {
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
        <Accordion type="single" collapsible>
          {issues.map((issue) => (
            <PayerAccountIssue key={issue.awsAccountNumber} issue={issue} />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default PayerAccountIssues;
