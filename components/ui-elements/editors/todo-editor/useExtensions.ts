import { queryPerson } from "@/api/usePeople";
import { renderer } from "@/helpers/ui-notes-writer/suggestions";
import { EditorOptions, mergeAttributes } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import LinkBubbleMenuHandler from "../extensions/link-bubble-menu/LinkBubbleMenuHandler";
import { TaskItem } from "../extensions/tasks/task-item";

const useExtensions = (): EditorOptions["extensions"] => {
  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        heading: false,
        orderedList: false,
        bulletList: false,
        listItem: false,
        codeBlock: false,
        blockquote: false,
      }),
      TaskList,
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start gap-2 list-none",
        },
      }),
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "no-underline text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2",
        },
      }),
      Typography,
      Mention.extend({
        addAttributes() {
          return {
            id: {
              default: null,
              parseHTML: (element) => element.getAttribute("data-id"),
              renderHTML: (attrs) => ({
                "data-id": attrs.id,
              }),
            },
            label: {
              default: null,
              parseHTML: (element) => element.getAttribute("data-label"),
              renderHTML: (attrs) => ({
                "data-label": attrs.label,
              }),
            },
            recordId: {
              default: null,
              parseHTML: (element) => element.getAttribute("data-record-id"),
              renderHTML: (attrs) => ({
                "data-record-id": attrs.recordId,
              }),
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class:
            "text-blue-400 no-underline hover:underline underline-offset-2",
        },
        renderHTML: ({ options, node }) => [
          "a",
          mergeAttributes(
            { href: `/people/${node.attrs.id}` },
            options.HTMLAttributes
          ),
          `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
        ],
        suggestion: {
          items: ({ query }) => queryPerson(query),
          render: renderer,
        },
      }),
      LinkBubbleMenuHandler,
    ];
  }, []);

  return extensions;
};

export default useExtensions;
