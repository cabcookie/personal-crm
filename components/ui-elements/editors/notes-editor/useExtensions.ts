import { useAccountsContext } from "@/api/ContextAccounts";
import usePeople from "@/api/usePeople";
import {
  filterPersonByQuery,
  limitItems,
  mapPersonToSuggestion,
  renderer,
} from "@/helpers/ui-notes-writer/suggestions";
import {
  EditorOptions,
  JSONContent,
  mergeAttributes,
  NodeConfig,
} from "@tiptap/core";
import BlockQuote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { filter, flow, map } from "lodash/fp";
import { useMemo } from "react";
import LinkBubbleMenuHandler from "../extensions/link-bubble-menu/LinkBubbleMenuHandler";
import S3ImageExtension from "../extensions/s3-images/S3ImageExtension";

export type EditorJsonContent = JSONContent;

const extendedConfig: Partial<NodeConfig<any, any>> = {
  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-block-id"),
        renderHTML: (attrs) => ({ "data-block-id": attrs.blockId }),
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        if ($from.parent.attrs.blockId) {
          editor
            .chain()
            .splitBlock()
            .updateAttributes($from.parent.type.name, { blockId: null })
            .run();
          return true;
        }
        return false;
      },
    };
  },
};

const StarterKitExtended = [
  Heading,
  Paragraph,
  BlockQuote,
  ListItem,
  CodeBlock,
  S3ImageExtension,
].map((ext) => ext.extend(extendedConfig));

const useExtensions = (): EditorOptions["extensions"] => {
  const { people } = usePeople();
  const { getAccountNamesByIds } = useAccountsContext();

  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        paragraph: false,
        heading: false,
        listItem: false,
        codeBlock: false,
        blockquote: false,
      }),
      ...StarterKitExtended,
      TaskList,
      TaskItem.extend(extendedConfig).configure({
        HTMLAttributes: {
          class: "flex items-center gap-2 font-semibold list-none",
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
          items: ({ query }) =>
            flow(
              filter(filterPersonByQuery(query)),
              map(mapPersonToSuggestion(getAccountNamesByIds)),
              limitItems(5)
            )(people),
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
  }, [getAccountNamesByIds, people]);

  return extensions;
};

export default useExtensions;
