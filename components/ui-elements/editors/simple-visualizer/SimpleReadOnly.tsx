import { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import useExtensions from "./useExtensions";

const makeDocument = (content: JSONContent[]): JSONContent => ({
  type: "doc",
  content,
});

type SimpleReadOnlyProps = {
  content: JSONContent[];
};

const SimpleReadOnly: FC<SimpleReadOnlyProps> = ({ content }) => {
  const extensions = useExtensions();

  const editor = useEditor({
    extensions,
    editable: false,
    immediatelyRender: false,
    content: makeDocument(content),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: "prose w-full max-w-full pt-1 bg-inherit",
        },
      },
    });
  }, [editor]);

  return <EditorContent editor={editor} />;
};

export default SimpleReadOnly;
