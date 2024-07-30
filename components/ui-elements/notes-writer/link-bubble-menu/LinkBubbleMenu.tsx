/// <reference types="@tiptap/extension-link" />
import type { Except } from "type-fest";

import { FC } from "react";
import ControlledBubbleMenu, {
  ControlledBubbleMenuProps,
} from "./ControlledBubbleMenu";
import EditLinkMenuContent, {
  EditLinkMenuContentProps,
} from "./EditLinkMenuContent";
import {
  LinkBubbleMenuHandlerStorage,
  LinkMenuState,
} from "./LinkBubbleMenuHandler";
import ViewLinkMenuContent, {
  ViewLinkMenuContentProps,
} from "./ViewLinkMenuContent";

export interface LinkBubbleMenuProps
  extends Partial<Except<ControlledBubbleMenuProps, "open" | "children">> {
  labels?: ViewLinkMenuContentProps["labels"] &
    EditLinkMenuContentProps["labels"];
}

const LinkBubbleMenu: FC<LinkBubbleMenuProps> = ({
  labels,
  editor,
  ...controlledBubbleMenuProps
}) => {
  if (!editor?.isEditable) return null;
  if (!("linkBubbleMenuHandler" in editor.storage)) {
    throw new Error(
      "You must add the LinkBubbleMenuHandler extension to the useEditor `extensions` array in order to use this component!"
    );
  }
  const handlerStorage = editor.storage
    .linkBubbleMenuHandler as LinkBubbleMenuHandlerStorage;
  const menuState = handlerStorage.state;

  const linkMenuContent = (() => {
    if (menuState === LinkMenuState.VIEW_LINK_DETAILS)
      return (
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
          labels={labels}
        />
      );
    else if (menuState === LinkMenuState.EDIT_LINK)
      return (
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
      );
  })();
  return (
    <ControlledBubbleMenu
      editor={editor}
      open={menuState !== LinkMenuState.HIDDEN}
      {...handlerStorage.bubbleMenuOptions}
      {...controlledBubbleMenuProps}
    >
      <div>{linkMenuContent}</div>
    </ControlledBubbleMenu>
  );
};

export default LinkBubbleMenu;
