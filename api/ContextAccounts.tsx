import { type Schema } from "@/amplify/data/resource";
import { Responsibility } from "@/components/accounts/ResponsibilityRecord";
import {
  EditorJsonContent,
  transformNotesVersion,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import { toISODateString } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type UpdateAccountProps = {
  id: string;
  name?: string;
  introduction?: EditorJsonContent;
};

interface AccountsContextType {
  accounts: Account[] | undefined;
  errorAccounts: any;
  loadingAccounts: boolean;
  createAccount: (
    accountName: string
  ) => Promise<Schema["Account"]["type"] | undefined>;
  getAccountById: (accountId: string) => Account | undefined;
  updateAccount: (props: UpdateAccountProps) => Promise<string | undefined>;
  addResponsibility: (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => Promise<string | undefined>;
  updateResponsibility: (
    responsibilityId: string,
    startDate: Date,
    endDate?: Date
  ) => Promise<string | undefined>;
  assignController: (
    accountId: string,
    controllerId: string | null
  ) => Promise<string | undefined>;
  updateOrder: (accounts: Account[]) => Promise<(string | undefined)[]>;
}

export type Account = {
  id: string;
  name: string;
  introduction?: EditorJsonContent | string;
  controller?: {
    id: string;
    name: string;
  };
  order: number;
  responsibilities: Responsibility[];
  createdAt: Date;
};

const selectionSet = [
  "id",
  "name",
  "controller.id",
  "controller.name",
  "introduction",
  "introductionJson",
  "formatVersion",
  "order",
  "createdAt",
  "responsibilities.id",
  "responsibilities.startDate",
  "responsibilities.endDate",
] as const;

type AccountData = SelectionSet<Schema["Account"]["type"], typeof selectionSet>;

export const mapAccount: (account: AccountData) => Account = ({
  id: accountId,
  name,
  controller,
  introduction,
  introductionJson,
  formatVersion,
  order,
  responsibilities,
  createdAt,
}) => ({
  id: accountId,
  name,
  introduction: transformNotesVersion({
    version: formatVersion,
    notes: introduction,
    notesJson: introductionJson,
  }),
  controller,
  order: order || 0,
  createdAt: new Date(createdAt),
  responsibilities: responsibilities
    .map(
      ({ id: respId, startDate, endDate }): Responsibility => ({
        id: respId,
        accountId: accountId,
        accountName: name,
        startDate: new Date(startDate),
        endDate: !endDate ? undefined : new Date(endDate),
      })
    )
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
  } = useSWR("/api/accounts/", fetchAccounts);

  const createAccount = async (
    accountName: string
  ): Promise<Schema["Account"]["type"] | undefined> => {
    if (accountName.length < 3) return;

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: accountName,
      order: 0,
      responsibilities: [],
      createdAt: new Date(),
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

  const updateAccount = async ({
    id,
    name,
    introduction,
  }: UpdateAccountProps) => {
    const updAccount: Account | undefined = accounts?.find((a) => a.id === id);
    if (!updAccount) return;

    Object.assign(updAccount, {
      ...(name && { name }),
      ...(introduction && { introduction }),
    });

    const updated: Account[] =
      accounts?.map((a) => (a.id === id ? updAccount : a)) || [];
    mutate(updated, false);

    const newAccount = {
      id,
      name,
      ...(introduction
        ? {
            introductionJson: JSON.stringify(introduction),
            formatVersion: 2,
            introduction: null,
          }
        : {}),
    };

    const { data, errors } = await client.models.Account.update(newAccount);

    if (errors) handleApiErrors(errors, "Error updating account");
    mutate(updated);
    return data?.id;
  };

  const assignController = async (
    accountId: string,
    controllerId: string | null
  ) => {
    const updated: Account[] | undefined = accounts?.map((account) =>
      account.id !== accountId
        ? account
        : {
            ...account,
            controller: !controllerId
              ? undefined
              : {
                  id: controllerId,
                  name:
                    accounts.find(({ id }) => id === controllerId)?.name || "",
                },
          }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Account.update({
      id: accountId,
      accountSubsidiariesId: controllerId,
    });
    if (errors) handleApiErrors(errors, "Error updating parent company");
    if (!data) return;
    if (updated) mutate(updated);
    return data.id;
  };

  const addResponsibility = async (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => {
    const updated = accounts?.map((account) =>
      account.id !== accountId
        ? account
        : {
            ...account,
            responsibilities: [
              ...account.responsibilities,
              {
                id: crypto.randomUUID(),
                accountId: account.id,
                accountName: account.name,
                startDate,
                endDate,
              },
            ],
          }
    );
    if (accounts) mutate(updated, false);

    const { data, errors } = await client.models.AccountResponsibilities.create(
      {
        accountId: accountId,
        startDate: toISODateString(startDate),
        endDate: !endDate ? undefined : toISODateString(endDate),
      }
    );
    if (errors) handleApiErrors(errors, "Error creating new responsibility");
    if (accounts) mutate(updated);
    if (!data) return;
    return data.id;
  };

  const updateResponsibility = async (
    responsibilityId: string,
    startDate: Date,
    endDate?: Date
  ) => {
    const updated = accounts?.map((account) =>
      !account.responsibilities.some((r) => r.id === responsibilityId)
        ? account
        : {
            ...account,
            responsibilities: account.responsibilities.map((r) =>
              r.id !== responsibilityId ? r : { ...r, startDate, endDate }
            ),
          }
    );
    if (accounts) mutate(updated, false);

    const { data, errors } = await client.models.AccountResponsibilities.update(
      {
        id: responsibilityId,
        startDate: toISODateString(startDate),
        endDate: !endDate ? null : toISODateString(endDate),
      }
    );
    if (errors) handleApiErrors(errors, "Error updating responsibility");
    if (accounts) mutate(updated);
    return data?.id;
  };

  const updateAccountOrderNo = async (
    id: string,
    order: number
  ): Promise<string | undefined> => {
    const { data, errors } = await client.models.Account.update({ id, order });
    if (errors) handleApiErrors(errors, "Error updating the order of accounts");
    return data?.id;
  };

  const updateOrder = async (items: Account[]) => {
    const updated: Account[] | undefined = accounts?.map(({ id, ...rest }) => ({
      id,
      ...rest,
      order: items.find((item) => item.id === id)?.order || rest.order,
    }));
    if (updated) mutate(updated, false);
    const result = await Promise.all(
      items.map(({ id, order }) => updateAccountOrderNo(id, order))
    );
    if (updated) mutate(updated);
    return result;
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        errorAccounts,
        loadingAccounts,
        createAccount,
        getAccountById,
        updateAccount,
        addResponsibility,
        updateResponsibility,
        assignController,
        updateOrder,
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
