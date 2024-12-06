import { useProjectsContext } from "@/api/ContextProjects";
import useProjectTodos from "@/api/useProjectTodos";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import { getTodoText } from "../editors/helpers/text-generation";
import AddTodoSection from "../editors/todo-editor/AddTodoSection";
import TodoViewer from "../editors/todo-viewer/TodoViewer";

type ProjectNextActionsProps = {
  projectId: string;
};

const ProjectNextActions: FC<ProjectNextActionsProps> = ({ projectId }) => {
  const { projects } = useProjectsContext();
  const [project, setProject] = useState(
    projects?.find((p) => p.id === projectId)
  );
  const { projectTodos, createTodo } = useProjectTodos(projectId);

  useEffect(() => {
    setProject(projects?.find((p) => p.id === projectId));
  }, [projects, projectId]);

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Next Actions"
      triggerSubTitle={getTodoText(projectTodos)}
      isVisible={
        (projectTodos && projectTodos.length > 0) ||
        !!project?.myNextActions ||
        !!project?.othersNextActions
      }
    >
      <AddTodoSection onSave={createTodo} />

      {projectTodos && <TodoViewer todos={projectTodos} />}
    </DefaultAccordionItem>
  );
};

export default ProjectNextActions;
