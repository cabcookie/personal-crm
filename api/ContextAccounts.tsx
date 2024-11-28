import { type Schema } from "@/amplify/data/resource";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { toast } from "@/components/ui/use-toast";
import {
  calcAccountAndSubsidariesPipeline,
  calcOrder,
  getQuotaFromTerritoryOrSubsidaries,
} from "@/helpers/accounts";
import {
  createPayerAndAccountLink,
  deletePayerAccountLink,
} from "@/helpers/payers/api-actions";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { JSONContent } from "@tiptap/core";
import { SelectionSet, generateClient } from "aws-amplify/data";
import {
  filter,
  find,
  flow,
  identity,
  join,
  map,
  sortBy,
  sum,
} from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type UpdateAccountProps = {
  id: string;
  name?: string;
  shortName?: string;
  mainColor?: string;
  crmId?: string;
  introduction?: JSONContent;
};

interface AccountsContextType {
  accounts: Account[] | undefined;
  errorAccounts: any;
  loadingAccounts: boolean;
  createAccount: (
    accountName: string
  ) => Promise<Schema["Account"]["type"] | undefined>;
  getAccountById: (accountId: string | undefined) => Account | undefined;
  updateAccount: (props: UpdateAccountProps) => Promise<string | undefined>;
  assignController: (
    accountId: string,
    controllerId: string | null
  ) => Promise<string | undefined>;
  assignTerritory: (
    accountId: string,
    territoryId: string
  ) => Promise<string | undefined>;
  deleteTerritory: (
    accountId: string,
    territoryId: string
  ) => Promise<string | undefined>;
  addPayerAccount: (
    accountId: string,
    payer: string
  ) => Promise<string | undefined>;
  deletePayerAccount: (
    accountId: string,
    payer: string
  ) => Promise<string | undefined>;
  getPipelineByControllerId: (controllerId: string) => number;
  getAccountNamesByIds: (accountIds: string[]) => string;
}

export type Account = {
  id: string;
  name: string;
  shortName?: string;
  mainColor?: string;
  crmId?: string;
  introduction: JSONContent;
  controller?: {
    id: string;
    name: string;
  };
  latestQuota: number;
  pipeline: number;
  order: number;
  territoryIds: string[];
  createdAt: Date;
  payerAccounts: string[];
};

const selectionSet = [
  "id",
  "name",
  "shortName",
  "mainColor",
  "crmId",
  "controller.id",
  "controller.name",
  "introduction",
  "introductionJson",
  "formatVersion",
  "createdAt",
  "territories.territory.id",
  "territories.territory.responsibilities.id",
  "territories.territory.responsibilities.quota",
  "territories.territory.responsibilities.startDate",
  "subsidiaries.territories.territory.id",
  "subsidiaries.territories.territory.responsibilities.id",
  "subsidiaries.territories.territory.responsibilities.quota",
  "subsidiaries.territories.territory.responsibilities.startDate",
  "projects.projects.done",
  "projects.projects.crmProjects.crmProject.id",
  "projects.projects.crmProjects.crmProject.closeDate",
  "projects.projects.crmProjects.crmProject.annualRecurringRevenue",
  "projects.projects.crmProjects.crmProject.totalContractVolume",
  "projects.projects.crmProjects.crmProject.isMarketplace",
  "projects.projects.crmProjects.crmProject.stage",
  "awsAccounts.awsAccountNumberId",
] as const;

type AccountData = SelectionSet<Schema["Account"]["type"], typeof selectionSet>;
export type SubsidiaryData = AccountData["subsidiaries"][number];
export type TerritoryData = AccountData["territories"][number];
export type AccountProjectData = AccountData["projects"][number];
export type AccountBeforePipelineCalculations = Omit<
  Account,
  "order" | "latestQuota" | "pipeline"
> & {
  subsidiaries: SubsidiaryData[];
  territories: TerritoryData[];
  projects: AccountProjectData[];
};

const mapAccount: (
  account: AccountData
) => AccountBeforePipelineCalculations = ({
  id: accountId,
  name,
  shortName,
  mainColor,
  crmId,
  controller,
  introduction,
  introductionJson,
  formatVersion,
  territories,
  subsidiaries,
  projects,
  createdAt,
  awsAccounts,
}) => ({
  id: accountId,
  name,
  shortName: shortName || undefined,
  mainColor: mainColor || undefined,
  crmId: crmId || undefined,
  introduction: transformNotesVersion({
    formatVersion,
    notes: introduction,
    notesJson: introductionJson,
  }),
  controller,
  territories,
  subsidiaries,
  projects,
  createdAt: new Date(createdAt),
  territoryIds: territories.map((t) => t.territory.id),
  payerAccounts: awsAccounts.map((p) => p.awsAccountNumberId),
});

const addOrderNumberToAccounts = (
  accounts: AccountBeforePipelineCalculations[]
) =>
  accounts.reduce(
    (
      prev: Account[],
      {
        territories,
        subsidiaries,
        projects,
        ...curr
      }: AccountBeforePipelineCalculations
    ) => [
      ...prev,
      {
        ...curr,
        order: calcOrder(
          getQuotaFromTerritoryOrSubsidaries(territories, subsidiaries),
          calcAccountAndSubsidariesPipeline(accounts, curr.id, projects)
        ),
        latestQuota: getQuotaFromTerritoryOrSubsidaries(
          territories,
          subsidiaries
        ),
        pipeline: calcAccountAndSubsidariesPipeline(
          accounts,
          curr.id,
          projects
        ),
      },
    ],
    []
  );

