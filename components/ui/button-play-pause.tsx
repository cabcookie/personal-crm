import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { FC } from "react";
import { ButtonProps } from "./button";
import { IconButton } from "./icon-button";

interface ButtonPlayPauseProps extends ButtonProps {
  state: "PLAY" | "PAUSE";
}

export const ButtonPlayPause: FC<ButtonPlayPauseProps> = ({
  state,
  className,
  ...props
}) => (
  <IconButton
    savingState
    tooltip={
      state === "PLAY"
        ? "Pause project for today"
        : "Work on this project today"
    }
    label={state === "PLAY" ? "Pause Project" : "Focus Project"}
    className={cn("w-32", className)}
    {...props}
  >
    {state === "PLAY" ? (
      <>
        <Play className="group-hover:hidden" />
        <Pause className="hidden group-hover:block" />
      </>
    ) : (
      <>
        <Pause className="group-hover:hidden" />
        <Play className="hidden group-hover:block" />
      </>
    )}
  </IconButton>
);
