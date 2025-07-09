import usePeople from "@/api/usePeople";
import {
  filterPersonByQuery,
  limitItems,
  mapPersonToSuggestion,
  renderer,
} from "@/helpers/ui-notes-writer/suggestions";
import { EditorOptions } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, map } from "lodash/fp";
import { useMemo } from "react";
import HeadingCustom from "../editors/extensions/heading/heading";
import LinkBubbleMenuHandler from "../editors/extensions/link-bubble-menu/LinkBubbleMenuHandler";
import S3ImageExtension from "../editors/extensions/s3-images/S3ImageExtension";

interface UseExtensionsProps {
  placeholder?: string;
}

const useExtensions = ({
  placeholder = "Start taking notes...",
}: UseExtensionsProps): EditorOptions["extensions"] => {
  const { people } = usePeople();

  const extensions = useMemo(() => {
    return [
      StarterKit.configure({ heading: false }),
      HeadingCustom,
      TaskList,
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-center gap-2 font-semibold list-none",
        },
      }),
      Highlight,
      Link.extend({
        inclusive: false,
      }).configure({
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
          `${options.suggestion.char ?? "@"}${node.attrs.label ?? node.attrs.id}`,
        ],
        suggestion: {
          items: ({ query }) =>
            flow(
              filter(filterPersonByQuery(query)),
              map(mapPersonToSuggestion),
              limitItems(7)
            )(people),
          render: renderer,
        },
      }),
      S3ImageExtension,
      Placeholder.configure({
        // emptyNodeClass:
        //   "text-muted-foreground relative before:content-['/_for_menu,_@_for_mentions'] before:absolute before:left-0",
        emptyEditorClass:
          "relative text-muted-foreground before:content-[attr(data-placeholder)] before:absolute before:left-0",
        placeholder,
      }),
      LinkBubbleMenuHandler,
    ];
  }, [people, placeholder]);

  return extensions;
};

export default useExtensions;
