import { Project } from "@/api/ContextProjects";
import { MeetingTodo } from "@/api/useMeetingTodos";
import { Todo } from "@/api/useProjectTodos";
import { generateText, JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, get, identity, join, map, trim } from "lodash/fp";
import { TaskItem } from "../extensions/tasks/task-item";

const filterS3ImageNodes = (nodes: JSONContent[]): JSONContent[] =>
  flow(
    filter((node: JSONContent) => node.type !== "s3image"),
    map((node) => ({
      ...node,
      content: !node.content ? undefined : filterS3ImageNodes(node.content),
    }))
  )(nodes);

const transformMentionsToText = (json: JSONContent): JSONContent =>
  json.type !== "mention"
    ? {
        ...json,
        ...(!json.content
          ? {}
          : {
              content: json.content
                .map(transformMentionsToText)
                .filter((c) => !!c),
            }),
      }
    : !json.attrs?.label
      ? {}
      : { type: "text", text: json.attrs?.label };

const transformTasksToText = (json: JSONContent): JSONContent =>
  json.type !== "taskList"
    ? {
        ...json,
        ...(!json.content
          ? {}
          : { content: json.content.map(transformTasksToText) }),
      }
    : {
        ...json,
        ...(!json.content
          ? {}
          : {
              content: json.content.map((ti) =>
                ti.type !== "taskItem"
                  ? ti
                  : {
                      ...ti,
                      content: [
                        {
                          type: "paragraph",
                          content: [
                            {
                              type: "text",
                              text: `[${ti.attrs?.checked ? "x" : ""}]`,
                            },
                          ],
                        },
                        ...(ti.content || []),
                      ],
                    }
              ),
            }),
      };

const MyExtensions = [
  StarterKit,
  TaskList,
  TaskItem,
  Highlight,
  Link,
  Typography,
  Mention,
];

export const getTextFromJsonContent = (json?: JSONContent | string) =>
  !json
    ? ""
    : typeof json === "string"
      ? json
      : generateText(
          {
            ...json,
            ...(!json.content
              ? {}
              : {
                  content: flow(
                    get("content"),
                    filterS3ImageNodes,
                    map(transformMentionsToText),
                    map(transformTasksToText)
                  )(json),
                }),
          },
          MyExtensions
        );

export const getTopicTodos = (
  topicProjectIds: string[],
  meetingTodos: MeetingTodo[] | undefined
) =>
  flow(
    identity<MeetingTodo[] | undefined>,
    filter((t) => t.projectIds.some((id) => topicProjectIds.includes(id))),
    getTodoText
  )(meetingTodos);

export const getTopicProjects = (
  topicProjectIds: string[],
  projects: Project[] | undefined,
  getAccountNamesByIds: (accountIds: string[]) => string
) =>
  flow(
    identity<Project[] | undefined>,
    filter((p) => topicProjectIds.includes(p.id)),
    map(
      (p) =>
        `${p.project}${
          !p.accountIds || p.accountIds.length === 0
            ? ""
            : ` (${getAccountNamesByIds(p.accountIds)})`
        }`
    )
  )(projects);

export const getTodoText: (todos: Todo[] | undefined) => string = flow(
  filter((t) => !t.done),
  map("todo"),
  map(getTextFromJsonContent),
  map(trim),
  join(", ")
);
