import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";

type ListPayerAccountsProps = {
  payerAccounts: string[];
  allowDeletion?: boolean;
  showLabel?: boolean;
  showLinks?: boolean;
  deletePayerAccount: (payer: string) => void;
};

const ListPayerAccounts: FC<ListPayerAccountsProps> = ({
  payerAccounts,
  allowDeletion,
  deletePayerAccount,
  showLabel = true,
  showLinks = true,
}) =>
  payerAccounts.length > 0 && (
    <>
      <div>{showLabel && "Payer accounts:"}</div>
      {payerAccounts.map((payer) => (
        <div key={payer} className="flex flex-row gap-1 text-sm items-center">
          {payer}
          {showLinks && (
            <>
              <small className="ml-2">
                <Link
                  href={`https://salesconsole.aws.dev/standalone.html?basePath=accounts&id=${payer}`}
                  target="_blank"
                  className="text-[--context-color] hover:text-accent-foreground hover:underline hover:underline-offset-2"
                >
                  Sales Console
                </Link>
              </small>
              <small className="ml-2">
                <Link
                  href={`https://prod.us-east-1.ro.cmc.insights.aws.a2z.com/?spoofAccountId=${payer}#/cost-explorer?chartStyle=STACK&costAggregate=unBlendedCost&excludeForecasting=false&filter=%5B%5D&futureRelativeRange=CUSTOM&granularity=Monthly&groupBy=%5B%22LinkedAccount%22%5D&historicalRelativeRange=LAST_3_MONTHS&isDefault=true&showOnlyUncategorized=false&showOnlyUntagged=false&usageAggregate=undefined&useNormalizedUnits=false`}
                  target="_blank"
                  className="text-[--context-color] hover:text-accent-foreground hover:underline hover:underline-offset-2"
                >
                  Cost Explorer
                </Link>
              </small>
            </>
          )}
          {allowDeletion && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deletePayerAccount(payer)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      ))}
    </>
  );

export default ListPayerAccounts;
