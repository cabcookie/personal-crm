import { Button } from "@/components/ui/button";
import { FC } from "react";

type ButtonGroupProps = {
  elementId?: string;
  values: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

const ButtonGroup: FC<ButtonGroupProps> = ({
  elementId,
  values,
  selectedValue,
  onSelect,
  disabled,
}) => (
  <div
    id={elementId}
    className={`h-10 rounded-md bg-muted p-1 text-muted-foreground w-full flex flex-row justify-between`}
  >
    {values.map((val) => (
      <Button
        key={val}
        variant={val === selectedValue ? "contextColor" : "ghost"}
        className="h-8"
        onClick={() => onSelect(val)}
        disabled={disabled}
      >
        {val.toUpperCase()}
      </Button>
    ))}
  </div>
);

export default ButtonGroup;
