import { type Schema } from "@/amplify/data/resource";
import useActivity, { Activity } from "@/api/useActivity";
import ActivityComponent from "@/components/activities/activity";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { generateClient as generateApiClient } from "aws-amplify/api";
import { generateClient } from "aws-amplify/data";
import { debounce } from "lodash";
import { format, isFuture, isPast } from "date-fns";
import { useEffect } from "react";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { generateText } from "@tiptap/core";
import useExtensions from "@/components/ui-elements/editors/notes-editor/useExtensions";
import { Extensions } from "@tiptap/core";

const client = generateClient<Schema>();
const apiClient = generateApiClient<Schema>({ authMode: "userPool" });

const getMeeting = async (meetingId: string) => {
  const { data, errors } = await client.models.Meeting.get(
    { id: meetingId },
    {
      selectionSet: [
        "topic",
        "meetingOn",
        "createdAt",
        "participants.person.name",
        "participants.person.accounts.startDate",
        "participants.person.accounts.endDate",
        "participants.person.accounts.position",
        "participants.person.accounts.account.name",
      ],
    }
  );
  if (errors || !data) return "";
  return [
    `Meeting: ${data.topic} on ${format(data.meetingOn || data.createdAt, "PPP")}`,
    data.participants
      .map((p) =>
        [
          p.person.name,
          p.person.accounts
            .filter(
              (a) =>
                !a.startDate ||
                (isPast(a.startDate) && (!a.endDate || isFuture(a.endDate)))
            )
            .map((pos) => {
              return `${[pos.position, pos.account.name].join(" at ")}`;
            })
            .join(", "),
        ].join(", ")
      )
      .join("\n"),
  ].join("\nParticipants:\n");
};

const getProjects = (activity: Activity) =>
  activity.projects?.map((p) =>
    [p.name, p.accounts.map((a) => a.name).join(", ")].join(" for account(s): ")
  );

const getNotes = (activity: Activity, extensions: Extensions) =>
  generateText(activity.notes ?? emptyDocument, extensions);

const getNameForActivity = async (content: string) => {
  const { data, errors } = await apiClient.generations.chatNamer({
    content,
  });
  if (errors || !data) {
    console.error("Errors or no data", errors);
    return;
  }
  return data.name;
};

const updateActivityName = async (activityId: string, name: string) => {
  console.log({ activityId, name });
  const { data, errors } = await client.models.Activity.update({
    id: activityId,
    name,
  });
  if (errors) console.error("Error updating activity name", errors);
  if (!data) console.error("No data returned from update activity name");
};

const nameActivity = debounce(
  async (activity: Activity, extensions: Extensions) => {
    if (!activity.meetingId) return;
    const meeting = await getMeeting(activity.meetingId);

    const content = [
      [meeting, getProjects(activity)].join("\n\nProject(s):\n"),
      getNotes(activity, extensions),
    ].join("\n\nNotes:\n");

    const name = await getNameForActivity(content);
    if (!name) return;
    await updateActivityName(activity.id, name);
  },
  30000
);

const AccountDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const activityId = Array.isArray(id) ? id[0] : id;
  const { activity } = useActivity(activityId);
  const extensions = useExtensions();

  useEffect(() => {
    if (!activity) return;
    if (!extensions) return;
    nameActivity(activity, extensions);
  }, [activity, extensions]);

  return (
    <MainLayout
      title={
        activity?.name ??
        `Activity${
          !activity ? "" : ` on ${format(activity.finishedOn, "PPP")}`
        }`
      }
      recordName={`Activity${
        !activity ? "" : ` on ${format(activity.finishedOn, "PPP")}`
      }`}
      sectionName="Activities"
    >
      <div className="space-y-6">
        {activityId && (
          <ActivityComponent
            activityId={activityId}
            notesNotInAccordion
            showDates
            showMeeting
            allowAddingProjects
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AccountDetailPage;
