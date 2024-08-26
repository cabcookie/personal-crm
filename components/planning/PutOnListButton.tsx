import { ListPlus } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

type PutOnListButtonProps = {
  putTodoOnDailyPlan: () => void;
};

const PutOnListButton: FC<PutOnListButtonProps> = ({ putTodoOnDailyPlan }) => {
  return (
    <div className="w-10 min-w-10 mt-1">
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-row gap-1 py-0 px-2 text-[--context-color-hover]"
        onClick={putTodoOnDailyPlan}
      >
        <ListPlus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default PutOnListButton;
