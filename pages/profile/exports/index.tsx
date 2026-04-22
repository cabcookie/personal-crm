import { FC } from "react";
import SettingsLayout from "@/components/layouts/SettingsLayout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportHistoryList } from "@/components/exports/ExportHistoryList";
import { RecurringExportList } from "@/components/exports/RecurringExportList";
import { Clock, RefreshCw, RefreshCwOff } from "lucide-react";

const ExportsPage: FC = () => (
  <SettingsLayout>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Exports</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your data exports
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="size-4" />
            Export History
          </TabsTrigger>
          <TabsTrigger
            value="recurring-active"
            className="flex items-center gap-2"
          >
            <RefreshCw className="size-4" />
            Recurring (Active)
          </TabsTrigger>
          <TabsTrigger
            value="recurring-inactive"
            className="flex items-center gap-2"
          >
            <RefreshCwOff className="size-4" />
            Recurring (Inactive)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              One-time exports are automatically deleted after 7 days.
            </p>
            <ExportHistoryList />
          </div>
        </TabsContent>
        <TabsContent value="recurring-active" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Recurring exports run on a schedule and store results in S3.
            </p>
            <RecurringExportList status="active" />
          </div>
        </TabsContent>
        <TabsContent value="recurring-inactive" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Inactive recurring exports are paused and do not run on a
              schedule.
            </p>
            <RecurringExportList status="inactive" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </SettingsLayout>
);

export default ExportsPage;
