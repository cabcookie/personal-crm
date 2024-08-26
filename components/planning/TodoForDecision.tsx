import { JSONContent } from "@tiptap/core";
import { FC, ReactNode } from "react";
import SimpleReadOnly from "../ui-elements/editors/simple-visualizer/SimpleReadOnly";
import { Checkbox } from "../ui/checkbox";
import PutOnListButton from "./PutOnListButton";
import RemoveFromListButton from "./RemoveFromListButton";

type FinishTodoProps = {
  finishTodoOnDailyPlan: () => void;
  todoStatus: boolean;
  putTodoOnDailyPlan?: never;
  removeTodoFromDailyPlan?: never;
};

type AddTodoProps = {
  finishTodoOnDailyPlan?: never;
  todoStatus?: never;
  putTodoOnDailyPlan: () => void;
  removeTodoFromDailyPlan?: never;
};

type RemoveTodoProps = {
  finishTodoOnDailyPlan?: never;
  todoStatus?: never;
  putTodoOnDailyPlan?: never;
  removeTodoFromDailyPlan: () => void;
};

type TodoForDecisionProps = (
  | FinishTodoProps
  | AddTodoProps
  | RemoveTodoProps
) & {
  content: JSONContent[] | undefined;
  activityId: string;
  children?: ReactNode;
};

const addLinkToActivity = (content: JSONContent[], activityId: string) => [
  ...content,
  {
    type: "paragraph",
    content: [
      {
        marks: [
          {
            type: "link",
            attrs: {
              rel: "noopener noreferrer nofollow",
              href: `/activities/${activityId}`,
              class:
                "no-underline text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2",
              target: "_blank",
            },
          },
          { type: "italic" },
        ],
        text: "Link to Notes",
        type: "text",
      },
    ],
  },
];

const TodoForDecision: FC<TodoForDecisionProps> = ({
  content,
  putTodoOnDailyPlan,
  removeTodoFromDailyPlan,
  finishTodoOnDailyPlan,
  todoStatus,
  activityId,
  children,
}) => {
  return (
    content &&
    content.length > 0 && (
      <div className="flex flex-row gap-1 items-start">
        {finishTodoOnDailyPlan && (
          <div className="w-6 min-w-6 mt-[0.6rem]">
            <Checkbox
              checked={todoStatus}
              onCheckedChange={finishTodoOnDailyPlan}
              className=""
            />
          </div>
        )}
        {putTodoOnDailyPlan && (
          <PutOnListButton putTodoOnDailyPlan={putTodoOnDailyPlan} />
        )}
        {removeTodoFromDailyPlan && (
          <RemoveFromListButton
            removeTodoFromDailyPlan={removeTodoFromDailyPlan}
          />
        )}

        <div className="flex-1">
          <SimpleReadOnly content={addLinkToActivity(content, activityId)} />
          {children}
        </div>
      </div>
    )
  );
};

export default TodoForDecision;
