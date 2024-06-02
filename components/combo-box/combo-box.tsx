import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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
        <Command
          loop
          filter={(val, search) =>
            val.includes(search) ? 1 : val === "create-new-record" ? 1 : 0
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
                    setOpen(false);
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
                    setOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {createItemLabel}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
