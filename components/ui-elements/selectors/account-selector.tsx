import { useAccountsContext } from "@/api/ContextAccounts";
import { FC } from "react";
import ComboBox from "../../combo-box/combo-box";

type AccountSelectorProps = {
  value: string;
  allowCreateAccounts?: boolean;
  onChange: (accountId: string | null) => void;
  placeholder?: string;
};

const AccountSelector: FC<AccountSelectorProps> = ({
  value,
  allowCreateAccounts,
  onChange,
  placeholder = "Search accounts…",
}) => {
  const { accounts, createAccount } = useAccountsContext();

  const onCreate = async (newAccountName: string) => {
    const account = await createAccount(newAccountName);
    if (account) onChange(account.id);
  };

  return (
    <ComboBox
      options={accounts?.map((account) => ({
        value: account.id,
        label: account.name,
      }))}
      currentValue={value}
      placeholder={placeholder}
      noSearchResultMsg="No account found."
      onChange={onChange}
      onCreate={allowCreateAccounts ? onCreate : undefined}
    />
  );
};

export default AccountSelector;
