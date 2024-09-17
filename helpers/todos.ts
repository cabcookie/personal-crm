import { DailyPlanData } from "@/api/useDailyPlans";
import { ProjectActivityData, Todo } from "@/api/useProjectTodos";
import { JSONContent } from "@tiptap/core";
import { filter, flow, get, identity, includes, map, size } from "lodash/fp";
import { getDateOrNull } from "./functional";

type DailyPlanTodoData = DailyPlanData["todos"][number]["todo"];

interface TodoData {
  id: string;
  todo: DailyPlanTodoData["todo"];
  status: DailyPlanTodoData["status"];
  doneOn: string | null;
}

export const getTodoId = <T extends TodoData>(todo: T) => get("id")(todo);

export const getTodoJson = flow(identity<TodoData>, get("todo"), JSON.parse);

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

export const todoIsOrphan = (
  todo: TodoData,
  activity: ProjectActivityData["activity"]
) =>
  flow(
    identity<ProjectActivityData["activity"]>,
    get("noteBlocks"),
    filter(
      (noteBlock: ProjectActivityData["activity"]["noteBlocks"][number]) =>
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

const getTodoOrphanParagraph = (): JSONContent => ({
  type: "paragraph",
  content: [
    {
      type: "text",
      text: "Orphan",
      marks: [{ type: "bold" }, { type: "highlight" }],
    },
  ],
});

export const getTodoEditorContent = (todos: Todo[]): JSONContent => ({
  type: "doc",
  content: [
    {
      type: "taskList",
      content: todos.map(({ todo, todoId, blockId, activityId, isOrphan }) => ({
        ...todo,
        content: [
          ...(todo.content ?? []),
          isOrphan
            ? getTodoOrphanParagraph()
            : getParagraphWithLinkToActivity(activityId),
        ],
        attrs: {
          ...todo.attrs,
          blockId,
          todoId,
        },
      })),
    },
  ],
});
