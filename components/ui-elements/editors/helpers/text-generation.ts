import { Project } from "@/api/ContextProjects";
import { MeetingTodo } from "@/api/useMeetingTodos";
import { Todo } from "@/api/useProjectTodos";
import { Editor, generateText, JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, identity, join, map, trim } from "lodash/fp";
import { TaskItem } from "../extensions/tasks/task-item";
import S3ImageExtension from "../extensions/s3-images/S3ImageExtension";
import HeadingCustom from "../extensions/heading/heading";
import { Markdown } from "tiptap-markdown";

const MyExtensions = [
  StarterKit.configure({
    heading: false,
  }),
  Mention.extend({
    addStorage() {
      return {
        markdown: {
          serialize(
            state: { write: (arg0: any) => void },
            node: { attrs: { label: any } }
          ) {
            state.write(node.attrs.label);
          },
        },
      };
    },
  }).configure({ renderText: ({ node }) => node.attrs.label }),
  HeadingCustom,
  TaskList,
  TaskItem,
  Highlight,
  Link,
  S3ImageExtension,
  Markdown.configure({ html: false }),
];

export const getMarkdown = (json?: JSONContent | string) => {
  const editor = new Editor({ content: json, extensions: MyExtensions });
  return editor.storage.markdown.getMarkdown();
};

export const getTextFromJsonContent = (json?: JSONContent | string) =>
  !json
    ? ""
    : typeof json === "string"
      ? json
      : generateText(json, MyExtensions);

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
