import { Account } from "@/api/ContextAccounts";
import { FC, useState } from "react";
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

  // This was an effect reacting to its own state; it is input handling, so it
  // belongs in the change handler. Non-digits are now stripped in one pass
  // instead of via a second render.
  const handleChange = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length === 12) {
      setValue("");
      addPayerAccount(id, digits);
      return;
    }
    setValue(digits);
  };

  return (
    <div>
      <Label className="font-semibold" htmlFor="payers">
        Payer Accounts
      </Label>
      <Input
        placeholder="Add AWS Account ID…"
        className="mt-2"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
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
