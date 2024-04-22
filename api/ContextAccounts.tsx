import { FC, ReactNode, createContext, useContext } from "react";
import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
const client = generateClient<Schema>();

interface AccountsContextType {
  accounts: Account[] | undefined;
  errorAccounts: any;
  loadingAccounts: boolean;
  createAccount: (accountName: string) => Promise<void>;
  getAccountById: (accountId: string) => Account | undefined;
}

interface AccountsContextProviderProps {
  children: ReactNode;
}

const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined
);

export type Account = {
  id: string;
  name: string;
};

const mapAccount: (account: Schema["Account"]) => Account = ({ id, name }) => ({
  id,
  name,
});

const fetchAccounts = async () => {
  const { data, errors } = await client.models.Account.list();
  if (errors) throw errors;
  return data.map(mapAccount).sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const AccountsContextProvider: FC<AccountsContextProviderProps> = ({
  children,
}) => {
  const {
    data: accounts,
    error: errorAccounts,
    isLoading: loadingAccounts,
    mutate: mutateAccounts,
  } = useSWR("/api/accounts", fetchAccounts);

  const getAccountById = (accountId: string) =>
    accounts?.find((a) => a.id === accountId);

  const createAccount = async (accountName: string) => {
    const newAccount: Account = { id: crypto.randomUUID(), name: accountName };
    const updated: Account[] = [...(accounts || []), newAccount];
    mutateAccounts(updated, false);
    await client.models.Account.create({ name: accountName });
    mutateAccounts(updated);
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        errorAccounts,
        loadingAccounts,
        createAccount,
        getAccountById,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const accounts = useContext(AccountsContext);
  if (accounts === undefined) {
    throw new Error(
      "useAccountsContext must be used within an AccountsContextProvider"
    );
  }
  return accounts;
};
