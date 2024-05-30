import { addDaysToDate } from "@/helpers/functional";
import { FC } from "react";
import ResponsibilityRecord, { Responsibility } from "./ResponsibilityRecord";

type ResponsibilitiesListProps = {
  responsibilities: Responsibility[];
  onlyCurrent?: boolean;
};

const ResponsibilitiesList: FC<ResponsibilitiesListProps> = ({
  responsibilities,
  onlyCurrent,
}) => {
  return (
    <div>
      {responsibilities
        .filter(
          ({ startDate, endDate }) =>
            !onlyCurrent ||
            startDate >= new Date() ||
            !endDate ||
            endDate >= addDaysToDate(-60)(new Date())
        )
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
        .map((resp) => (
          <ResponsibilityRecord key={resp.id} responsibility={resp} />
        ))}
    </div>
  );
};

export default ResponsibilitiesList;
