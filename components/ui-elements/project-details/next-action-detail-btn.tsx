import { Todo } from "@/api/useProjectTodos";
import { cn } from "@/lib/utils";
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface NextActionDetailBtnProps {
  todo: Todo;
  className?: string;
}

const NextActionDetailBtn: FC<NextActionDetailBtnProps> = ({
  todo,
  className,
}) => (
  <Link
    href={`/activities/${todo.activityId}`}
    target="_blank"
    className={cn(
      "flex flex-row items-baseline gap-1 text-muted-foreground hover:text-primary",
      className
    )}
  >
    <ArrowUpRightFromSquare className="w-4 h-4" />
    <span className="text-sm -translate-y-0.5">Details</span>
  </Link>
);

export default NextActionDetailBtn;
