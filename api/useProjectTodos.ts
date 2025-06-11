import { type Schema } from "@/amplify/data/resource";
import { stringifyBlock } from "@/components/ui-elements/editors/helpers/blocks";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { getPeopleMentioned } from "@/components/ui-elements/editors/helpers/mentioned-people-cud";
import {
  isNotNil,
  newDateString,
  newDateTimeString,
} from "@/helpers/functional";
import {
  getTodoDoneOn,
  getTodoId,
  getTodoJson,
  getTodoStatus,
  notAnOrphan,
} from "@/helpers/todos";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import {
  filter,
  flatMap,
  flow,
  get,
  identity,
  includes,
  map,
  sortBy,
  join,
  trim,
} from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import {
  createActivityApi,
  createProjectActivityApi,
  updateActivityBlockIds,
} from "./helpers/activity";
import { createMentionedPersonApi } from "./helpers/people";
import { createBlockApi, createTodoApi } from "./helpers/todo";
const client = generateClient<Schema>();

export type Todo = {
  todoId: string;
  todo: JSONContent;
  done: boolean;
  doneOn: Date | null;
  activityId: string;
  blockId?: string;
  updatedAt: Date;
};

export type ProjectTodo = Todo & {
  projectActivityId: string;
};

const selectionSet = [
  "id",
  "activity.id",
  "activity.noteBlockIds",
  "activity.noteBlocks.id",
  "activity.noteBlocks.todo.id",
  "activity.noteBlocks.todo.todo",
  "activity.noteBlocks.todo.status",
  "activity.noteBlocks.todo.doneOn",
  "activity.noteBlocks.todo.updatedAt",
] as const;

export type ProjectActivityData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;
type TodoData = ProjectActivityData["activity"]["noteBlocks"][number]["todo"];

const activeNoteBlock = (activity: ProjectActivityData["activity"]) =>
  flow(
    identity<ProjectActivityData["activity"]["noteBlocks"][number]>,
    (noteBlock) =>
      flow(
        identity<ProjectActivityData["activity"]>,
        get("noteBlockIds"),
        includes(noteBlock.id)
      )(activity)
  );

const mapProjectTodo = ({
  id: projectActivityId,
  activity,
}: ProjectActivityData): ProjectTodo[] =>
  flow(
    identity<ProjectActivityData["activity"]>,
    get("noteBlocks"),
    filter(activeNoteBlock(activity)),
    map("todo"),
    filter(isNotNil),
    filter(notAnOrphan(activity)),
    map((todo: TodoData) => ({
      projectActivityId,
      todoId: getTodoId(todo),
      todo: getTodoJson(todo),
      done: getTodoStatus(todo),
      doneOn: getTodoDoneOn(todo),
      activityId: activity.id,
      updatedAt: new Date(todo.updatedAt),
    }))
  )(activity);

const makeDateNumber = (date: Date) => parseInt(format(date, "yyyyMMdd"));

interface GetTodoOrder {
  done: boolean;
  doneOn: Date | null;
  updatedAt: Date;
}
export const getTodoOrder = <T extends GetTodoOrder>({
  done,
  doneOn,
  updatedAt,
}: T) =>
  [
    [done ? 0 : 1, 1],
    [makeDateNumber(doneOn ?? updatedAt), 100000000],
  ].reduce((acc, curr) => acc * curr[1] - curr[0], 0);

