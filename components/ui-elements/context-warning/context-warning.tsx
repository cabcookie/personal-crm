import { Button } from "@/components/ui/button";
import { Context, useContextContext } from "@/contexts/ContextContext";
import { FC } from "react";
import styles from "./ContextWarning.module.css";

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
      <div className={className}>
        You are working currently in the{" "}
        <span className={styles.warning}>{context?.toUpperCase()}</span>{" "}
        context. Your project is not visible in this context. Do you want to
        switch to the{" "}
        <span className={styles.warning}>{recordContext?.toUpperCase()}</span>
        context?
        <Button
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
