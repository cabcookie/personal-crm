import { format } from "date-fns";
import { FC } from "react";
import ResponsibilitiesDialog from "./responsibilities-dialog";

export type Responsibility = {
  id: string;
  startDate: Date;
  endDate?: Date;
};

type ResponsibilityRecordProps = {
  responsibility: Responsibility;
};

const ResponsibilityRecord: FC<ResponsibilityRecordProps> = ({
  responsibility: { id, startDate, endDate },
}) => {
  return (
    <div className="flex flex-row gap-2">
      Since{" "}
      {[startDate, ...(endDate ? [endDate] : [])]
        .map((date) => format(date, "PPP"))
        .join(" to ")}
      .
      <ResponsibilitiesDialog
        updateAccount={{ id, startDate, endDate }}
        updateResponsibility={(r) => {
          console.log(r);
        }}
      />
    </div>
  );
};

export default ResponsibilityRecord;
