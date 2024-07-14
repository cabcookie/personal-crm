import { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { generateText } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, get, map } from "lodash/fp";

export type EditorJsonContent = JSONContent;

export type SerializerOutput = {
  json: EditorJsonContent;
  hasOpenTasks: boolean;
  openTasks: EditorJsonContent[];
  closedTasks: EditorJsonContent[];
};

type TasksOutPut = Omit<SerializerOutput, "json">;

const transformMentionsToText = (json: EditorJsonContent): EditorJsonContent =>
  json.type !== "mention"
    ? { ...json, content: json.content?.map(transformMentionsToText) }
    : { type: "text", text: !json.attrs?.label ? "" : `@${json.attrs?.label}` };

const transformTasksToText = (json: EditorJsonContent): EditorJsonContent =>
  json.type !== "taskList"
    ? { ...json, content: json.content?.map(transformTasksToText) }
    : {
        ...json,
        content: json.content?.map((ti) =>
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
      };
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
            filter((c: EditorJsonContent) => c.type !== "s3image"),
            map(transformMentionsToText),
            (log) => {
              console.log(log);
              return log;
            },
            map(transformTasksToText)
          )(json),
        },
        MyExtensions
      );

type TransformNotesVersionType = {
  version?: number | null;
  notes?: string | null;
  notesJson?: any;
};

type GenericObject = { [key: string]: any };

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

const compareNotes = (obj1: GenericObject, obj2: GenericObject): boolean => {
  for (const key in obj1) {
    const val1 = obj1[key];
    if (!(key in obj2) && !!val1) return false;
    else {
      const val2 = obj2[key];
      if (
        typeof val1 === "object" &&
        val1 !== null &&
        typeof val2 === "object" &&
        val2 !== null
      ) {
        if (!compareNotes(val1, val2)) return false;
      } else {
        if (val1 !== val2) return false;
      }
    }
  }
  for (const key in obj2) if (!(key in obj1) && !!obj2[key]) return false;
  return true;
};

export const isUpToDate = (
  notes: EditorJsonContent | string | undefined,
  editorJson: EditorJsonContent | undefined
) => {
  if (!notes) return false;
  if (!editorJson) return false;
  if (typeof notes === "string") return false;
  return compareNotes(notes, editorJson);
};

export const transformNotesVersion = ({
  version,
  notes,
  notesJson,
}: TransformNotesVersionType) =>
  version === 2 ? (notesJson ? JSON.parse(notesJson) : "") : notes || undefined;

export const getTasksData = (jsonContent?: EditorJsonContent): TasksOutPut => {
  const tasks = jsonContent?.content
    ?.filter((c) => c.type === "taskList")
    .flatMap((t) => t.content)
    .filter((t) => !!t);
  return {
    hasOpenTasks: !!tasks?.filter((t) => !t?.attrs?.checked)?.length,
    openTasks: tasks?.filter((t) => !t.attrs?.checked) || [],
    closedTasks: tasks?.filter((t) => t.attrs?.checked) || [],
  };
};
