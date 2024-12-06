import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FC, MouseEvent, useState } from "react";
import { Button, ButtonProps } from "./button";

interface IconButtonProps extends ButtonProps {
  savingState?: boolean;
}

export const IconButton: FC<IconButtonProps> = ({
  className,
  onClick,
  children,
  savingState,
  ...props
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;
    setIsSaving(true);
    onClick(event);
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn("hover:children:hidden group", className)}
      disabled={savingState && isSaving}
      onClick={handleClick}
      {...props}
    >
      {savingState && isSaving ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};
