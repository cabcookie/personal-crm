import { FC, ReactNode, createContext, useContext, useEffect } from "react";
import { client } from "@/lib/amplify";
import { toast } from "@/components/ui/use-toast";
import { useExports } from "./useExports";
import { ExportActions } from "@/components/exports/ExportActions";

const ExportsContext = createContext({});

export const useExportsContext = () => useContext(ExportsContext);

interface ExportsProviderProps {
  children: ReactNode;
}

export const ExportsProvider: FC<ExportsProviderProps> = ({ children }) => {
  const { mutate } = useExports();

  useEffect(() => {
    // Subscribe to updates on ExportTask model
    const subscription = client.models.ExportTask.onUpdate().subscribe({
      next: (data) => {
        console.log("ExportTask updated:", data);

        if (data.status === "GENERATED") {
          // Show toast notification when export is ready
          if (data.error) {
            // Export failed
            toast({
              title: "Export failed",
              description: `Export for ${data.itemName} failed: ${data.error}`,
              variant: "destructive",
            });
          } else if (data.result) {
            // Export succeeded - show action buttons
            toast({
              title: "Export ready",
              description: `Export for ${data.itemName} is ready`,
              action: (
                <ExportActions
                  taskId={data.id}
                  result={data.result}
                  itemName={data.itemName || ""}
                  dataSource={data.dataSource || ""}
                  variant="outline"
                  size="sm"
                  showLabels={false}
                />
              ),
            });
          }

          // Refresh the SWR cache
          mutate();
        }
      },
      error: (error) => {
        console.error("Error in ExportTask subscription:", error);
      },
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("Unsubscribing from ExportTask updates");
      subscription.unsubscribe();
    };
  }, [mutate]);

  return (
    <ExportsContext.Provider value={{}}>{children}</ExportsContext.Provider>
  );
};
