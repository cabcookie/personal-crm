import { transformNotesVersion1 } from "@/components/ui-elements/editors/helpers/transform-v1";
import { transformNotesVersion2 } from "@/components/ui-elements/editors/helpers/transform-v2";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/useExtensions";
import { Editor } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { generateText } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, get, map } from "lodash/fp";

export type SerializerOutput = {
  json: EditorJsonContent;
};

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

export const transformTasks = (tasks: any): EditorJsonContent[] | undefined =>
  !tasks ? undefined : JSON.parse(tasks);

interface TransformNotesVersionType {
  formatVersion?: number | null;
  notes?: string | null;
  notesJson?: any;
}

export const transformNotesVersion = ({
  formatVersion,
  notes,
  notesJson,
}: TransformNotesVersionType): EditorJsonContent =>
  formatVersion === 2
    ? transformNotesVersion2(notesJson)
    : transformNotesVersion1(notes);

export type TWithGetJsonFn = { getJSON: () => EditorJsonContent };

export const getEditorContent = (editor: Editor) => () => ({
  json: editor.getJSON(),
});
