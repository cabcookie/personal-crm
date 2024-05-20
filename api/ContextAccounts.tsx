import { FC, ReactNode, createContext, useContext } from "react";
import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { EditorJsonContent, initialNotesJson, transformNotesVersion } from "@/components/ui-elements/notes-writer/NotesWriter";
const client = generateClient<Schema>();

interface AccountsContextType {
  accounts: Account[] | undefined;
  errorAccounts: any;
  loadingAccounts: boolean;
  createAccount: (
    accountName: string
  ) => Promise<Schema["Account"]["type"] | undefined>;
  getAccountById: (accountId: string) => Account | undefined;
  saveAccountName: (
    accountId: string,
    accountName: string
  ) => Promise<string | undefined>;
}

export type Account = {
  id: string;
  name: string;
  introduction: EditorJsonContent;
  controllerId?: string;
  order: number;
  responsibilities: { startDate: Date; endDate?: Date }[];
};

const selectionSet = [
  "id",
  "name",
  "accountSubsidiariesId",
  "introduction",
  "introductionJson",
  "formatVersion",
  "order",
  "responsibilities.startDate",
  "responsibilities.endDate",
] as const;

type AccountData = SelectionSet<Schema["Account"]["type"], typeof selectionSet>;

export const mapAccount: (account: AccountData) => Account = ({
  id,
  name,
  accountSubsidiariesId,
  introduction,
  introductionJson,
  formatVersion,
  order,
  responsibilities,
}) => ({
  id,
  name,
  introduction: transformNotesVersion({version: formatVersion, notes: introduction, notesJson: introductionJson}),
  controllerId: accountSubsidiariesId || undefined,
  order: order || 0,
  responsibilities: responsibilities
    .map(({ startDate, endDate }) => ({
      startDate: new Date(startDate),
      endDate: !endDate ? undefined : new Date(endDate),
    }))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
});

const fetchAccounts = async () => {
  const { data, errors } = await client.models.Account.list({
    limit: 500,
    selectionSet,
  });
  if (errors) throw errors;
  return data.map(mapAccount).sort((a, b) => a.order - b.order);
};

interface AccountsContextProviderProps {
  children: ReactNode;
}

export const AccountsContextProvider: FC<AccountsContextProviderProps> = ({
  children,
}) => {
  const {
    data: accounts,
    error: errorAccounts,
    isLoading: loadingAccounts,
    mutate,
  } = useSWR(`/api/accounts/`, fetchAccounts);

  const createAccount = async (
    accountName: string
  ): Promise<Schema["Account"]["type"] | undefined> => {
    if (accountName.length < 3) return;

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: accountName,
      introduction: initialNotesJson,
      order: 0,
      responsibilities: [],
    };

    const updatedAccounts = [...(accounts || []), newAccount];
    mutate(updatedAccounts, false);

    const { data, errors } = await client.models.Account.create({
      name: accountName,
      formatVersion: 2,
    });
    if (errors) handleApiErrors(errors, "Error creating account");
    mutate(updatedAccounts);
    return data || undefined;
  };

  const getAccountById = (accountId: string) =>
    accounts?.find((account) => account.id === accountId);

  const saveAccountName = async (accountId: string, accountName: string) => {
    const updated: Account[] =
      accounts?.map((a) =>
        a.id !== accountId ? a : { ...a, name: accountName }
      ) || [];
    mutate(updated, false);
    const { data, errors } = await client.models.Account.update({
      id: accountId,
      name: accountName,
    });
    if (errors) handleApiErrors(errors, "Error updating account");
    mutate(updated);
    return data?.id;
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        errorAccounts,
        loadingAccounts,
        createAccount,
        getAccountById,
        saveAccountName,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined
);

export const useAccountsContext = () => {
  const accounts = useContext(AccountsContext);
  if (!accounts)
    throw new Error(
      "useAccountsContext must be used within AccountsContextProvider"
    );
  return accounts;
};
