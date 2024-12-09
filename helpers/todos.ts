import { Schema } from "@/amplify/data/resource";
import { DailyPlanData, DailyPlanStatus } from "@/api/useDailyPlans";
import { Todo } from "@/api/useProjectTodos";
import { JSONContent } from "@tiptap/core";
import { filter, flow, get, identity, includes, map, size } from "lodash/fp";
import { getDateOrNull } from "./functional";

type DailyPlanTodoData = DailyPlanData["todos"][number]["todo"];

export interface TodoData {
  id: string;
  todo: DailyPlanTodoData["todo"];
  status: DailyPlanTodoData["status"];
  doneOn: string | null;
}

export const getTodoId = (todo: { id: string }) => get("id")(todo);

export const getTodoJson = (todo: {
  todo: Schema["Todo"]["type"]["todo"];
  status: DailyPlanStatus;
}) =>
  flow(get("todo"), JSON.parse, (content) => ({
    ...content,
    attrs: { ...content.attrs, checked: todo.status === "DONE" },
  }))(todo);

export const getTodoStatus = (todo: { status: DailyPlanStatus }) =>
  get("status")(todo) === "DONE";

export const getTodoDoneOn = (todo: { doneOn?: string | null }) =>
  flow(get("doneOn"), getDateOrNull)(todo);

export const getTodoProjectIds = (todo: {
  activity: { activity: { forProjects?: { projectsId: string }[] } };
}) => flow(get("activity.activity.forProjects"), map("projectsId"))(todo);

export const getTodoActivityId = (todo: {
  activity: { activity: { id: string } };
}) => get("activity.activity.id")(todo);

interface ActivityProps {
  noteBlocks: {
    id: string;
    todo: {
      id: string;
    };
  }[];
  noteBlockIds: string[] | null;
}

export const notAnOrphan = (activity: ActivityProps) => (todo: TodoData) =>
  !todoIsOrphan(todo, activity);

export const todoIsOrphan = (todo: TodoData, activity: ActivityProps) =>
  flow(
    identity<ActivityProps>,
    get("noteBlocks"),
    filter(
      (noteBlock) =>
        flow(get("todo.id"))(noteBlock) === todo.id &&
        flow(get("noteBlockIds"), includes(noteBlock.id))(activity)
    ),
    size
  )(activity) === 0;

const getParagraphWithLinkToActivity = (activityId: string): JSONContent => ({
  type: "paragraph",
  content: [
    {
      type: "text",
      marks: [
        { type: "italic" },
        {
          type: "link",
          attrs: {
            rel: "noopener noreferrer nofollow",
            href: `/activities/${activityId}`,
          },
        },
      ],
      text: "Details",
    },
  ],
});

const getTodoContent = (
  content: JSONContent[] | undefined,
  activityId: string
) => [...(content || []), getParagraphWithLinkToActivity(activityId)];

export const getTodoViewerContent = (todos: Todo[]): JSONContent => ({
  type: "doc",
  content: [
    {
      type: "taskList",
      content: todos.map(({ todo, todoId, blockId, activityId }) => ({
        ...todo,
        content: getTodoContent(todo.content, activityId),
        attrs: {
          ...todo.attrs,
          blockId,
          todoId,
        },
      })),
    },
  ],
});
