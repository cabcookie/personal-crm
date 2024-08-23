import { Todo } from "@/api/useProjectTodos";
import { generateText } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, get, join, map, trim } from "lodash/fp";
import { TaskItem } from "../extensions/tasks/task-item";
import { EditorJsonContent } from "../notes-editor/useExtensions";

const filterS3ImageNodes = (nodes: EditorJsonContent[]): EditorJsonContent[] =>
  flow(
    filter((node: EditorJsonContent) => node.type !== "s3image"),
    map((node) => ({
      ...node,
      content: !node.content ? undefined : filterS3ImageNodes(node.content),
    }))
  )(nodes);

const transformMentionsToText = (json: EditorJsonContent): EditorJsonContent =>
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
    : { type: "text", text: `@${json.attrs?.label}` };

const transformTasksToText = (json: EditorJsonContent): EditorJsonContent =>
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

export const getTextFromEditorJsonContent = (
  json?: EditorJsonContent | string
) =>
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

export const getTodoText: (todos: Todo[] | undefined) => string = flow(
  filter((t) => !t.done),
  map(get("todo")),
  map(getTextFromEditorJsonContent),
  map(trim),
  join(", ")
);
