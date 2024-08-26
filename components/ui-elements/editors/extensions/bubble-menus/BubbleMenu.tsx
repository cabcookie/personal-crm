import { Editor, ExtensionConfig } from "@tiptap/core";
import { capitalize } from "lodash";
import { FC, ReactNode } from "react";
import ControlledBubbleMenu from "./ControlledBubbleMenu";

export enum MenuState {
  HIDDEN,
  VIEW_DETAILS,
  EDIT_DETAILS,
}

export type BubbleMenuHandlerStorage = {
  state: MenuState;
  bubbleMenuOptions: Partial<GeneralBubbleMenuProps> | undefined;
};

interface GeneralBubbleMenuProps {
  editor: Editor;
  handlerName: string;
}

interface BubbleMenuProps extends GeneralBubbleMenuProps {
  getMenuContent: (menuState: MenuState) => ReactNode;
}

export const generalMenuHandler: Partial<
  ExtensionConfig<undefined, BubbleMenuHandlerStorage>
> = {
  addStorage() {
    return {
      state: MenuState.HIDDEN,
      bubbleMenuOptions: undefined,
    };
  },
};

const BubbleMenu: FC<BubbleMenuProps> = ({
  editor,
  handlerName,
  getMenuContent,
}) => {
  if (!editor.isEditable) return null;
  if (!(handlerName in editor.storage)) {
    throw new Error(
      `You must add the ${capitalize(
        handlerName
      )} extension to the useEditor \`extensions\` array in order to use this component`
    );
  }
  const handlerStorage = editor.storage[
    handlerName
  ] as BubbleMenuHandlerStorage;
  const menuState = handlerStorage.state;
  const menuContent = getMenuContent(menuState);

  return (
    <ControlledBubbleMenu
      editor={editor}
      open={menuState !== MenuState.HIDDEN}
      {...handlerStorage.bubbleMenuOptions}
    >
      <div>{menuContent}</div>
    </ControlledBubbleMenu>
  );
};

export default BubbleMenu;
