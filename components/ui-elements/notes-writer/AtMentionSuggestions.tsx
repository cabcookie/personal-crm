import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { SuggestionItem } from "@/helpers/ui-notes-writer/suggestions";
import { capitalize } from "lodash";
import { flow, map, uniq } from "lodash/fp";
import { forwardRef, ReactElement, useState } from "react";

type AtMentionSuggestionsProps = {
  items?: SuggestionItem[];
  open?: boolean;
  getReferenceClientRect?: any;
};

const AtMentionSuggestions = forwardRef<
  ReactElement,
  AtMentionSuggestionsProps
>(({ items, open }, ref) => {
  const [selected, setSelected] = useState<string | undefined>();
  console.log("AtMentionSuggestions");

  return (
    <Select value={selected} onValueChange={setSelected} defaultOpen={true}>
      <SelectContent>
        {flow(
          map((i: SuggestionItem) => i.category),
          uniq,
          map((category) => (
            <SelectGroup key={category}>
              <SelectLabel>{capitalize(category)}</SelectLabel>
              {items?.map(({ id, label, information }) => (
                <SelectItem value={id} key={id}>
                  {label}
                  {information && ` (${information})`}
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        )(items)}
      </SelectContent>
    </Select>
  );
});
AtMentionSuggestions.displayName = "AtMentionSuggestions";

export default AtMentionSuggestions;
