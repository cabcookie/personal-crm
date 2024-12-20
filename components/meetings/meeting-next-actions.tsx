import { MeetingTodo } from "@/api/useMeetingTodos";
import { Todo } from "@/api/useProjectTodos";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTodoText } from "../ui-elements/editors/helpers/text-generation";
import NextAction from "../ui-elements/project-details/next-action";

type MeetingNextActionsProps = {
  todos: MeetingTodo[] | undefined;
  mutate: (todo: MeetingTodo[], refresh: boolean) => void;
};

const MeetingNextActions: FC<MeetingNextActionsProps> = ({ todos, mutate }) => {
  const mutateTodo = (todo: Todo, refresh: boolean) =>
    todos &&
    mutate(
      todos.map((t) => (t.todoId !== todo.todoId ? t : { ...t, ...todo })),
      refresh
    );

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Agreed Next Actions"
      triggerSubTitle={getTodoText(todos)}
    >
      <div className="space-y-2">
        {todos && todos.length === 0 ? (
          <div className="text-sm text-muted-foreground">No next actions</div>
        ) : (
          todos?.map((todo) => (
            <NextAction key={todo.todoId} {...{ todo, mutate: mutateTodo }} />
          ))
        )}
      </div>
    </DefaultAccordionItem>
  );
};

export default MeetingNextActions;
