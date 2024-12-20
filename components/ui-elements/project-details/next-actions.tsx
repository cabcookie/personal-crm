import useProjectTodos, { ProjectTodo } from "@/api/useProjectTodos";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import { getTodoText } from "../editors/helpers/text-generation";
import AddTodoSection from "../editors/todo-editor/AddTodoSection";
import NextAction from "./next-action";

type ProjectNextActionsProps = {
  projectId: string;
};

const ProjectNextActions: FC<ProjectNextActionsProps> = ({ projectId }) => {
  const { projectTodos, createTodo, mutate } = useProjectTodos(projectId);

  const mutateTodo = (todo: ProjectTodo, refresh: boolean) =>
    projectTodos &&
    mutate(
      projectTodos.map((t) => (t.todoId !== todo.todoId ? t : todo)),
      refresh
    );

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      triggerSubTitle={getTodoText(projectTodos)}
    >
      <div className="space-y-2">
        <AddTodoSection onSave={createTodo} />

        {projectTodos && projectTodos.length === 0 ? (
          <div className="text-sm text-muted-foreground">No next actions</div>
        ) : (
          projectTodos?.map((todo) => (
            <NextAction
              key={todo.todoId}
              {...{
                todo,
                mutate: mutateTodo,
              }}
            />
          ))
        )}
      </div>
    </DefaultAccordionItem>
  );
};

export default ProjectNextActions;
