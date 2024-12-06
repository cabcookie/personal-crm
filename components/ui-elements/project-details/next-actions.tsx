import useProjectTodos from "@/api/useProjectTodos";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import { getTodoText } from "../editors/helpers/text-generation";
import AddTodoSection from "../editors/todo-editor/AddTodoSection";
import TodoViewer from "../editors/todo-viewer/TodoViewer";

type ProjectNextActionsProps = {
  projectId: string;
};

const ProjectNextActions: FC<ProjectNextActionsProps> = ({ projectId }) => {
  const { projectTodos, createTodo } = useProjectTodos(projectId);

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      triggerSubTitle={getTodoText(projectTodos)}
    >
      <AddTodoSection onSave={createTodo} />

      {projectTodos && <TodoViewer todos={projectTodos} />}
    </DefaultAccordionItem>
  );
};

export default ProjectNextActions;
