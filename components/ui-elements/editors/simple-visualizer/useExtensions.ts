import { EditorOptions, mergeAttributes } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";

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
      Link.extend({ inclusive: false }).configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            "no-underline text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2",
        },
      }),
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
      }),
    ];
  }, []);
  return extensions;
};

export default useExtensions;
