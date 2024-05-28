import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ComboBoxProps = {
  options:
    | {
        value: string;
        label: string;
      }[]
    | undefined;
  currentValue?: string;
  placeholder?: string;
  noSearchResultMsg?: string;
  loadingResultsMsg?: string;
  onChange?: (selectedValue: string | null) => void;
  onCreate?: (newLabel: string) => void;
  createItemLabel?: string;
};

const ComboBox: FC<ComboBoxProps> = ({
  options,
  currentValue,
  onChange,
  onCreate,
  placeholder = "Search for entry…",
  noSearchResultMsg = "No entry found.",
  loadingResultsMsg = "Loading results…",
  createItemLabel = "Create new item…",
}) => {
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !currentValue && "text-muted-foreground"
          )}
        >
          {options?.find((o) => o.value === currentValue)?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command loop shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchVal}
            onValueChange={setSearchVal}
          />
          <CommandList>
            {!options && <CommandLoading>{loadingResultsMsg}</CommandLoading>}
            <CommandEmpty>{noSearchResultMsg}</CommandEmpty>
            <CommandGroup>
              {[
                ...(options || []),
                ...(onCreate ? [{ value: "new", label: createItemLabel }] : []),
              ]
                .filter(
                  (opt) =>
                    opt.label.toLowerCase().includes(searchVal.toLowerCase()) ||
                    opt.value === "new"
                )
                .map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      if (opt.value === "new" && onCreate) {
                        onCreate(searchVal);
                        setSearchVal("");
                        setOpen(false);
                        return;
                      }
                      if (!onChange) return;
                      onChange(opt.value === currentValue ? "" : opt.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        opt.value === currentValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.value === "new" ? (
                      <strong>{opt.label}</strong>
                    ) : (
                      opt.label
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
