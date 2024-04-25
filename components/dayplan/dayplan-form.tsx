import { FC, FormEvent, useState } from "react";
import DateSelector from "../ui-elements/date-selector";
import SubmitButton from "../ui-elements/submit-button";
import styles from "./DayPlan.module.css";

type DayPlanFormProps = {
  onSubmit: (goal: string, date: string) => void;
};

const DayPlanForm: FC<DayPlanFormProps> = ({ onSubmit }) => {
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(new Date());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    confirm();
  };

  const confirm = () => {
    onSubmit(goal, date.toISOString().split("T")[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={`${styles.fullWidth} ${styles.dayGoal}`}>
          <input
            className={styles.fullWidth}
            value={goal}
            autoFocus
            onChange={(event) => setGoal(event.target.value)}
            placeholder="Give the day a goal"
          />
        </div>
      </form>
      <DateSelector date={date} setDate={setDate} />
      <SubmitButton onClick={confirm}>Confirm</SubmitButton>
    </div>
  );
};

export default DayPlanForm;
