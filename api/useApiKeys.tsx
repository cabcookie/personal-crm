import { toast } from "@/components/ui/use-toast";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { client } from "@/lib/amplify";
import { Schema } from "@/amplify/data/resource";

type AiDataSource = Schema["AiDataSource"]["type"];
type ApiKeysForAi = Schema["ApiKeysForAi"]["type"] & { owner: string | null };

const fetchApiKeys = async () => {
  const { data, errors } = await client.models.ApiKeysForAi.list({
    limit: 100,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading API keys");
    throw errors;
  }
  if (!data) throw new Error("fetchApiKeys didn't retrieve data");
  return data;
};

const useApiKeys = () => {
  const {
    data: apiKeys,
    mutate,
    isLoading,
    error,
  } = useSWR("/api/apikeys", fetchApiKeys);

  const createApiKey = async (
    dataSource: AiDataSource,
    itemId: string
  ): Promise<string | undefined> => {
    const apiKey = crypto.randomUUID();
    const updated: ApiKeysForAi[] = [
      ...(apiKeys || []),
      {
        apiKey,
        dataSource,
        itemId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: null,
      },
    ];

    // Optimistic update
    mutate(updated, false);

    const { data, errors } = await client.models.ApiKeysForAi.create({
      apiKey,
      dataSource,
      itemId,
    });

    if (errors) {
      handleApiErrors(errors, "Creating API key failed");
      mutate(apiKeys); // Revert on error
      return undefined;
    }

    mutate(); // Revalidate with server data

    if (!data) return undefined;

    toast({
      title: "API Key created",
      description: `API key for ${dataSource} has been created successfully.`,
    });

    return data.apiKey;
  };

  const deleteApiKey = async (apiKey: string) => {
    // Optimistic update
    const updated = apiKeys?.filter((k) => k.apiKey !== apiKey);
    mutate(updated, false);

    const { data, errors } = await client.models.ApiKeysForAi.delete({
      apiKey,
    });

    if (errors) {
      handleApiErrors(errors, "Deleting API key failed");
      mutate(apiKeys); // Revert on error
      return;
    }

    mutate(); // Revalidate with server data

    toast({
      title: "API Key deleted",
      description: "API key has been deleted successfully.",
    });

    return data?.apiKey;
  };

  const testApiKey = async (apiKey: string): Promise<any> => {
    try {
      const response = await fetch(`/api/data/${apiKey}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log({ result });

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("testApiKey", { error });
      throw error;
    }
  };

  return {
    apiKeys: apiKeys || [],
    createApiKey,
    deleteApiKey,
    testApiKey,
    isLoading,
    error,
  };
};

export default useApiKeys;
