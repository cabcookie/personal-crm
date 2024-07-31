import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { Check, Plus } from "lucide-react";
import { FC, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

export type PopoverContentComboBoxProps = {
  options:
    | {
        value: string;
        label: string;
      }[]
    | undefined;
  currentValue?: string;
  closePopover?: () => void;
  onChange?: (selectedValue: string | null) => void;
  onCreate?: (newLabel: string) => void;
  placeholder?: string;
  noSearchResultMsg?: string;
  loadingResultsMsg?: string;
  createItemLabel?: string;
};

const PopoverContentComboBox: FC<PopoverContentComboBoxProps> = ({
  options,
  currentValue,
  closePopover,
  onChange,
  onCreate,
  placeholder = "Search for entry…",
  noSearchResultMsg = "No entry found.",
  loadingResultsMsg = "Loading results…",
  createItemLabel = "Create new item…",
}) => {
  const [searchVal, setSearchVal] = useState("");

  return (
    <Command
      loop
      filter={(val, search) =>
        val.toLowerCase().includes(search.toLowerCase())
          ? 1
          : val === "create-new-record"
          ? 1
          : 0
      }
    >
      <CommandInput
        placeholder={placeholder}
        value={searchVal}
        onValueChange={setSearchVal}
      />
      <CommandList>
        {!options && <CommandLoading>{loadingResultsMsg}</CommandLoading>}
        <CommandEmpty>{noSearchResultMsg}</CommandEmpty>
        <CommandGroup>
          {options?.map((opt) => (
            <CommandItem
              key={opt.value}
              value={opt.label}
              onSelect={() => {
                if (!onChange) return;
                onChange(opt.value === currentValue ? "" : opt.value);
                closePopover?.();
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  opt.value === currentValue ? "opacity-100" : "opacity-0"
                )}
              />
              {opt.label}
            </CommandItem>
          ))}

          {onCreate && (
            <CommandItem
              value="create-new-record"
              onSelect={() => {
                onCreate(searchVal);
                setSearchVal("");
                closePopover?.();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {createItemLabel}
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default PopoverContentComboBox;
