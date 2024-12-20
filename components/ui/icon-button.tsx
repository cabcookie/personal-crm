import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FC, MouseEvent, useState } from "react";
import { Button, ButtonProps } from "./button";

interface IconButtonProps extends ButtonProps {
  savingState?: boolean;
  tooltip?: string;
  label?: string;
}

export const IconButton: FC<IconButtonProps> = ({
  className,
  tooltip,
  label,
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={cn("hover:children:hidden group gap-1", className)}
            disabled={savingState && isSaving}
            onClick={handleClick}
            {...props}
          >
            {savingState && isSaving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {children}
                {label && (
                  <span className="text-muted-foreground hover:text-primary">
                    {label}
                  </span>
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
