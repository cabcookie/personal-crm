import { Button } from "@/components/ui/button";
import { Context, useContextContext } from "@/contexts/ContextContext";
import { cn } from "@/lib/utils";
import { FC } from "react";

type ContextWarningProps = {
  recordContext?: Context;
  className?: string;
};

const ContextWarning: FC<ContextWarningProps> = ({
  recordContext,
  className,
}) => {
  const { context, setContext } = useContextContext();
  return (
    context !== recordContext && (
      <div className={cn(className, "flex flex-col space-y-2")}>
        <div>
          You are working currently in the{" "}
          <span className="text-destructive">{context?.toUpperCase()}</span>{" "}
          context. Your project is not visible in this context. Do you want to
          switch to the{" "}
          <span className="text-destructive">
            {recordContext?.toUpperCase()}
          </span>{" "}
          context?
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (!recordContext) return;
            setContext(recordContext);
          }}
        >
          Yes
        </Button>
      </div>
    )
  );
};

export default ContextWarning;