const fetchProjectTodos = (projectId: string | undefined) => async () => {
  if (!projectId) return;
  const { data, errors } =
    await client.models.ProjectActivity.listProjectActivityByProjectsId(
      {
        projectsId: projectId,
      },
      { selectionSet }
    );
  if (errors) throw errors;
  if (!data) throw new Error("fetchProjectTodos didn't retrieve data");
  try {
    return flow(
      flatMap(mapProjectTodo),
      sortBy(getTodoOrder<ProjectTodo>)
    )(data);
  } catch (error) {
    console.error("fetchProjectTodos", { error });
    throw error;
  }
};
const useProjectTodos = (projectId: string | undefined) => {
  const {
    data: projectTodos,
    isLoading,
    error,
    mutate,
  } = useSWR(`/project-todos/${projectId}`, fetchProjectTodos(projectId));

  const finishTodo = async (todoId: string, done: boolean) => {
    const updated = projectTodos?.map((t) =>
      t.todoId !== todoId ? t : { ...t, done }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Todo.update({
      id: todoId,
      status: done ? "DONE" : "OPEN",
      doneOn: done ? newDateString() : null,
    });
    if (errors) handleApiErrors(errors, "Updating todo's done state failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const createTodoRecord = async (todo: JSONContent) => {
    const { data, errors } = await createTodoApi(stringifyBlock(todo), false);
    if (errors) handleApiErrors(errors, "Creating todo failed");
    return data;
  };

  const createNoteBlockRecord = async (activityId: string, todoId: string) => {
    const { data, errors } = await createBlockApi(
      activityId,
      null,
      todoId,
      "taskItem"
    );
    if (errors) handleApiErrors(errors, "Creating note block failed");
    return data?.id;
  };

  const createMentionedPerson =
    (blockId: string) =>
    async (personId: string): Promise<string | undefined> => {
      const { data, errors } = await createMentionedPersonApi(
        blockId,
        personId
      );
      if (errors) handleApiErrors(errors, "Creating mentioned person failed");
      return data?.id;
    };

  const createMentionedPeople = async (blockId: string, todo: JSONContent) => {
    const peopleIds = await Promise.all(
      flow(
        getPeopleMentioned,
        map("attrs.id"),
        map(createMentionedPerson(blockId))
      )(todo)
    );
    return peopleIds;
  };

  const createTodo = async (todo: JSONContent) => {
    if (!projectId) return;
    const activity = await createActivityApi();
    if (!activity) return;
    const projectActivity = await createProjectActivityApi(
      projectId,
      activity.id
    );
    if (!projectActivity) return;
    const todoBlock = {
      type: "taskItem",
      attrs: {
        checked: false,
      },
      content: todo.content,
    } as JSONContent;
    const todoData = await createTodoRecord(todoBlock);
    if (!todoData) return;
    const blockId = await createNoteBlockRecord(activity.id, todoData.id);
    if (!blockId) return;
    const updatedActivity = await updateActivityBlockIds(activity.id, [
      blockId,
    ]);
    if (!updatedActivity) return;
    await createMentionedPeople(blockId, todo);
    mutate([
      ...(projectTodos ?? []),
      {
        todoId: todoData.id,
        todo: todoBlock,
        done: false,
        doneOn: null,
        activityId: activity.id,
        blockId,
        updatedAt: new Date(),
        projectActivityId: projectActivity.id,
      },
    ]);
    return todoData.id;
  };

  /**
   * Extracts text content from all open (non-done) project todos
   * and concatenates them into a single string for AI processing
   */
  const generateTasksText = (): string => {
    if (!projectTodos) return "";

    return flow(
      filter((t: ProjectTodo) => !t.done),
      map("todo"),
      map(getTextFromJsonContent),
      map(trim),
      join("\n")
    )(projectTodos);
  };

  /**
   * Checks if the task summary should be regenerated based on
   * comparing timestamps of the summary vs. open todos
   */
  const shouldRegenerateSummary = (
    project: Schema["Projects"]["type"] | null | undefined
  ): boolean => {
    if (!project || !projectTodos) return false;

    // If no summary exists yet, we should generate one
    if (!project.tasksSummary || !project.tasksSummaryUpdatedAt) {
      return projectTodos.some((t) => !t.done); // Only if there are open todos
    }

    // Get the summary timestamp
    const summaryTimestamp = new Date(project.tasksSummaryUpdatedAt);

    // Check if any open todo has been updated more recently than the summary
    const openTodos = projectTodos.filter((t) => !t.done);
    return openTodos.some((todo) => todo.updatedAt > summaryTimestamp);
  };

  /**
   * Generates a new task summary using the AI generation function
   */
  const generateTasksSummary = async (): Promise<string | null> => {
    const tasksText = generateTasksText();

    if (!tasksText.trim()) {
      return null; // No open tasks to summarize
    }

    try {
      const { data, errors } = await client.generations.generateTasksSummary({
        tasks: tasksText,
      });

      if (errors) {
        console.error("Error generating tasks summary:", errors);
        handleApiErrors(errors, "Generating tasks summary failed");
        return null;
      }

      return data?.summary || null;
    } catch (error) {
      console.error("Error calling generateTasksSummary:", error);
      return null;
    }
  };

  /**
   * Gets existing summary or generates a new one if needed,
   * with smart caching based on todo update timestamps
   */
  const getOrGenerateTasksSummary = async (
    projectId: string
  ): Promise<string | null> => {
    try {
      // First, get the current project data to check existing summary
      const { data: project, errors } = await client.models.Projects.get({
        id: projectId,
      });

      if (errors) {
        console.error("Error fetching project for summary:", errors);
        return null;
      }

      // Check if we need to regenerate the summary
      if (!shouldRegenerateSummary(project)) {
        return project?.tasksSummary || null;
      }

      // Generate new summary
      const newSummary = await generateTasksSummary();

      if (newSummary) {
        // Update the project with the new summary and timestamp
        const { errors: updateErrors } = await client.models.Projects.update({
          id: projectId,
          tasksSummary: newSummary,
          tasksSummaryUpdatedAt: newDateTimeString(),
        });

        if (updateErrors) {
          handleApiErrors(updateErrors, "Updating project summary failed");
        }
      }

      return newSummary;
    } catch (error) {
      console.error("Error in getOrGenerateTasksSummary:", error);
      return null;
    }
  };

  return {
    projectTodos,
    isLoading,
    error,
    mutate,
    finishTodo,
    createTodo,
    generateTasksText,
    shouldRegenerateSummary,
    generateTasksSummary,
    getOrGenerateTasksSummary,
  };
};

export default useProjectTodos;
