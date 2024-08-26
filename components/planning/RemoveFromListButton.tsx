import { ListX } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

type RemoveFromListButtonProps = {
  removeTodoFromDailyPlan: () => void;
};

const RemoveFromListButton: FC<RemoveFromListButtonProps> = ({
  removeTodoFromDailyPlan,
}) => {
  return (
    <div className="w-10 min-w-10 mt-1">
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-row gap-1 py-0 px-2 text-[--context-color-hover]"
        onClick={removeTodoFromDailyPlan}
      >
        <ListX className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default RemoveFromListButton;
