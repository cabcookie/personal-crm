import { Todo } from "@/api/useProjectTodos";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTodoText } from "../ui-elements/editors/helpers/text-generation";
import TodoEditor from "../ui-elements/editors/todo-editor/TodoEditor";

type MeetingNextActionsProps = {
  todos: Todo[] | undefined;
};

const MeetingNextActions: FC<MeetingNextActionsProps> = ({ todos }) =>
  todos &&
  todos.length > 0 && (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Agreed Next Actions"
      triggerSubTitle={getTodoText(todos)}
    >
      <TodoEditor todos={todos} />
    </DefaultAccordionItem>
  );

export default MeetingNextActions;
