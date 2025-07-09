import { queryPerson } from "@/api/usePeople";
import { renderer } from "@/helpers/ui-notes-writer/suggestions";
import { EditorOptions, mergeAttributes, NodeConfig } from "@tiptap/core";
import BlockQuote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import HeadingCustom from "../extensions/heading/heading";
import LinkBubbleMenuHandler from "../extensions/link-bubble-menu/LinkBubbleMenuHandler";
import S3ImageExtension from "../extensions/s3-images/S3ImageExtension";
import { TaskItem } from "../extensions/tasks/task-item";

const extendedConfig: Partial<NodeConfig<any, any>> = {
  addAttributes() {
    return {
      ...this.parent?.(),
      blockId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-block-id"),
        renderHTML: (attrs) => ({ "data-block-id": attrs.blockId }),
      },
    };
  },
};

const StarterKitExtended = [HeadingCustom, Paragraph, ListItem, CodeBlock].map(
  (ext) => ext.extend(extendedConfig)
);

const useExtensions = (): EditorOptions["extensions"] => {
  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        paragraph: false,
        heading: false,
        listItem: false,
        codeBlock: false,
        blockquote: false,
        document: false,
      }),
      ...StarterKitExtended,
      Document.extend({
        addAttributes() {
          return {
            projects: {
              default: [],
            },
          };
        },
      }),
      BlockQuote.extend(extendedConfig).configure({
        HTMLAttributes: {
          class: "font-normal not-italic",
        },
      }),
      TaskList,
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start gap-2 font-semibold list-none",
        },
      }),
      Highlight,
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "no-underline text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2",
        },
      }),
      Typography,
      S3ImageExtension,
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
          `${options.suggestion.char ?? "@"}${node.attrs.label ?? node.attrs.id}`,
        ],
        suggestion: {
          items: ({ query }) => queryPerson(query),
          render: renderer,
        },
      }),
      Placeholder.configure({
        // emptyNodeClass:
        //   "text-muted-foreground relative before:content-['/_for_menu,_@_for_mentions'] before:absolute before:left-0",
        emptyEditorClass:
          "relative text-muted-foreground before:content-[attr(data-placeholder)] before:absolute before:left-0",
        placeholder: "Start taking notes…",
      }),
      LinkBubbleMenuHandler,
    ];
  }, []);

  return extensions;
};

export default useExtensions;
