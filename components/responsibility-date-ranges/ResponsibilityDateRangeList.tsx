import { FC } from "react";
import ResponsibilityRecord, {
  Responsibility,
} from "./ResponsibilityDateRangeRecord";

type ResponsibilityDateRangeListProps = {
  responsibilities: Responsibility[];
  deleteResponsibility: (id: string) => Promise<string | undefined>;
};

const ResponsibilityDateRangeList: FC<ResponsibilityDateRangeListProps> = ({
  responsibilities,
  deleteResponsibility,
}) => (
  <div>
    {responsibilities.map((resp) => (
      <ResponsibilityRecord
        key={resp.id}
        responsibility={resp}
        deleteResponsibility={deleteResponsibility}
      />
    ))}
  </div>
);

export default ResponsibilityDateRangeList;
