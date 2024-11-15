import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { FC } from "react";

type ShowHideDonePostponedBtnProps = {
  showDonePostponed: boolean;
  onSwitch: () => void;
  className?: string;
};

const ShowHideDonePostponedBtn: FC<ShowHideDonePostponedBtnProps> = ({
  showDonePostponed,
  onSwitch,
  className,
}) => {
  const Icon = showDonePostponed ? ChevronUpCircle : ChevronDownCircle;
  return (
    <div className={cn(className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onSwitch}
        className={cn(
          showDonePostponed
            ? "bg-red-50 hover:bg-red-100"
            : "bg-green-50 hover:bg-green-200"
        )}
      >
        <Icon className={cn("w-4 h-4 mr-1")} />
        {!showDonePostponed ? "Show" : "Hide"} done & postponed…
      </Button>
    </div>
  );
};

export default ShowHideDonePostponedBtn;
