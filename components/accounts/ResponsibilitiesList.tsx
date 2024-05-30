import { FC } from "react";
import ResponsibilityRecord, { Responsibility } from "./ResponsibilityRecord";

type ResponsibilitiesListProps = {
  responsibilities: Responsibility[];
};

const ResponsibilitiesList: FC<ResponsibilitiesListProps> = ({
  responsibilities,
}) => {
  return (
    <div>
      {responsibilities
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
        .map((resp) => (
          <ResponsibilityRecord key={resp.id} responsibility={resp} />
        ))}
    </div>
  );
};

export default ResponsibilitiesList;
