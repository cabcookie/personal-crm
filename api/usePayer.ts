import { type Schema } from "@/amplify/data/resource";
import {
  createPayerAndAccountLink,
  deletePayerAccountLink,
} from "@/helpers/payers/api-actions";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { map } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type PayerData = SelectionSet<
  Schema["PayerAccount"]["type"],
  typeof selectionSet
>;

const selectionSet = [
  "awsAccountNumber",
  "accounts.accountId",
  "resellerId",
  "mainContactId",
] as const;

export type Payer = {
  accountNumber: string;
  isReseller: boolean;
  resellerId?: string;
  accountIds: string[];
  mainContactId?: string;
};

const mapPayer = ({
  awsAccountNumber,
  accounts,
  resellerId,
  mainContactId,
}: PayerData): Payer => ({
  accountNumber: awsAccountNumber,
  isReseller: !!resellerId,
  resellerId: resellerId ?? undefined,
  accountIds: map(({ accountId }) => accountId)(accounts) ?? [],
  mainContactId: mainContactId ?? undefined,
});

const fetchPayer = (payerId?: string) => async () => {
  if (!payerId) return;
  const { data, errors } = await client.models.PayerAccount.get(
    {
      awsAccountNumber: payerId,
    },
    { selectionSet }
  );
  if (errors) {
    handleApiErrors(errors, "Loading Payer failed");
    throw errors;
  }
  if (!data) return;

  try {
    return mapPayer(data);
  } catch (error) {
    console.error("fetchPayer", error);
    throw error;
  }
};

const usePayer = (payerId?: string) => {
  const {
    data: payer,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/payers/${payerId}`, fetchPayer(payerId));

  const createPayerAccountLink = async (accountId: string | null) => {
    if (!accountId) return;
    if (!payer) return;
    const updatedPayer = {
      ...payer,
      accountIds: [...payer.accountIds, accountId],
    } as Payer;
    mutate(updatedPayer, false);
    await createPayerAndAccountLink(accountId, payer.accountNumber);
    mutate(updatedPayer);
  };

  const deletePayerAccount = async (accountId: string) => {
    if (!payer) return;
    const updated = {
      ...payer,
      accountIds: payer.accountIds.filter((p) => p !== accountId),
    } as Payer;
    mutate(updated, false);
    await deletePayerAccountLink(accountId, payer.accountNumber);
    mutate(updated);
  };

  const attachReseller = async (resellerId: string | null) => {
    if (!resellerId) return;
    if (!payer) return;
    const updatedPayer = { ...payer, resellerId } as Payer;
    mutate(updatedPayer, false);
    const { data, errors } = await client.models.PayerAccount.update({
      awsAccountNumber: payer.accountNumber,
      resellerId,
    });
    if (errors) handleApiErrors(errors, "Attaching reseller failed");
    mutate(updatedPayer);
    return data;
  };

  return {
    payer,
    isLoading,
    error,
    createPayerAccountLink,
    deletePayerAccount,
    attachReseller,
  };
};

export default usePayer;
