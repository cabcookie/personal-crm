import { MrrDataIssue } from "@/helpers/analytics/analytics";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type PayerAccountIssueProps = {
  issue: MrrDataIssue;
};

const PayerAccountIssue: FC<PayerAccountIssueProps> = ({
  issue: { awsAccountNumber, companyName, linkedCompanyName },
}) => {
  return (
    <DefaultAccordionItem
      value={awsAccountNumber}
      triggerTitle={awsAccountNumber}
      triggerSubTitle={[companyName, linkedCompanyName || "Not linked"]}
    >
      <div className="space-y-4">
        <div>
          <span className="font-semibold">AWS Payer ID:</span>{" "}
          {awsAccountNumber}
        </div>
        <div>
          <span className="font-semibold">Company in report:</span>{" "}
          {companyName}
        </div>
        <div>
          <span className="font-semibold">Company linked:</span>{" "}
          {linkedCompanyName || "None"}
        </div>
      </div>
    </DefaultAccordionItem>
  );
};

export default PayerAccountIssue;
