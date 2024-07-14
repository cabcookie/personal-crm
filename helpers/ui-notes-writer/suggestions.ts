import MentionList from "@/components/ui-elements/notes-writer/MentionList";
import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { JSXElementConstructor, ReactElement, RefAttributes } from "react";
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
    let component: ReactRenderer<
      ReactElement<any, string | JSXElementConstructor<any>>,
      AtMentionSuggestionsProps &
        RefAttributes<ReactElement<any, string | JSXElementConstructor<any>>>
    >;
    let popup: Instance<Props>[] & Instance<Props>;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });
        if (!props.clientRect) return;
        popup = tippy("#at-mention-tippy", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
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
        if (!props.clientRect) return;
        popup[0].setProps({ getReferenceClientRect: props.clientRect });
      },

      onKeyDown: (props) => {
        if (popup && props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit: () => {
        if (popup) popup[0].destroy();
        if (component) component.destroy();
      },
    };
  },
});

// const suggestionExample = {
//   items: ({ query }) =>
//     [
//       "Lea Thompson",
//       "Cyndi Lauper",
//       "Tom Cruise",
//       "Justine Bateman",
//       "Lisa Bonet",
//     ]
//       .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
//       .slice(0, 5),
//   render: () => {
//     let component;
//     let popup;
//     return {
//       onStart: (props) => {
//         component = new ReactRenderer(MentionList, {
//           props,
//           editor: props.editor,
//         });

//         if (!props.clientRect) return;
//         popup = tippy("body", {
//           getReferenceClientRect: props.clientRect,
//           appendTo: () => document.body,
//           content: component.element,
//           showOnCreate: true,
//           interactive: true,
//           trigger: "manual",
//           placement: "bottom-start",
//         });
//       },
//       onUpdate(props) {
//         component.updateProps(props);
//         if (!props.clientRect) return;
//         popup[0].setProps({ getReferenceClientRect: props.clientRect });
//       },
//       onKeyDown(props) {
//         if (props.event.key === "Escape") {
//           popoup[0].hide();
//           return true;
//         }
//         return component.ref.onKeyDown(props);
//       },

//       onExit() {
//         popup[0].destroy();
//         component.destroy();
//       },
//     };
//   },
// };
