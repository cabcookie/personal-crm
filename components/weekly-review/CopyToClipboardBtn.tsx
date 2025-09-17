import { FC, useState } from "react";
import { ButtonInAccordion } from "./ButtonInAccordion";
import { Check, Copy } from "lucide-react";

interface CopyToClipboardBtnProps {
  content: string;
}

export const CopyToClipboardBtn: FC<CopyToClipboardBtnProps> = ({
  content,
}) => {
  const [copyState, setCopyState] = useState<"" | "COPYING" | "DONE">("");

  const copyToClipboard = async () => {
    setCopyState("COPYING");
    try {
      await navigator.clipboard.writeText(content);
      setCopyState("DONE");
      setTimeout(() => setCopyState(""), 2000);
    } catch (err) {
      console.error("Failed to copy content:", err);
      setCopyState("");
    }
  };

  return (
    <ButtonInAccordion
      onClick={copyState === "" ? copyToClipboard : undefined}
      label={
        copyState === "COPYING"
          ? "Copying..."
          : copyState === "DONE"
            ? "Copied"
            : "Copy"
      }
      Icon={copyState === "DONE" ? Check : Copy}
    />
  );
};
