import { Activity } from "@/api/useActivity";
import { debounce } from "lodash";
import { format, isFuture, isPast } from "date-fns";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { generateText } from "@tiptap/core";
import { Extensions } from "@tiptap/core";

import { client } from "@/lib/amplify";

export const nameActivity = debounce(
  async (activity: Activity, extensions: Extensions) => {
    if (!activity.meetingId) return;
    const meeting = await getMeeting(activity.meetingId);
    const projects = await getProjects(activity);

    const content = [
      [meeting, projects].join("\n\nProject(s):\n"),
      getNotes(activity, extensions),
    ].join("\n\nNotes:\n");

    const name = await getNameForActivity(content);
    if (!name) return;
    await updateActivityName(activity.id, name);
  },
  30000
);

const updateActivityName = async (activityId: string, name: string) => {
  console.log({ activityId, name });
  const { data, errors } = await client.models.Activity.update({
    id: activityId,
    name,
  });
  if (errors) console.error("Error updating activity name", errors);
  if (!data) console.error("No data returned from update activity name");
};

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

const getProject = async (projectId: string) => {
  const { data, errors } = await client.models.Projects.get(
    { id: projectId },
    { selectionSet: ["project", "accounts.account.name"] }
  );
  if (errors || !data) {
    console.error("Error getting project", errors);
    return;
  }
  return data;
};

const getProjects = async (activity: Activity) => {
  const projects = await Promise.all(
    activity.projects.map((p) => getProject(p.projectsId))
  );
  return projects
    .filter((p) => !!p)
    .map((p) =>
      [p.project, p.accounts.map((a) => a.account.name).join(", ")].join(
        " for account(s): "
      )
    );
};

const getNotes = (activity: Activity, extensions: Extensions) =>
  generateText(activity.notes ?? emptyDocument, extensions);

const getNameForActivity = async (content: string) => {
  const { data, errors } = await client.generations.chatNamer({
    content,
  });
  if (errors || !data) {
    console.error("Errors or no data", errors);
    return;
  }
  return data.name;
};
