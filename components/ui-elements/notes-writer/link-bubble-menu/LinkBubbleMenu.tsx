import { Editor } from "@tiptap/core";
import { FC } from "react";
import BubbleMenu, { MenuState } from "../bubble-menus/BubbleMenu";
import EditLinkMenuContent from "./EditLinkMenuContent";
import ViewLinkMenuContent from "./ViewLinkMenuContent";

export interface LinkBubbleMenuProps {
  editor: Editor;
}

const LinkBubbleMenu: FC<LinkBubbleMenuProps> = ({ editor }) => (
  <BubbleMenu
    editor={editor}
    handlerName="linkBubbleMenuHandler"
    getMenuContent={(state) =>
      state === MenuState.VIEW_DETAILS ? (
        <ViewLinkMenuContent
          editor={editor}
          onCancel={editor.commands.closeLinkBubbleMenu}
          onEdit={editor.commands.editLinkInBubbleMenu}
          onRemove={() => {
            editor
              .chain()
              .unsetLink()
              .setTextSelection(editor.state.selection.to)
              .focus()
              .run();
          }}
        />
      ) : state === MenuState.EDIT_DETAILS ? (
        <EditLinkMenuContent
          editor={editor}
          onCancel={editor.commands.closeLinkBubbleMenu}
          onSave={({ text, link }) => {
            editor
              .chain()
              .extendMarkRange("link")
              .insertContent({
                type: "text",
                marks: [{ type: "link", attrs: { href: link } }],
                text,
              })
              .setLink({ href: link })
              .focus()
              .run();
            editor.commands.closeLinkBubbleMenu();
          }}
        />
      ) : null
    }
  />
);

export default LinkBubbleMenu;
