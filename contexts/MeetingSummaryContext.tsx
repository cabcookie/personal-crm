import { FC, ReactNode, createContext, useContext, useEffect } from "react";
import { client } from "@/lib/amplify";
import { toast } from "@/components/ui/use-toast";
import MeetingSummaryNotificationAction from "@/components/meetings/meeting-summary-notification-action";

const MeetingSummaryContext = createContext({});

export const useMeetingSummaryContext = () => useContext(MeetingSummaryContext);

type MeetingSummaryProviderProps = {
  children: ReactNode;
};

/**
 * Global notifier for async meeting-summary runs (see
 * amplify/functions/summarize-meeting). Mirrors api/ContextExports.tsx:
 * mounted once at the app root so the toast fires regardless of which page
 * the user is on when the summary finishes, with an action to jump straight
 * to the meeting.
 */
export const MeetingSummaryProvider: FC<MeetingSummaryProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    const subscription = client.models.Meeting.onUpdate().subscribe({
      next: (data) => {
        if (data.sonicSummaryStatus === "DONE") {
          toast({
            title: "Summary ready",
            description: data.topic
              ? `The summary for “${data.topic}” is ready.`
              : "The meeting summary is ready.",
            duration: 30000,
            action: <MeetingSummaryNotificationAction meetingId={data.id} />,
          });
        } else if (data.sonicSummaryStatus === "ERROR") {
          toast({
            title: "Summary failed",
            description: data.sonicSummaryError
              ? `${data.topic ? `“${data.topic}”: ` : ""}${data.sonicSummaryError}`
              : "The summary could not be created.",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        console.error("Error in Meeting summary subscription:", error);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <MeetingSummaryContext.Provider value={{}}>
      {children}
    </MeetingSummaryContext.Provider>
  );
};
