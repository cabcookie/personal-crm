import { FC } from "react";
import { Button } from "../ui/button";
import styles from "./Inbox.module.css";
import { WorkflowStepComponentProps } from "./workflow";

const Question: FC<WorkflowStepComponentProps> = ({
  question,
  responses,
  action,
}) => (
  <div className={styles.question}>
    {question}
    <div className={styles.decisionBtns}>
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
