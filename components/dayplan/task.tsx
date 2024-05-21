import { type Schema } from "@/amplify/data/resource";
import { DayPlanTodo } from "@/api/useDayplans";
import { FC, FormEvent, useState } from "react";
import { IoCheckboxSharp, IoSquareOutline } from "react-icons/io5";
import SubmitButton from "../ui-elements/buttons/submit-button";
import ProjectSelector from "../ui-elements/project-selector";
import ProjectName from "../ui-elements/tokens/project-name";
import styles from "./Task.module.css";

type TaskProps = {
  todo: DayPlanTodo;
  switchTodoDone: (taskId: string, done: boolean) => void;
  isNew?: boolean;
  createTodo?: (
    todo: string,
    projectId?: string
  ) => Promise<Schema["DayPlanTodo"]["type"] | undefined>;
};

const Task: FC<TaskProps> = ({
  todo: { id, todo, done, projectId },
  switchTodoDone,
  isNew,
  createTodo,
}) => {
  const [task, setTask] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTodo && createTodo(task, taskProjectId || undefined);
    setTask("");
    setTaskProjectId(null);
  };

  const handleProjectChange = (projectId: string | null) => {
    setTaskProjectId(projectId);
  };

  return (
    <article>
      <div className={styles.postLine}>
        <a
          className={styles.postCheckbox}
          onClick={() => !isNew && switchTodoDone(id, done)}
        >
          {!done ? <IoSquareOutline /> : <IoCheckboxSharp />}
        </a>
        {!isNew ? (
          <div className={styles.postBody}>
            <div>{todo}</div>
            <div className={styles.description}>
              {projectId && <ProjectName projectId={projectId} />}
            </div>
          </div>
        ) : (
          <div className={styles.postBody}>
            <form onSubmit={handleSubmit}>
              <input
                className={styles.taskInput}
                type="text"
                value={task}
                onChange={(event) => setTask(event.target.value)}
                placeholder="Add a todo..."
              />
              <div className={styles.description}>
                {taskProjectId && <ProjectName projectId={taskProjectId} />}
                <ProjectSelector
                  allowCreateProjects
                  onChange={handleProjectChange}
                />
                <SubmitButton type="submit" disabled={task === ""}>
                  Create Todo
                </SubmitButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};

export default Task;
