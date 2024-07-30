import { Popover, PopoverContent } from "@/components/ui/popover";
import { Editor, isNodeSelection, posToDOMRect } from "@tiptap/core";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";

export type PopoverStylesProps =
  | {
      top: string;
      left: string;
      position: "absolute";
      transform: string;
    }
  | {
      top?: undefined;
      left?: undefined;
      position?: undefined;
      transform?: undefined;
    };

export type ControlledBubbleMenuProps = {
  editor: Editor;
  open: boolean;
  children: ReactNode;
};

const ControlledBubbleMenu: FC<ControlledBubbleMenuProps> = ({
  editor,
  open,
  children,
}) => {
  const [popoverStyles, setPopoverStyles] = useState<PopoverStylesProps>({});

  const calculateAnchorRect = useCallback(() => {
    const { ranges } = editor.state.selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    const rect = (() => {
      if (isNodeSelection(editor.state.selection)) {
        const node = editor.view.nodeDOM(from);
        if (node instanceof HTMLElement) {
          return node.getBoundingClientRect();
        }
      }
      return posToDOMRect(editor.view, from, to);
    })();

    const styles: PopoverStylesProps = (() => {
      return rect
        ? {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            position: "absolute",
            transform: `translateY(${rect.height}px)`,
          }
        : {};
    })();

    setPopoverStyles(styles);
  }, [editor]);

  useEffect(() => {
    if (open) calculateAnchorRect();
  }, [open, calculateAnchorRect]);

  useEffect(() => {
    const handleScroll = () => {
      if (open) calculateAnchorRect();
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [calculateAnchorRect, open]);

  return (
    <Popover open={open}>
      <PopoverContent style={popoverStyles} className="w-80" side="bottom">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default ControlledBubbleMenu;
