import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { MrrDataIssue } from "@/helpers/analytics/issues";
import { createPayerAndAccountLink } from "@/helpers/payers/api-actions";
import { find, flow, identity } from "lodash/fp";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";

type PayerAccountIssueProps = {
  issue: MrrDataIssue;
  mutate: () => void;
};

const PayerAccountIssue: FC<PayerAccountIssueProps> = ({
  issue: { awsAccountNumber, companyName, linkedCompanyName },
  mutate,
}) => {
  const { accounts } = useAccountsContext();
  const [account, setAccount] = useState<Account | undefined>();
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    flow(
      identity<Account[] | undefined>,
      find(({ name }) => name === companyName),
      setAccount
    )(accounts);
  }, [accounts, companyName]);

  const handleFixIssue = async () => {
    if (!account) return;
    setFixing(true);
    await createPayerAndAccountLink(account.id, awsAccountNumber);
    mutate();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <b>AWS Payer ID:</b>{" "}
          <Link
            href={`/payers/${awsAccountNumber}`}
            target="_blank"
            className="text-muted-foreground hover:text-blue-400"
          >
            {awsAccountNumber}
            <ExternalLink className="ml-1 w-4 h-4 inline-block -translate-y-0.5" />
          </Link>
        </div>
        <div>
          <b>Company in report:</b> {companyName}
        </div>
        <div>
          <b>Company linked:</b> {linkedCompanyName || "None"}
        </div>
        {account && (
          <>
            <div className="text-red-700">
              <b>Link to </b>
              {account.name}?
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFixIssue}
              disabled={fixing}
            >
              {fixing && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Fixing...
                </>
              )}
              {!fixing && <>Fix issue</>}
            </Button>
          </>
        )}
      </div>
      <hr className="pb-4" />
    </div>
  );
};

export default PayerAccountIssue;