const fetchAccounts = async () => {
  const { data, errors } = await client.models.Account.list({
    limit: 500,
    selectionSet,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading accounts");
    throw errors;
  }
  try {
    return flow(
      map(mapAccount),
      addOrderNumberToAccounts,
      sortBy((a) => -a.order)
    )(data);
  } catch (error) {
    console.error("fetchAccounts", { error });
    throw error;
  }
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
      introduction: emptyDocument,
      order: 0,
      latestQuota: 0,
      pipeline: 0,
      territoryIds: [],
      createdAt: new Date(),
      payerAccounts: [],
    };

    const updatedAccounts: Account[] = [...(accounts || []), newAccount];
    mutate(updatedAccounts, false);

    const { data, errors } = await client.models.Account.create({
      name: accountName,
      formatVersion: 2,
    });
    if (errors) handleApiErrors(errors, "Error creating account");
    mutate(updatedAccounts);
    return data || undefined;
  };

  const getAccountById = (accountId: string | undefined) =>
    flow(
      identity<Account[] | undefined>,
      find(({ id }) => id === accountId)
    )(accounts);

  const updateAccount = async ({
    id,
    name,
    shortName,
    mainColor,
    crmId,
    introduction,
  }: UpdateAccountProps) => {
    const updAccount: Account | undefined = accounts?.find((a) => a.id === id);
    if (!updAccount) return;

    Object.assign(updAccount, {
      ...(name && { name }),
      ...(shortName && { shortName }),
      ...(mainColor && { mainColor }),
      ...(introduction && { introduction }),
      ...(crmId && { crmId }),
    });

    const updated: Account[] =
      accounts?.map((a) => (a.id === id ? updAccount : a)) || [];
    mutate(updated, false);

    const newAccount = {
      id,
      name,
      shortName,
      mainColor,
      crmId,
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
    if (!data) return;
    toast({
      title: "Account information updated",
      description: `Account ${name} successfully updated (CRM ID: ${crmId}).`,
    });
    return data.id;
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

  const assignTerritory = async (accountId: string, territoryId: string) => {
    const updated: Account[] | undefined = accounts?.map((account) =>
      account.id !== accountId
        ? account
        : { ...account, territoryIds: [...account.territoryIds, territoryId] }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.AccountTerritory.create({
      accountId,
      territoryId,
    });
    if (errors)
      handleApiErrors(errors, "Assigning territory to account failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "Assigned territory",
      description: `Assigned territory to account “${
        accounts?.find((a) => a.id === accountId)?.name
      }”`,
    });
    return data.id;
  };

  const getAccountTerritory = async (
    accountId: string,
    territoryId: string
  ) => {
    const { data: territory, errors: errorsTerritory } =
      await client.models.Territory.get({
        id: territoryId,
      });
    if (errorsTerritory)
      handleApiErrors(errorsTerritory, "Couldn't find territory");
    if (!territory) return;
    const { data, errors } = await territory.accounts();
    if (errors) handleApiErrors(errors, "Couldn't find accounts of territory");
    if (!data) return;
    return data.find((a) => a.accountId === accountId)?.id;
  };

  const deleteTerritory = async (accountId: string, territoryId: string) => {
    const updated: Account[] | undefined = accounts?.map((a) =>
      a.id !== accountId
        ? a
        : {
            ...a,
            territoryIds: a.territoryIds.filter((id) => id !== territoryId),
          }
    );
    if (updated) mutate(updated, false);
    const accountTerritoryId = await getAccountTerritory(
      accountId,
      territoryId
    );
    if (!accountTerritoryId) {
      if (updated) mutate(updated);
      return;
    }
    const { data, errors } = await client.models.AccountTerritory.delete({
      id: accountTerritoryId,
    });
    if (errors)
      handleApiErrors(errors, "Deleting territory from account failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({ title: "Removed territory from account" });
    return data.id;
  };

  const addPayerAccount = async (accountId: string, payer: string) => {
    const updated: Account[] | undefined = accounts?.map((a) =>
      a.id !== accountId
        ? a
        : { ...a, payerAccounts: [...a.payerAccounts, payer] }
    );
    if (updated) mutate(updated, false);
    const resultAccountId = await createPayerAndAccountLink(accountId, payer);
    if (!resultAccountId) return;
    if (updated) mutate(updated);
    toast({
      title: "Payer created",
      description: `Successfully created payer ${payer} for account ${
        accounts?.find((a) => a.id === accountId)?.name
      }.`,
    });
    return resultAccountId;
  };

  const deletePayerAccount = async (accountId: string, payer: string) => {
    const account = accounts?.find((a) => a.id === accountId);
    if (!account) return;
    const updated: Account[] | undefined = accounts?.map((a) =>
      !a.payerAccounts.includes(payer)
        ? a
        : { ...a, payerAccounts: a.payerAccounts.filter((p) => p !== payer) }
    );
    if (updated) mutate(updated, false);
    const data = await deletePayerAccountLink(accountId, payer);
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "Removed payer",
      description: `Successfully removed payer ${payer} from account ${account?.name}.`,
    });
    return data.awsAccountNumberId;
  };

  const getPipelineByControllerId = (controllerId: string): number =>
    !accounts
      ? 0
      : flow(
          filter((a: Account) => a.controller?.id === controllerId),
          map("pipeline"),
          sum
        )(accounts);

  const getAccountNamesByIds = (accountIds: string[]) =>
    flow(
      filter((a: Account) => accountIds.includes(a.id)),
      map((a) => a.name),
      join(", ")
    )(accounts);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        errorAccounts,
        loadingAccounts,
        createAccount,
        getAccountById,
        updateAccount,
        assignController,
        assignTerritory,
        deleteTerritory,
        addPayerAccount,
        deletePayerAccount,
        getPipelineByControllerId,
        getAccountNamesByIds,
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
