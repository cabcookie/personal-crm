import { SuggestionItem } from "@/helpers/ui-notes-writer/suggestions";
import { cn } from "@/lib/utils";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import {
  forwardRef,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
// import "./MentionList.scss";

const MentionList = forwardRef<ReactElement, SuggestionProps<SuggestionItem>>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      if (!props.items) return;
      const item = props.items[index];

      if (item) {
        props.command(item);
      }
    };

    const upHandler = () => {
      if (!props.items) return;
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      if (!props.items) return;
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      props.items && (
        <div className="rounded-sm border border-solid flex flex-col bg-white">
          {props.items.length ? (
            props.items.map((item, index) => (
              <button
                className={cn(
                  index === selectedIndex && "bg-accent",
                  "py-1 px-4 text-left"
                )}
                key={index}
                onClick={() => selectItem(index)}
              >
                {item.label}
                {item.information && ` (${item.information})`}
              </button>
            ))
          ) : (
            <div className="item">No result</div>
          )}
        </div>
      )
    );
  }
);
MentionList.displayName = "MentionList";

export default MentionList;
