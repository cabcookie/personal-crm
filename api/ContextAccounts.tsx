import { type Schema } from "@/amplify/data/resource";
import {
  EditorJsonContent,
  transformNotesVersion,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import { toast } from "@/components/ui/use-toast";
import { calcPipeline } from "@/helpers/projects";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { differenceInDays } from "date-fns";
import { max } from "lodash";
import { find, flow, get, map, sortBy, sum } from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type UpdateAccountProps = {
  id: string;
  name?: string;
  crmId?: string;
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
  updateOrder: (accounts: Account[]) => Promise<(string | undefined)[]>;
  addPayerAccount: (
    accountId: string,
    payer: string
  ) => Promise<string | undefined>;
  deletePayerAccount: (payer: string) => Promise<string | undefined>;
}

export type Account = {
  id: string;
  name: string;
  crmId?: string;
  introduction?: EditorJsonContent | string;
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
  "projects.projects.crmProjects.crmProject.id",
  "projects.projects.crmProjects.crmProject.closeDate",
  "projects.projects.crmProjects.crmProject.annualRecurringRevenue",
  "projects.projects.crmProjects.crmProject.totalContractVolume",
  "projects.projects.crmProjects.crmProject.isMarketplace",
  "projects.projects.crmProjects.crmProject.stage",
  "payerAccounts.awsAccountNumber",
] as const;

type AccountData = SelectionSet<Schema["Account"]["type"], typeof selectionSet>;
type TerritoryData = AccountData["territories"][number];
type SubsidiaryData = AccountData["subsidiaries"][number];
type ResponsibilityData =
  TerritoryData["territory"]["responsibilities"][number];

const getLatestQuota = (territories: TerritoryData[]) =>
  flow(
    map(
      (t: TerritoryData) =>
        flow(
          sortBy((r: ResponsibilityData) => -new Date(r.startDate).getTime()),
          find((r) => differenceInDays(new Date(), new Date(r.startDate)) > 0),
          get("quota")
        )(t.territory.responsibilities) || 0
    ),
    sum
  )(territories);

const getQuotaFromTerritoryOrSubsidaries = (
  territories: TerritoryData[],
  subsidiaries: SubsidiaryData[]
) =>
  max([
    getLatestQuota(territories),
    flow(
      map((s: SubsidiaryData) => getLatestQuota(s.territories)),
      sum
    )(subsidiaries),
  ]) || 0;

export const calcOrder = (quota: number, pipeline: number): number =>
  sum([Math.floor(quota / 1000) * 1000, Math.floor(pipeline / 1000)]);

const mapAccount: (account: AccountData) => Account = ({
  id: accountId,
  name,
  crmId,
  controller,
  introduction,
  introductionJson,
  formatVersion,
  territories,
  subsidiaries,
  projects,
  createdAt,
  payerAccounts,
}) => ({
  id: accountId,
  name,
  crmId: crmId || undefined,
  introduction: transformNotesVersion({
    version: formatVersion,
    notes: introduction,
    notesJson: introductionJson,
  }),
  controller,
  latestQuota: getQuotaFromTerritoryOrSubsidaries(territories, subsidiaries),
  pipeline: calcPipeline(projects),
  order: calcOrder(
    getQuotaFromTerritoryOrSubsidaries(territories, subsidiaries),
    calcPipeline(projects)
  ),
  createdAt: new Date(createdAt),
  territoryIds:
    territories.length > 0
      ? territories.map((t) => t.territory.id)
      : subsidiaries.flatMap((s) => s.territories.map((t) => t.territory.id)),
  payerAccounts: payerAccounts.map((p) => p.awsAccountNumber),
});

const fetchAccounts = async () => {
  const { data, errors } = await client.models.Account.list({
    limit: 500,
    selectionSet,
  });
  if (errors) throw errors;
  return flow(
    map(mapAccount),
    sortBy((account) => -account.order)
  )(data);
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

  const getAccountById = (accountId: string) =>
    accounts?.find((account) => account.id === accountId);

  const updateAccount = async ({
    id,
    name,
    crmId,
    introduction,
  }: UpdateAccountProps) => {
    const updAccount: Account | undefined = accounts?.find((a) => a.id === id);
    if (!updAccount) return;

    Object.assign(updAccount, {
      ...(name && { name }),
      ...(introduction && { introduction }),
      ...(crmId && { crmId }),
    });

    const updated: Account[] =
      accounts?.map((a) => (a.id === id ? updAccount : a)) || [];
    mutate(updated, false);

    const newAccount = {
      id,
      name,
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

  const addPayerAccount = async (accountId: string, payer: string) => {
    const updated: Account[] | undefined = accounts?.map((a) =>
      a.id !== accountId
        ? a
        : { ...a, payerAccounts: [...a.payerAccounts, payer] }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PayerAccount.create({
      accountId,
      awsAccountNumber: payer,
    });
    if (errors) handleApiErrors(errors, "Creating payer failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "Payer created",
      description: `Successfully created payer ${payer} for account ${
        accounts?.find((a) => a.id === accountId)?.name
      }.`,
    });
    return data.awsAccountNumber;
  };

  const deletePayerAccount = async (payer: string) => {
    const account = accounts?.find((a) => a.payerAccounts.includes(payer));
    const updated: Account[] | undefined = accounts?.map((a) =>
      !a.payerAccounts.includes(payer)
        ? a
        : { ...a, payerAccounts: a.payerAccounts.filter((p) => p !== payer) }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PayerAccount.delete({
      awsAccountNumber: payer,
    });
    if (errors) handleApiErrors(errors, "Deleting payer failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "Payer deleted",
      description: `Successfully deleted payer ${payer} for account ${account?.name}.`,
    });
    return data.awsAccountNumber;
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
        assignController,
        assignTerritory,
        deleteTerritory,
        updateOrder,
        addPayerAccount,
        deletePayerAccount,
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
