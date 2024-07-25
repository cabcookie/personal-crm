import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { HandleMutationFn, mapInbox } from "./useInbox";
const client = generateClient<Schema>();

const fetchInboxItem = (itemId?: string) => async () => {
  if (!itemId) return;
  const { data, errors } = await client.models.Inbox.get({ id: itemId });
  if (errors) {
    handleApiErrors(errors, "Error loading inbox item");
    throw errors;
  }
  if (!data) throw new Error("fetchInboxItem didn't retrieve data");
  return mapInbox(data);
};

const useInboxItem = (itemId?: string) => {
  const {
    data: inboxItem,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/inbox/${itemId}`, fetchInboxItem(itemId));

  const handleMutation: HandleMutationFn = (item, callApi = true) => {
    mutate(item, callApi);
  };

  return {
    inboxItem,
    error,
    isLoading,
    mutate: handleMutation,
  };
};

export default useInboxItem;
