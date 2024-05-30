import { useAccountsContext } from "@/api/ContextAccounts";
import { format } from "date-fns";
import { FC } from "react";
import ResponsibilitiesDialog from "./responsibilities-dialog";

export type Responsibility = {
  id: string;
  accountId: string;
  accountName: string;
  startDate: Date;
  endDate?: Date;
};

type ResponsibilityRecordProps = {
  responsibility: Responsibility;
};

const ResponsibilityRecord: FC<ResponsibilityRecordProps> = ({
  responsibility,
}) => {
  const { updateResponsibility } = useAccountsContext();

  return (
    <div className="flex flex-row gap-2">
      Since{" "}
      {[
        responsibility.startDate,
        ...(responsibility.endDate ? [responsibility.endDate] : []),
      ]
        .map((date) => format(date, "PPP"))
        .join(" to ")}
      .
      <ResponsibilitiesDialog
        updateAccount={responsibility}
        updateResponsibility={updateResponsibility}
      />
    </div>
  );
};

export default ResponsibilityRecord;
