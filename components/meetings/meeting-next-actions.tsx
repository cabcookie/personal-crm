import useMeetingTodos, { MeetingTodo } from "@/api/useMeetingTodos";
import { filter, flow, get, map, trim } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromEditorJsonContent } from "../ui-elements/editors/helpers/text-generation";
import TodoEditor from "../ui-elements/editors/todo-editor/TodoEditor";

type MeetingNextActionsProps = {
  meetingId: string;
};

const getTodosText = flow(
  filter((t: MeetingTodo) => !t.done),
  map(get("todo")),
  map(getTextFromEditorJsonContent),
  map(trim)
);

const MeetingNextActions: FC<MeetingNextActionsProps> = ({ meetingId }) => {
  const { meetingTodos } = useMeetingTodos(meetingId);

  return (
    meetingTodos &&
    meetingTodos.length > 0 && (
      <DefaultAccordionItem
        value="next-actions"
        triggerTitle="Agreed Next Actions"
        triggerSubTitle={getTodosText(meetingTodos)}
      >
        <TodoEditor meetingTodos={meetingTodos} />
      </DefaultAccordionItem>
    )
  );
};

export default MeetingNextActions;
