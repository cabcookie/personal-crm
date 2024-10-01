import { EditorOptions } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import LinkBubbleMenuHandler from "../extensions/link-bubble-menu/LinkBubbleMenuHandler";

const useExtensions = (): EditorOptions["extensions"] => {
  const extensions = useMemo(() => {
    return [
      StarterKit,
      Highlight,
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "no-underline text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2",
        },
      }),
      Typography,
      Placeholder.configure({
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
