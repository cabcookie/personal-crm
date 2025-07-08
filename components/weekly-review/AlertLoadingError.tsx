import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const AlertLoadingError = () => (
  <Alert variant="destructive">
    <AlertTitle>
      <div className="flex flex-row gap-2">
        <AlertTriangle className="size-6" />
        <div className="text-base font-bold">Error Loading Weekly Reviews</div>
      </div>
    </AlertTitle>
    <AlertDescription>
      Impossible to load weekly reviews. Do you have an internet connection? Try
      again later.
    </AlertDescription>
  </Alert>
);
