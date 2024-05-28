import { FC } from "react";
import { Button } from "../ui/button";
import { WorkflowStepComponentProps } from "./workflow";

const Question: FC<WorkflowStepComponentProps> = ({
  question,
  responses,
  action,
}) => (
  <div className="flex flex-row align-middle font-bold gap-4">
    {question}
    <div className="font-normal flex flex-row align-middle gap-2">
      {responses?.map((response) => (
        <Button
          key={response.response}
          {...response.btnVariant}
          onClick={() => action(response)}
        >
          {response.response}
        </Button>
      ))}
    </div>
  </div>
);

export default Question;
