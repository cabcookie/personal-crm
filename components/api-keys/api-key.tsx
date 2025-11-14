import { Schema } from "@/amplify/data/resource";
import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import usePeople from "@/api/usePeople";
import { Card, CardContent } from "@/components/ui/card";
import { FC, useState } from "react";
import { ApiKeyToCopy, DataSource, DeleteApiKeyBtn, TestApiKeyBtn } from ".";

interface ApiKeyProps {
  apiKey: Schema["ApiKeysForAi"]["type"];
}

export const ApiKey: FC<ApiKeyProps> = ({ apiKey }) => {
  const [testResult, setTestResult] = useState<any>(null);

  const { accounts } = useAccountsContext();
  const { projects } = useProjectsContext();
  const { people } = usePeople();

  const getItemName = (
    dataSource: DataSource,
    itemId: string
  ): string | undefined => {
    switch (dataSource) {
      case "account":
        return accounts?.find((a) => a.id === itemId)?.name;
      case "project":
        return projects?.find((p) => p.id === itemId)?.project;
      case "person":
        return people?.find((p) => p.id === itemId)?.name;
      default:
        return undefined;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              {/* API TYPE and NAME */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {apiKey.dataSource}
                </span>
                <span className="text-sm font-medium">
                  {getItemName(apiKey.dataSource, apiKey.itemId) || "Unknown"}
                </span>
              </div>

              {/* API KEY VALUE TO COPY */}
              <ApiKeyToCopy apiKey={apiKey.apiKey} />
            </div>

            {/* TEST or DELETE the API KEY */}
            <div className="flex gap-2">
              <TestApiKeyBtn apiKey={apiKey.apiKey} onResult={setTestResult} />
              <DeleteApiKeyBtn apiKey={apiKey.apiKey} />
            </div>
          </div>

          {/* Show the API Key TEST RESULT */}
          {testResult && (
            <div className="text-xs bg-muted p-3 rounded-md">
              <pre className="overflow-auto max-h-60">{testResult}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
