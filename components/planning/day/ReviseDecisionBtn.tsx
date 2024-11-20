import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC } from "react";

type ReviseDecisionBtnProps = {
  label: string;
  savingDecision: boolean;
  selected: boolean;
  makeDecision?: () => void;
};

const ReviseDecisionBtn: FC<ReviseDecisionBtnProps> = ({
  savingDecision,
  makeDecision,
  selected,
  label,
}) => (
  <Button
    variant="link"
    disabled={savingDecision}
    onClick={selected ? undefined : makeDecision}
    className={cn(
      "text-muted-foreground pl-3 pr-0",
      selected ? "underline cursor-default" : "hover:text-black"
    )}
  >
    {label}
  </Button>
);

export default ReviseDecisionBtn;
