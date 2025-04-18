import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { generateClient } from "aws-amplify/data";
import { flow, get, identity } from "lodash/fp";
const client = generateClient<Schema>();

export const createPayerAndAccountLink = async (
  accountId: string,
  payerId: string
) => {
  const payerAccountId = await getOrCreatePayerAccount(payerId);
  if (!payerAccountId) return;
  return createPayerAccountLink(accountId, payerAccountId);
};

export const deletePayerAccountLink = async (
  accountId: string,
  payer: string
) => {
  const payerAccountId = await getAccountPayerAccountId(accountId, payer);
  if (!payerAccountId) return;
  const { data, errors } = await client.models.AccountPayerAccount.delete({
    id: payerAccountId,
  });
  if (errors) handleApiErrors(errors, "Deleting payer failed");
  return data;
};

const getOrCreatePayerAccount = async (payerId: string) => {
  const { data, errors } = await client.models.PayerAccount.get({
    awsAccountNumber: payerId,
  });
  if (errors) {
    handleApiErrors(errors, "Loading payer account failed");
    throw errors;
  }
  if (data) return data.awsAccountNumber;
  return createPayerAccount(payerId);
};

const createPayerPersonLink = async (
  personId: string | null,
  payerId: string
) => {
  const { data, errors } = await client.models.PayerAccount.update({
    awsAccountNumber: payerId,
    mainContactId: personId,
  });
  if (errors) {
    handleApiErrors(errors, "Linking person to paye failed");
    throw errors;
  }
  return data?.awsAccountNumber;
};

const createPayerAccountLink = async (accountId: string, payerId: string) => {
  const { data, errors } = await client.models.AccountPayerAccount.create({
    accountId,
    awsAccountNumberId: payerId,
  });
  if (errors) {
    handleApiErrors(errors, "Creating payer account link failed");
    throw errors;
  }
  return data?.awsAccountNumberId;
};

const getAccountPayerAccountId = async (accountId: string, payerId: string) => {
  const { data, errors } =
    await client.models.AccountPayerAccount.listAccountPayerAccountByAwsAccountNumberId(
      {
        awsAccountNumberId: payerId,
      },
      { filter: { accountId: { eq: accountId } }, limit: 1 }
    );
  if (errors) {
    handleApiErrors(errors, "Loading payer account link failed");
    throw errors;
  }
  return flow(
    identity<Schema["AccountPayerAccount"]["type"][]>,
    get(0),
    get("id")
  )(data);
};

const createPayerAccount = async (payerId: string) => {
  const { data, errors } = await client.models.PayerAccount.create({
    awsAccountNumber: payerId,
  });
  if (errors) {
    handleApiErrors(errors, "Creating payer account failed");
    throw errors;
  }
  return data?.awsAccountNumber;
};
