import { Schema } from "@/amplify/data/resource";
import useApiKeys from "@/api/useApiKeys";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import { ApiKey } from "./api-key";

export type DataSource = Schema["AiDataSource"]["type"];

export const ApiKeysList: FC = () => {
  const { apiKeys, isLoading } = useApiKeys();

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Your API Keys</h4>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              No API keys created yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        apiKeys.map((key) => <ApiKey key={key.apiKey} apiKey={key} />)
      )}
    </div>
  );
};
