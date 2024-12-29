import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
} from "lucide-react";
import { FC } from "react";
import FormatBtn from "./FormatBtn";

interface InboxEditorMenuProps {
  className?: string;
  readonly?: boolean;
  editor?: Editor | null;
}

const InboxEditorMenu: FC<InboxEditorMenuProps> = ({
  className,
  readonly,
  editor,
}) => {
  return (
    editor &&
    !readonly && (
      <div className={cn("pt-[2px] px-[2px] w-full", className)}>
        <div className="p-2 rounded-t-md bg-slate-100 flex flex-row gap-2">
          <div className="gap-0 rounded-md border">
            <FormatBtn
              aria-label="Bold"
              pressed={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold />
            </FormatBtn>
            <FormatBtn
              aria-label="Italic"
              pressed={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic />
            </FormatBtn>
          </div>

          <div className="gap-0 rounded-md border">
            <FormatBtn
              aria-label="Heading 1"
              pressed={editor.isActive("heading", { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 />
            </FormatBtn>
            <FormatBtn
              aria-label="Heading 2"
              pressed={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 />
            </FormatBtn>
            <FormatBtn
              aria-label="Heading 3"
              pressed={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 />
            </FormatBtn>
            <FormatBtn
              aria-label="Heading 4"
              pressed={editor.isActive("heading", { level: 4 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              <Heading4 />
            </FormatBtn>
          </div>
        </div>
      </div>
    )
  );
};

export default InboxEditorMenu;
