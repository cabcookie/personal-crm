import { format } from "date-fns";
import { FC } from "react";

export type Responsibility = {
  id: string;
  startDate: Date;
  endDate?: Date;
};

type ResponsibilityRecordProps = {
  responsibility: Responsibility;
};

const ResponsibilityRecord: FC<ResponsibilityRecordProps> = ({
  responsibility: { startDate, endDate },
}) => {
  return (
    <div>
      Since{" "}
      {[startDate, ...(endDate ? [endDate] : [])]
        .map((date) => format(date, "PPP"))
        .join(" to ")}
      .
    </div>
  );
};

export default ResponsibilityRecord;
