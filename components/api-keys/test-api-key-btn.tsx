import useApiKeys from "@/api/useApiKeys";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";

interface TestApiKeyBtnProps {
  apiKey: string;
  onResult: (result: any) => void;
}

export const TestApiKeyBtn: FC<TestApiKeyBtnProps> = ({ apiKey, onResult }) => {
  const { testApiKey } = useApiKeys();
  const [testing, setTesting] = useState(false);

  const handleTestApiKey = async (apiKey: string) => {
    setTesting(true);
    try {
      const result = await testApiKey(apiKey);
      onResult(result);
      toast({
        title: "Test successful",
        description: "API key is working correctly.",
      });
    } catch {
      toast({
        title: "Test failed",
        description: "Failed to test API key. Please check the logs.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleTestApiKey(apiKey)}
      disabled={testing}
    >
      {testing ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Testing...
        </>
      ) : (
        "Test"
      )}
    </Button>
  );
};
