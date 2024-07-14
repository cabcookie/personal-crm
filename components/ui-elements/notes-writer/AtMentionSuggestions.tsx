import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { SuggestionItem } from "@/helpers/ui-notes-writer/suggestions";
import { cn } from "@/lib/utils";
import { capitalize, floor } from "lodash";
import { flow, map, uniq } from "lodash/fp";
import { forwardRef, ReactElement, useEffect, useState } from "react";

export type AtMentionSuggestionsProps = {
  items?: SuggestionItem[];
  open: boolean;
  getReferenceClientRect?: () => DOMRect;
};

const AtMentionSuggestions = forwardRef<
  ReactElement,
  AtMentionSuggestionsProps
>(({ items, open: openDefault, getReferenceClientRect }, _ref) => {
  const [selected, setSelected] = useState<string | undefined>();
  const [open, setOpen] = useState(openDefault);
  const [left, setLeft] = useState(
    !getReferenceClientRect ? 0 : floor(getReferenceClientRect().left)
  );
  const [top, setTop] = useState(
    !getReferenceClientRect ? 0 : floor(getReferenceClientRect().top + 24)
  );

  useEffect(() => {
    if (open && getReferenceClientRect) {
      setLeft(
        !getReferenceClientRect ? 0 : floor(getReferenceClientRect().left)
      );
      setTop(!getReferenceClientRect ? 0 : floor(getReferenceClientRect().top));
    }
  }, [open, getReferenceClientRect]);

  return (
    <Select value={selected} onValueChange={setSelected} open={true}>
      <SelectContent className={cn(`left-[${left}px] top-[${top}px]`)}>
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
