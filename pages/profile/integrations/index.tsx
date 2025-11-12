import SettingsLayout from "@/components/layouts/SettingsLayout";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import { ApiKeysList, CreateApiKeyForm } from "@/components/api-keys";

const ProfileIntegrationsPage: FC = () => (
  <SettingsLayout>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Manage API keys for external integrations.
        </p>
      </div>
      <Separator />

      <CreateApiKeyForm />
      <ApiKeysList />
    </div>
  </SettingsLayout>
);

export default ProfileIntegrationsPage;
