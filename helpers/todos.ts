import { DailyPlanData } from "@/api/useDailyPlans";
import { ProjectActivityData, Todo } from "@/api/useProjectTodos";
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

export const getTodoId = <T extends TodoData>(todo: T) => get("id")(todo);

export const getTodoJson = (todo: TodoData) =>
  flow(identity<TodoData>, get("todo"), JSON.parse, (content) => ({
    ...content,
    attrs: { ...content.attrs, checked: todo.status === "DONE" },
  }))(todo);

export const getTodoStatus = <T extends TodoData>(todo: T) =>
  get("status")(todo) === "DONE";

export const getTodoDoneOn = flow(
  identity<ProjectActivityData["activity"]["noteBlocks"][number]["todo"]>,
  get("doneOn"),
  getDateOrNull
);

export const getTodoProjectIds = flow(
  identity<TodoData>,
  get("activity.activity.forProjects"),
  map("projectsId")
);

export const getTodoActivityId = flow(
  identity<TodoData>,
  get("activity.activity.id")
);

interface ActivityProps {
  noteBlocks: {
    id: string;
    todo: {
      id: string;
    };
  }[];
  noteBlockIds: string[] | null;
}

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

export const getTodoContent = (
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
