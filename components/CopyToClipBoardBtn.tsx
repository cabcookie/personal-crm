import { FC, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyToClipBoardBtnProps {
  content: string;
  label?: string;
}

export const CopyToClipBoardBtn: FC<CopyToClipBoardBtnProps> = ({
  content,
  label = "Copy & Paste to Amazon Q",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handlyCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy projects:", error);
    }
  };

  return (
    <>
      <Button
        onClick={handlyCopy}
        variant="ghost"
        size="icon"
        className="transition-all duration-200 p-0 size-7"
      >
        {isCopied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
      <span className="text-sm font-normal text-muted-foreground">{label}</span>
    </>
  );
};
