import { ChevronUp, ChevronDown } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface OrderButtonsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const OrderButtons: FC<OrderButtonsProps> = ({ onMoveDown, onMoveUp }) =>
  (onMoveDown || onMoveUp) && (
    <div className="flex flex-col gap-1">
      {onMoveUp && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            onMoveUp();
            e.stopPropagation();
          }}
          asChild
        >
          <ChevronUp className="m-0.5 h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      )}
      {onMoveDown && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            onMoveDown();
            e.stopPropagation();
          }}
          asChild
        >
          <ChevronDown className="m-0.5 h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      )}
    </div>
  );

export { OrderButtons };
