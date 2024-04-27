import { FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DateSelector.module.css";

type DateSelectorProps = {
  selectHours?: boolean;
  date?: Date;
  setDate: (date: Date) => void;
};

const DateSelector: FC<DateSelectorProps> = ({
  date,
  setDate,
  selectHours,
}) => {
  return (
    <DatePicker
      closeOnScroll={true}
      selected={date}
      onChange={setDate}
      showTimeSelect={selectHours}
      timeIntervals={15}
      showWeekNumbers
      todayButton="Today"
      dateFormat={`dd MMM YYYY${selectHours ? ", hh:mm" : ""}`}
      className={styles.picker}
    />
  );
};

export default DateSelector;
