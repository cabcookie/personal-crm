import { Loader2 } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

type DecisionButtonProps = {
  selected: boolean;
  label: string;
  makeDecision: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

const DecisionButton: FC<DecisionButtonProps> = ({
  selected,
  label,
  makeDecision,
  isLoading,
  disabled,
}) => (
  <Button
    onClick={makeDecision}
    variant={selected ? "default" : "outline"}
    disabled={!!isLoading || disabled}
    className="px-2 h-8"
  >
    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {label}
  </Button>
);

export default DecisionButton;
