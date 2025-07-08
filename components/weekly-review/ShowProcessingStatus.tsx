import { FC } from "react";

interface ShowProcessingStatusProps {
  processingStatus: string;
}

export const ShowProcessingStatus: FC<ShowProcessingStatusProps> = ({
  processingStatus,
}) => {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm font-medium">Processing...</span>
      </div>
      <div className="text-sm text-muted-foreground">{processingStatus}</div>
    </div>
  );
};
