import useApiKeys from "@/api/useApiKeys";
import AccountSelector from "@/components/ui-elements/selectors/account-selector";
import PeopleSelector from "@/components/ui-elements/selectors/people-selector";
import ProjectSelector from "@/components/ui-elements/selectors/project-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";
import { FC, useState } from "react";
import {
  Controller,
  ControllerDialog,
  DataSource,
} from "@/components/api-keys";
import { useAccountsContext } from "@/api/ContextAccounts";

export const CreateApiKeyForm: FC = () => {
  const { createApiKey } = useApiKeys();
  const { getAccountById } = useAccountsContext();

  const [dataSource, setDataSource] = useState<DataSource>("account");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [pendingController, setPendingController] = useState<Controller | null>(
    null
  );

  const handleAccountSelection = (accountId: string | null) => {
    if (!accountId) {
      setSelectedItemId("");
      return;
    }

    // Check for parent account
    const account = getAccountById(accountId);
    if (account?.controller?.id) {
      setPendingController({
        accountId,
        controllerId: account.controller.id,
      });
    } else {
      setSelectedItemId(accountId);
    }
  };

  const handleCreateApiKey = async () => {
    if (!selectedItemId) {
      toast({
        title: "Selection required",
        description: `Please select a ${dataSource} first.`,
        variant: "destructive",
      });
      return;
    }

    await performCreateApiKey(selectedItemId);
  };

  const performCreateApiKey = async (itemId: string) => {
    setIsCreating(true);
    try {
      const apiKey = await createApiKey(dataSource, itemId);
      if (apiKey) {
        setSelectedItemId("");
        toast({
          title: "API Key created",
          description: "Your API key has been created successfully.",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <ControllerDialog
        {...{ pendingController, setPendingController, setSelectedItemId }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>
            Generate a new API key for accessing your data externally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Data Source</Label>
            <Select
              value={dataSource}
              onValueChange={(value) => {
                setDataSource(value as DataSource);
                setSelectedItemId("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="person">Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Select {dataSource.charAt(0).toUpperCase() + dataSource.slice(1)}
            </Label>
            {dataSource === "account" && (
              <AccountSelector
                value={selectedItemId}
                onChange={handleAccountSelection}
                placeholder="Select an account…"
              />
            )}
            {dataSource === "project" && (
              <ProjectSelector
                value={selectedItemId}
                onChange={(id) => setSelectedItemId(id || "")}
                placeholder="Select a project…"
              />
            )}
            {dataSource === "person" && (
              <PeopleSelector
                value={selectedItemId}
                onChange={(id) => setSelectedItemId(id || "")}
                placeholder="Select a person…"
              />
            )}
          </div>

          <Button
            onClick={handleCreateApiKey}
            disabled={!selectedItemId || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create API Key
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
