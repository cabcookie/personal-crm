import MentionList, {
  MentionListRef,
} from "@/components/ui-elements/notes-writer/MentionList";
import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { Instance, Props } from "tippy.js";

export type SuggestionItem = {
  category: string;
  id: string;
  label: string;
  information?: string; // are shown as additional information but not taken into account for the query
};

type AtMentionSuggestionsProps = {
  items?: SuggestionItem[];
};

export const atMentionSuggestions = ({
  items,
}: AtMentionSuggestionsProps): Omit<SuggestionOptions<any>, "editor"> => ({
  items: ({ query }) =>
    items
      ?.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6) || [],

  render: () => {
    let component: ReactRenderer<MentionListRef>;
    let popup: Instance<Props>[];

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });
        if (!props.clientRect) return;
        popup = tippy("#at-mention-tippy", {
          getReferenceClientRect: () =>
            props.clientRect?.() ?? new DOMRect(0, 0, 0, 0),
          appendTo: "parent",
          content: component.element,
          showOnCreate: true,
          placement: "bottom",
          animation: "shift-away-subtle",
          interactive: true,
          trigger: "manual",
        });
      },

      onUpdate: (props) => {
        component.updateProps(props);
        if (!popup) return;
        popup[0].setProps({
          getReferenceClientRect: () =>
            props.clientRect?.() ?? new DOMRect(0, 0, 0, 0),
        });
      },

      onKeyDown: (props) => {
        if (popup && props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit: () => {
        if (popup) popup[0].unmount();
        if (component) component.destroy();
      },
    };
  },
});
