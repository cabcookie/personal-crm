import { FC } from "react";
import SubmitButton from "../ui-elements/buttons/submit-button";
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
        <SubmitButton
          key={response.response}
          onClick={() => action(response)}
          btnClassName={response.responseClassName}
        >
          {response.response}
        </SubmitButton>
      ))}
    </div>
  </div>
);

export default Question;
