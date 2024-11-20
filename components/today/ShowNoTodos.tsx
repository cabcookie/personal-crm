import { cn } from "@/lib/utils";
import { FC } from "react";

type ShowNoTodosProps = {
  className?: string;
};

const ShowNoTodos: FC<ShowNoTodosProps> = ({ className }) => {
  return (
    <div
      className={cn("font-semibold text-sm text-muted-foreground", className)}
    >
      No open todos.
    </div>
  );
};

export default ShowNoTodos;
