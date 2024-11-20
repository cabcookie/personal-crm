import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

type ShowHideSwitchProps = {
  value: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  switchLabel: string;
  className?: string;
};

const ShowHideSwitch: FC<ShowHideSwitchProps> = ({
  value,
  onChange,
  switchLabel,
  className,
}) => (
  <div
    className={cn(
      "text-muted-foreground hover:text-blue-400 cursor-pointer",
      className
    )}
    onClick={() => onChange((val) => !val)}
  >
    {!value ? "Show" : "Hide"} {switchLabel}…
  </div>
);

export default ShowHideSwitch;
