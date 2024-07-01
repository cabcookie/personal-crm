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
    <div>
      {showLabel && "Payer accounts:"}
      {payerAccounts.map((payer) => (
        <div key={payer} className="flex flex-row gap-1 text-sm items-center">
          {payer}
          {showLinks && (
            <>
              <small className="ml-2">
                <Link
                  href={`https://salesconsole.aws.dev/standalone.html?basePath=accounts&id=${payer}`}
                  target="_blank"
                  className="text-[--context-color] hover:text-accent-foreground hover:underline"
                >
                  Sales Console
                </Link>
              </small>
              <small className="ml-2">
                <Link
                  href={`https://aws-ciw-readonly.amazon.com/cost-management/home?spoofAccountId=${payer}#/`}
                  target="_blank"
                  className="text-[--context-color] hover:text-accent-foreground hover:underline"
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
    </div>
  );

export default ListPayerAccounts;
