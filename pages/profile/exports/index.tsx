import { FC } from "react";
import SettingsLayout from "@/components/layouts/SettingsLayout";
import { Separator } from "@/components/ui/separator";
import { ExportHistoryList } from "@/components/exports/ExportHistoryList";

const ExportsPage: FC = () => (
  <SettingsLayout>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Export History</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your data exports. Exports are automatically deleted
          after 7 days.
        </p>
      </div>
      <Separator />
      <ExportHistoryList />{" "}
    </div>
  </SettingsLayout>
);

export default ExportsPage;
