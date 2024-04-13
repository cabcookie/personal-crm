import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
const client = generateClient<Schema>();

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

const useAccounts = () => {
  const {
    data: accounts,
    error: errorAccounts,
    isLoading: loadingAccounts,
    mutate: mutateAccounts,
  } = useSWR("/api/accounts", fetchAccounts);

  const createAccount = async (accountName: string) => {
    const newAccount: Account = { id: crypto.randomUUID(), name: accountName };
    const updated: Account[] = [...(accounts || []), newAccount];
    mutateAccounts(updated, false);
    await client.models.Account.create(newAccount);
    mutateAccounts(updated);
  };

  return { accounts, errorAccounts, loadingAccounts, createAccount };
};

export default useAccounts;
