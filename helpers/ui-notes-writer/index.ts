import { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { generateText } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { isEqual } from "lodash";
import { filter, flatMap, flow, get, map } from "lodash/fp";

export type EditorJsonContent = JSONContent;

export type SerializerOutput = {
  json: EditorJsonContent;
  hasOpenTasks: boolean;
  openTasks?: EditorJsonContent[];
  closedTasks?: EditorJsonContent[];
};

export const emptyDocument: EditorJsonContent = {
  type: "doc",
  content: [],
};

const stringToEditorJsonContent = (
  notes?: string | null
): EditorJsonContent => ({
  type: "doc",
  content:
    notes?.split("\n").map((text) => ({
      type: "paragraph",
      content: !text
        ? []
        : [
            {
              type: "text",
              text,
            },
          ],
    })) ?? [],
});

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

const filterS3ImageNodes = (nodes: EditorJsonContent[]): EditorJsonContent[] =>
  flow(
    filter((node: EditorJsonContent) => node.type !== "s3image"),
    map((node) => ({
      ...node,
      content: !node.content ? undefined : filterS3ImageNodes(node.content),
    }))
  )(nodes);

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
          content: flow(
            get("content"),
            filterS3ImageNodes,
            map(transformMentionsToText),
            map(transformTasksToText)
          )(json),
        },
        MyExtensions
      );

interface TransformNotesVersionType {
  formatVersion?: number | null;
  notes?: string | null;
  notesJson?: any;
}

export const MyExtensions = [
  StarterKit,
  TaskList,
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-center gap-2 font-semibold list-none",
    },
  }),
  Highlight,
  Link,
  Typography,
];

export const isUpToDate = (
  notes: EditorJsonContent,
  editorJson: EditorJsonContent | undefined
) => {
  if (!editorJson) return false;
  return isEqual(notes, editorJson);
};

export const transformTasks = (tasks: any): EditorJsonContent[] | undefined =>
  !tasks ? undefined : JSON.parse(tasks);

export const transformNotesVersion = ({
  formatVersion,
  notes,
  notesJson,
}: TransformNotesVersionType): EditorJsonContent =>
  formatVersion === 2
    ? notesJson
      ? JSON.parse(notesJson)
      : stringToEditorJsonContent("")
    : stringToEditorJsonContent(notes);

export const getAllTasks = (
  jsonContent?: EditorJsonContent
): EditorJsonContent[] | undefined =>
  flow(
    get("content"),
    filter((content: EditorJsonContent) => content.type === "taskList"),
    flatMap((task) => task.content),
    filter((task) => !!task),
    (test) => test
  )(jsonContent);

export const getTasksData = (
  jsonContent?: EditorJsonContent
): Omit<SerializerOutput, "json"> => {
  const tasks = getAllTasks(jsonContent);
  return {
    hasOpenTasks: tasks?.some((t) => !t?.attrs?.checked) ?? false,
    openTasks: tasks?.filter((t) => !t.attrs?.checked) || [],
    closedTasks: tasks?.filter((t) => t.attrs?.checked) || [],
  };
};

export type TWithGetJsonFn = { getJSON: () => EditorJsonContent };

export const getEditorContent = (editor: TWithGetJsonFn) => () => ({
  json: editor.getJSON(),
});

export const getEditorContentAndTaskData =
  (
    editor: TWithGetJsonFn,
    mutateOpenTasks: (updatedOpenTasks?: EditorJsonContent[]) => void
  ) =>
  () => {
    const json = editor.getJSON();
    const taskData = getTasksData(json);
    mutateOpenTasks(taskData.openTasks);
    return { json, ...taskData };
  };
