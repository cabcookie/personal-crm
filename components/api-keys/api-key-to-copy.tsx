import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Check, Copy } from "lucide-react";
import { FC, useState } from "react";

interface ApiKeyProps {
  apiKey: string;
}

export const ApiKeyToCopy: FC<ApiKeyProps> = ({ apiKey }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyApiKey = async (apiKey: string) => {
    await navigator.clipboard.writeText(apiKey);
    setCopiedKey(apiKey);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span className="truncate max-w-[300px]">{apiKey}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => handleCopyApiKey(apiKey)}
      >
        {copiedKey === apiKey ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
