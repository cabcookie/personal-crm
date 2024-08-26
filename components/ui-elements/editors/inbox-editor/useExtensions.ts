import { queryPerson } from "@/api/usePeople";
import { renderer } from "@/helpers/ui-notes-writer/suggestions";
import { EditorOptions, mergeAttributes } from "@tiptap/core";
import BlockQuote from "@tiptap/extension-blockquote";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import LinkBubbleMenuHandler from "../extensions/link-bubble-menu/LinkBubbleMenuHandler";

const useExtensions = (): EditorOptions["extensions"] => {
  const extensions = useMemo(() => {
    return [
      StarterKit.configure({ blockquote: false }),
      BlockQuote.configure({
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
      Mention.configure({
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
      Placeholder.configure({
        // emptyNodeClass:
        //   "text-muted-foreground relative before:content-['/_for_menu,_@_for_mentions'] before:absolute before:left-0",
        emptyEditorClass:
          "relative text-muted-foreground before:content-[attr(data-placeholder)] before:absolute before:left-0",
        placeholder: "What's on your mind?",
      }),
      LinkBubbleMenuHandler,
    ];
  }, []);

  return extensions;
};

export default useExtensions;
