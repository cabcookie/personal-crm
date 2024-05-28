import { Button } from "@/components/ui/button";
import { FC } from "react";

type ButtonGroupProps = {
  values: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

const ButtonGroup: FC<ButtonGroupProps> = ({
  values,
  selectedValue,
  onSelect,
}) => (
  <div
    className={`h-10 rounded-md bg-muted p-1 text-muted-foreground w-full flex flex-row justify-between`}
  >
    {values.map((val) => (
      <Button
        key={val}
        variant={val === selectedValue ? "contextColor" : "ghost"}
        className="h-8"
        onClick={() => onSelect(val)}
      >
        {val.toUpperCase()}
      </Button>
    ))}
  </div>
);

export default ButtonGroup;

/**
 *     role="tablist"
    aria-orientation="horizontal"
    className={`h-10 rounded-md bg-muted p-1 text-muted-foreground w-full grid grid-cols-${values.length}`}

 */
