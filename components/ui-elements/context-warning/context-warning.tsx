import { Context, useContextContext } from "@/contexts/ContextContext";
import { FC } from "react";
import SubmitButton from "../buttons/submit-button";
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
        <SubmitButton
          onClick={() => {
            if (!recordContext) return;
            setContext(recordContext);
          }}
        >
          Yes
        </SubmitButton>
      </div>
    )
  );
};

export default ContextWarning;
