import { FC, ReactNode, useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AccountName from "./tokens/account-name";
import { useAccountsContext } from "@/api/ContextAccounts";

type AccountSelectorProps = {
  allowCreateAccounts?: boolean;
  clearAfterSelection?: boolean;
  onChange: (accountId: string | null) => void;
};

type AccountListOption = {
  value: string;
  label: ReactNode;
};

const AccountSelector: FC<AccountSelectorProps> = ({
  allowCreateAccounts,
  onChange,
  clearAfterSelection,
}) => {
  const { accounts, createAccount, loadingAccounts } = useAccountsContext();
  const [mappedOptions, setMappedOptions] = useState<
    AccountListOption[] | undefined
  >();
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    setMappedOptions(
      accounts?.map((account) => ({
        value: account.id,
        label: <AccountName noLinks accountId={account.id} />,
      }))
    );
  }, [accounts]);

  const selectAccount = async (selectedOption: any) => {
    if (!(allowCreateAccounts && selectedOption.__isNew__)) {
      onChange(selectedOption.value);
      if (clearAfterSelection) setSelectedOption(null);
      return;
    }
    const account = await createAccount(selectedOption.label);
    if (account) onChange(account.id);
    if (clearAfterSelection) setSelectedOption(null);
  };

  const filterAccounts = (accountId: string, input: string) =>
    !!accounts
      ?.find(({ id }) => id === accountId)
      ?.name.toLowerCase()
      .includes(input.toLowerCase());

  return (
    <div>
      {!allowCreateAccounts ? (
        <Select
          options={mappedOptions}
          onChange={selectAccount}
          value={selectedOption}
          isClearable
          isSearchable
          filterOption={(candidate, input) =>
            filterAccounts(candidate.value, input)
          }
          placeholder={
            loadingAccounts ? "Loading accounts..." : "Add account..."
          }
        />
      ) : (
        <CreatableSelect
          options={mappedOptions}
          onChange={selectAccount}
          value={selectedOption}
          isClearable
          isSearchable
          filterOption={(candidate, input) =>
            candidate.data.__isNew__ || filterAccounts(candidate.value, input)
          }
          placeholder={
            loadingAccounts ? "Loading accounts..." : "Add account..."
          }
          formatCreateLabel={(input) => `Create "${input}"`}
        />
      )}
    </div>
  );
};

export default AccountSelector;
