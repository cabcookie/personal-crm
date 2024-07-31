import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PopoverContentComboBox, {
  PopoverContentComboBoxProps,
} from "./popover-content-combo-box";

type ComboBoxProps = PopoverContentComboBoxProps & {
  disabled?: boolean;
};

const ComboBox: FC<ComboBoxProps> = ({
  options,
  currentValue,
  disabled,
  placeholder = "Search for entry…",
  ...popoverContentComboBoxProps
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "px-2 md:px-4 w-full justify-between",
            !currentValue && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {options?.find((o) => o.value === currentValue)?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <PopoverContentComboBox
          {...popoverContentComboBoxProps}
          {...{ options, currentValue, placeholder }}
          closePopover={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
