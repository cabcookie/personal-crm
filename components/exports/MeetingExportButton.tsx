import { FC, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { fetchAuthSession } from "aws-amplify/auth";
import type { Schema } from "@/amplify/data/resource";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { handleApiErrors } from "@/api/globals";

const client = generateClient<Schema>();

interface MeetingExportButtonProps {
  meetingId: string;
  meetingTopic: string | null | undefined;
  meetingOn: Date | string | null | undefined;
}

export const MeetingExportButton: FC<MeetingExportButtonProps> = ({
  meetingId,
  meetingTopic,
  meetingOn,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async () => {
    setIsCreating(true);
    try {
      const { identityId } = await fetchAuthSession();
      if (!identityId) {
        toast({
          title: "Export failed",
          description: "Could not resolve your identity. Please sign in again.",
          variant: "destructive",
        });
        return;
      }

      // The meeting renderer filters by meetingId, not by date — but the
      // schema requires startDate/endDate, so we anchor both to the meeting's
      // own date (falling back to now) for traceability in the task record.
      const anchor = meetingOn ? new Date(meetingOn) : new Date();
      const iso = anchor.toISOString();
      const ttl = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

      const { errors } = await client.models.ExportTask.create({
        dataSource: "meeting",
        itemId: meetingId,
        itemName: meetingTopic || "Meeting",
        status: "CREATED",
        startDate: iso,
        endDate: iso,
        ttl,
        identityId,
      });

      if (errors) {
        handleApiErrors(errors, "Failed creating export task");
        return;
      }

      toast({
        title: "Export started",
        description: "You'll be notified when the export is ready.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      onClick={handleClick}
      disabled={isCreating}
    >
      {isCreating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Export for AI
    </Button>
  );
};
