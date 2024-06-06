import { DayPlanTodo } from "@/api/useDayplans";
import { cn } from "@/lib/utils";
import { Edit, Trash } from "lucide-react";
import { FC, useState } from "react";
import ProjectName from "../ui-elements/tokens/project-name";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

type TaskProps = {
  todo: DayPlanTodo;
  switchTodoDone: (taskId: string, done: boolean) => void;
  updateTodo: (todo: string, todoId: string) => void;
  deleteTodo: (todoId: string) => void;
  editable?: boolean;
};

const Task: FC<TaskProps> = ({
  todo: { id, todo, done, projectId },
  switchTodoDone,
  updateTodo,
  deleteTodo,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoValue, setTodoValue] = useState(todo);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="items-top flex space-x-2 text-base md:text-lg">
        <Checkbox
          id={id}
          checked={done}
          onCheckedChange={() => switchTodoDone(id, done)}
          className="mt-[0.2rem]"
        />
        <div className="grid gap-1 leading-none">
          <label
            htmlFor={id}
            className={cn(
              "text-base md:text-xl peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-2",
              done && "line-through"
            )}
          >
            {isEditing ? (
              <>
                <Input
                  value={todoValue}
                  onChange={(e) => {
                    setTodoValue(e.target.value);
                  }}
                  size={40}
                />
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    updateTodo(todoValue, id);
                    setIsEditing(false);
                  }}
                >
                  Confirm
                </Button>
              </>
            ) : (
              <>
                {todo}
                {editable && (
                  <>
                    <Edit
                      className="w-4 h-4 mt-1 text-muted-foreground hover:text-primary"
                      onClick={(event) => {
                        event.preventDefault();
                        setIsEditing(true);
                      }}
                    />
                    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                      <AlertDialogTrigger asChild>
                        <Trash
                          className="w-4 h-4 mt-1 text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setAlertOpen(true);
                          }}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete confirmation
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Confirm if you would like to delete the todo &quot;
                            {todo}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteTodo(id);
                            }}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </>
            )}
          </label>
          {projectId && (
            <div
              className={cn("text-muted-foreground", done && "line-through")}
            >
              <ProjectName projectId={projectId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
