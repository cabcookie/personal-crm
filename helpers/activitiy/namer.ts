import { type Schema } from "@/amplify/data/resource";
import { Activity } from "@/api/useActivity";
import { generateClient as generateApiClient } from "aws-amplify/api";
import { generateClient } from "aws-amplify/data";
import { debounce } from "lodash";
import { format, isFuture, isPast } from "date-fns";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { generateText } from "@tiptap/core";
import { Extensions } from "@tiptap/core";

const client = generateClient<Schema>();
const apiClient = generateApiClient<Schema>({ authMode: "userPool" });

export const nameActivity = debounce(
  async (
    activity: Activity,
    extensions: Extensions,
    updateName: (name: string) => Promise<void>
  ) => {
    let meeting = "";
    const notes = getNotes(activity, extensions);
    if (notes.length < 20) return;
    if (activity.meetingId) meeting = await getMeeting(activity.meetingId);
    const projects = await getProjects(activity);

    const content = [[meeting, projects].join("\n\nProject(s):\n"), notes].join(
      "\n\nNotes:\n"
    );

    const name = await getNameForActivity(content);
    if (!name) return;
    updateName(name);
  },
  20000
);

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
  const { data, errors } = await apiClient.generations.chatNamer({
    content,
  });
  if (errors || !data) {
    console.error("Errors or no data", errors);
    return;
  }
  return data.name;
};
