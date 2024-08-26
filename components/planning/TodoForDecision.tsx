import { JSONContent } from "@tiptap/core";
import { FC, ReactNode } from "react";
import SimpleReadOnly from "../ui-elements/editors/simple-visualizer/SimpleReadOnly";
import PutOnListButton from "./PutOnListButton";
import RemoveFromListButton from "./RemoveFromListButton";

type AddTodoProps = {
  putTodoOnDailyPlan: () => void;
  removeTodoFromDailyPlan?: never;
};

type RemoveTodoProps = {
  putTodoOnDailyPlan?: never;
  removeTodoFromDailyPlan: () => void;
};

type TodoForDecisionProps = (AddTodoProps | RemoveTodoProps) & {
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
  activityId,
  children,
}) => {
  return (
    content &&
    content.length > 0 && (
      <div className="flex flex-row gap-1 items-start">
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
