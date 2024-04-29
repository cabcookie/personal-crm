import { FC, useEffect, useState } from "react";
import styles from "./ContextSwitcher.module.css";
import contextStyles from "../layouts/ContextColors.module.css";
import { Context, useContextContext } from "@/contexts/ContextContext";
import SelectionSlider from "../ui-elements/selection-slider/selection-slider";

export const contexts: Context[] = ["family", "hobby", "work"];

type ContextSwitcherProps = {
  context?: Context;
};

const ContextSwitcher: FC<ContextSwitcherProps> = ({ context }) => {
  const { setContext } = useContextContext();
  const [btnColor, setBtnColor] = useState(`var(--${context}-color-main)`);

  useEffect(() => setBtnColor(`var(--${context}-color-main)`), [context]);

  return (
    <div
      className={`${contextStyles[`${context}ColorScheme`]} ${
        styles.contextSwitcherContainer
      }`}
    >
      <div className={styles.title}>Switch Context:</div>
      <SelectionSlider
        valueList={contexts}
        value={context || "family"}
        onChange={setContext}
        btnColor={btnColor}
      />
    </div>
  );
};

export default ContextSwitcher;
