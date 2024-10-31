import { Account } from "@/api/ContextAccounts";
import { FC, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ListPayerAccounts from "./ListPayerAccounts";

type AddPayerAccountDialogProps = {
  account: Account;
  addPayerAccount: (accountId: string, payer: string) => void;
  deletePayerAccount: (accountId: string, payer: string) => void;
};

const AddPayerAccountDialog: FC<AddPayerAccountDialogProps> = ({
  account: { id, payerAccounts },
  addPayerAccount,
  deletePayerAccount,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (/^\d*$/.test(value)) {
      if (value.length === 12) {
        const payer = value;
        setValue("");
        addPayerAccount(id, payer);
      }
    } else {
      setValue(value.replace(/\D/g, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <Label className="font-semibold" htmlFor="payers">
        Payer Accounts
      </Label>
      <Input
        placeholder="Add AWS Account ID…"
        className="mt-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="m-2">
        <ListPayerAccounts
          payerAccounts={payerAccounts}
          allowDeletion
          deletePayerAccount={(payerId) => deletePayerAccount(id, payerId)}
          showLabel={false}
          showLinks={false}
        />
      </div>
    </div>
  );
};

export default AddPayerAccountDialog;
