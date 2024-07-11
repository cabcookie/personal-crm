import AtMentionSuggestions from "@/components/ui-elements/notes-writer/AtMentionSuggestions";
import { Editor, ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";

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
  items: ({ query }) => {
    console.log("filter items", query);
    return (
      items
        ?.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6) || []
    );
  },
  render: () => {
    let mentionlist: ReactRenderer;

    return {
      onStart: (props) => {
        console.log(
          "render.onStart",
          props,
          props.clientRect && props.clientRect()
        );
        mentionlist = new ReactRenderer(AtMentionSuggestions, {
          props,
          editor: props.editor,
        });
      },
      onUpdate: (props) => {
        console.log("onUpdate", props);
        mentionlist.updateProps({
          ...props,
          open: true,
          getReferenceClientRect: props.clientRect,
        });
        mentionlist.render();
      },
      onKeyDown: (props) => {
        if (props.event.key === "Escape")
          mentionlist.updateProps({ ...props, open: false });
      },
      onExit: (props) => {
        mentionlist.destroy();
      },
    };
  },
});

const suggestionExample = {
  items: ({ query }) =>
    [
      "Lea Thompson",
      "Cyndi Lauper",
      "Tom Cruise",
      "Justine Bateman",
      "Lisa Bonet",
    ]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5),
  render: () => {
    let component;
    let popup;
    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },
      onUpdate(props) {
        component.updateProps(props);
        if (!props.clientRect) return;
        popup[0].setProps({ getReferenceClientRect: props.clientRect });
      },
      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popoup[0].hide();
          return true;
        }
        return component.ref.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
