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
  /**
   * When provided, the input is treated as a REMOTE search: each change is
   * forwarded here (debounced by the caller's data layer) and the client-side
   * cmdk filtering is disabled, since `options` already reflects server-side
   * results. Use for large datasets that must not be fully loaded (people).
   */
  onSearch?: (query: string) => void;
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
  onSearch,
  placeholder = "Search for entry…",
  noSearchResultMsg = "No entry found.",
  loadingResultsMsg = "Loading results…",
  createItemLabel = "Create new item…",
}) => {
  const [searchVal, setSearchVal] = useState("");

  return (
    <Command
      loop
      // For remote search the server already filtered — don't also filter
      // client-side (except keeping the create-new row visible).
      filter={
        onSearch
          ? (val) => (val === "create-new-record" ? 1 : 1)
          : (val, search) =>
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
        onValueChange={(v) => {
          setSearchVal(v);
          onSearch?.(v);
        }}
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
