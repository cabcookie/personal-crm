import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";

type PlanWeekActionProps = {
  label: string;
  skip?: () => void;
};

const PlanWeekAction: FC<PlanWeekActionProps> = ({ label, skip }) => {
  const [skipping, setSkipping] = useState(false);

  const handleSkip = () => {
    setSkipping(true);
    skip?.();
  };

  return (
    <div className="border-2 border-[--context-color] rounded-md flex justify-center p-1 font-semibold flex-col items-center text-center">
      <span>Next Action: {label}</span>
      {skip && (
        <Button
          size="sm"
          variant="link"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-primary"
          disabled={skipping}
        >
          {!skipping ? (
            "Skip"
          ) : (
            <div className="flex flex-row gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Skipping
            </div>
          )}
        </Button>
      )}
    </div>
  );
};

export default PlanWeekAction;
