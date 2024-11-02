import { Trash2 } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import PayerAccountLinks from "./payer-account-links";

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
        <>
          <div key={payer} className="flex flex-row gap-1 text-sm items-center">
            {payer}
            {showLinks && <PayerAccountLinks payer={payer} />}
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
        </>
      ))}
    </>
  );

export default ListPayerAccounts;
