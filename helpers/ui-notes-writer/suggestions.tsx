import { Person, PersonAccount } from "@/api/usePerson";
import MentionList, {
  MentionListRef,
} from "@/components/ui-elements/editors/extensions/MentionList";
import { ReactRenderer } from "@tiptap/react";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { flow, map } from "lodash/fp";
import tippy, { Instance, Props } from "tippy.js";

export type SuggestionItem = {
  category: string;
  id: string;
  label: string;
  information?: string; // are shown as additional information but not taken into account for the query
};

export const mapPersonToSuggestion =
  (getAccountNamesByIds: (accountIds: string[]) => string) =>
  ({ id, name, accounts }: Person): SuggestionItem => ({
    category: "person",
    id,
    label: name,
    information: flow(
      map((pa: PersonAccount) => pa.accountId),
      getAccountNamesByIds
    )(accounts),
  });

export const filterPersonByQuery = (query: string) => (p: Person) =>
  p.name.toLowerCase().replaceAll(" ", "").includes(query.toLowerCase());

export const limitItems = (limit: number) => (items: SuggestionItem[]) =>
  items.slice(0, limit);

type RendererProps = {
  onBeforeStart?: (props: SuggestionProps<SuggestionItem>) => void;
  onStart?: (props: SuggestionProps<SuggestionItem>) => void;
  onBeforeUpdate?: (props: SuggestionProps<SuggestionItem>) => void;
  onUpdate?: (props: SuggestionProps<SuggestionItem>) => void;
  onExit?: (props: SuggestionProps<SuggestionItem>) => void;
  onKeyDown?: (props: SuggestionKeyDownProps) => boolean;
};

export const renderer = (): RendererProps => {
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
      if (!component) return;
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
      return component?.ref?.onKeyDown(props) ?? false;
    },

    onExit: () => {
      if (popup) popup[0].unmount();
      if (component) component.destroy();
    },
  };
};
