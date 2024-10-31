import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { generateClient } from "aws-amplify/data";
import { flow, identity, get } from "lodash/fp";
const client = generateClient<Schema>();

export const getOrCreatePayerAccount = async (payerId: string) => {
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

export const createPayerAccountLink = async (
  accountId: string,
  payerId: string
) => {
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

export const createPayerAndAccountLink = async (
  accountId: string,
  payerId: string
) => {
  const payerAccountId = await getOrCreatePayerAccount(payerId);
  if (!payerAccountId) return;
  return createPayerAccountLink(accountId, payerAccountId);
};

export const getAccountPayerAccountId = async (
  accountId: string,
  payerId: string
) => {
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
