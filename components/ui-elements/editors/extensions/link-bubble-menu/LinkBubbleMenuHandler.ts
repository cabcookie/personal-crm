import { Extension, getAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  BubbleMenuHandlerStorage,
  generalMenuHandler,
  MenuState,
} from "../bubble-menus/BubbleMenu";
import { LinkBubbleMenuProps } from "./LinkBubbleMenu";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkBubbleMenu: {
      openLinkBubbleMenu: (
        options?: Partial<LinkBubbleMenuProps>
      ) => ReturnType;
      editLinkInBubbleMenu: () => ReturnType;
      closeLinkBubbleMenu: () => ReturnType;
    };
  }
}

const LinkBubbleMenuHandler = Extension.create<
  undefined,
  BubbleMenuHandlerStorage
>({
  name: "linkBubbleMenuHandler",

  addCommands() {
    return {
      openLinkBubbleMenu:
        (bubbleMenuOptions = {}) =>
        ({ editor, chain, dispatch }) => {
          const currentMenuState = this.storage.state;
          let newMenuState: MenuState;
          if (editor.isActive("link")) {
            if (currentMenuState !== MenuState.VIEW_DETAILS) {
              chain().extendMarkRange("link").focus().run();
            }
            newMenuState = MenuState.VIEW_DETAILS;
          } else {
            newMenuState = MenuState.EDIT_DETAILS;
          }
          if (dispatch) {
            this.storage.state = newMenuState;
            this.storage.bubbleMenuOptions = bubbleMenuOptions;
          }
          return true;
        },

      editLinkInBubbleMenu:
        () =>
        ({ dispatch }) => {
          const currentMenuState = this.storage.state;
          const newMenuState = MenuState.EDIT_DETAILS;
          if (currentMenuState === newMenuState) return false;
          if (dispatch) {
            this.storage.state = newMenuState;
          }
          return true;
        },

      closeLinkBubbleMenu:
        () =>
        ({ commands, dispatch }) => {
          const currentMenuState = this.storage.state;
          if (currentMenuState === MenuState.HIDDEN) return false;
          commands.focus();
          if (dispatch) {
            this.storage.state = MenuState.HIDDEN;
          }
          return true;
        },
    };
  },

  onSelectionUpdate() {
    if (this.storage.state === MenuState.EDIT_DETAILS) {
      this.editor.commands.closeLinkBubbleMenu();
    } else if (
      this.storage.state === MenuState.VIEW_DETAILS &&
      !this.editor.isActive("link")
    ) {
      this.editor.commands.closeLinkBubbleMenu();
    }
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-u": () => {
        this.editor.commands.openLinkBubbleMenu();
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("handleClickLinkForMenu"),
        props: {
          handleClick: (view, pos, event) => {
            const attrs = getAttributes(view.state, "link");
            const link = (event.target as HTMLElement).closest("a");
            if (link && attrs.href && this.storage.state === MenuState.HIDDEN) {
              this.editor.commands.openLinkBubbleMenu();
            } else {
              this.editor.commands.closeLinkBubbleMenu();
            }
            return false;
          },
        },
      }),
    ];
  },

  ...generalMenuHandler,
});

export default LinkBubbleMenuHandler;
