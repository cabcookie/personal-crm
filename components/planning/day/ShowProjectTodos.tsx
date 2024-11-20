import useProjectTodos, { ProjectTodo } from "@/api/useProjectTodos";
import TodoEditor from "@/components/ui-elements/editors/todo-editor/TodoEditor";
import ShowHideSwitch from "@/components/ui-elements/ShowHideSwitch";
import { filter, flow, identity } from "lodash/fp";
import { FC, useEffect, useState } from "react";

type ShowProjectTodosProps = {
  projectId: string;
};

const ShowProjectTodos: FC<ShowProjectTodosProps> = ({ projectId }) => {
  const { projectTodos } = useProjectTodos(projectId);
  const [openTodos, setOpenTodos] = useState<ProjectTodo[] | undefined>();
  const [closedTodos, setClosedTodos] = useState<ProjectTodo[] | undefined>();
  const [showClosed, setShowClosed] = useState(false);

  useEffect(() => {
    flow(
      identity<ProjectTodo[] | undefined>,
      filter((t) => !t.done),
      setOpenTodos
    )(projectTodos);
    flow(
      identity<ProjectTodo[] | undefined>,
      filter((t) => t.done),
      setClosedTodos
    )(projectTodos);
  }, [projectTodos]);

  return (
    <div>
      {!!openTodos?.length && <TodoEditor todos={openTodos} />}

      <ShowHideSwitch
        value={showClosed}
        onChange={setShowClosed}
        switchLabel="closed todos"
        className="ml-1 md:ml-2"
      />

      {showClosed && closedTodos?.length && <TodoEditor todos={closedTodos} />}
    </div>
  );
};

export default ShowProjectTodos;
