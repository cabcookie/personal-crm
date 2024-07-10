import { formatRevenue } from "@/helpers/functional";
import { addDays, format } from "date-fns";
import { flow, get, last, map, reduce, sortBy } from "lodash/fp";
import { Trash2 } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

export const sortResponsibility = (r: Responsibility): number =>
  -r.startDate.getTime();

type ResponsibilityData = {
  id: string;
  startDate: string;
  endDate?: string | null;
  quota?: number | null;
};

export type Responsibility = {
  id: string;
  parentId: string;
  parentTitle: string;
  startDate: Date;
  endDate?: Date;
  quota?: number;
};

const addEndDates = (
  prev: Responsibility[],
  curr: Responsibility
): Responsibility[] => {
  if (prev.length === 0) return [curr];
  return [
    ...prev,
    {
      ...curr,
      endDate: flow(last, get("startDate"), (d) => addDays(d, -1))(prev),
    },
  ];
};

export const mapResponsibilities: (
  parentId: string,
  parentTitle: string
) => (responsibilities: ResponsibilityData[]) => Responsibility[] = (
  parentId,
  parentTitle
) =>
  flow(
    map(mapResponsibility(parentId, parentTitle)),
    sortBy(sortResponsibility),
    reduce(addEndDates, [])
  );

const mapResponsibility =
  (parentId: string, parentTitle: string) =>
  ({ id, startDate, quota }: ResponsibilityData): Responsibility => ({
    id,
    parentId,
    parentTitle,
    startDate: new Date(startDate),
    quota: quota || undefined,
  });

type ResponsibilityDateRangeRecordProps = {
  responsibility: Responsibility;
  deleteResponsibility: (id: string) => Promise<string | undefined>;
};

const ResponsibilityDateRangeRecord: FC<ResponsibilityDateRangeRecordProps> = ({
  responsibility,
  deleteResponsibility,
}) => (
  <div className="flex flex-row gap-2">
    {`${!responsibility.endDate ? "Since" : "Between"} ${[
      responsibility.startDate,
      ...(responsibility.endDate ? [responsibility.endDate] : []),
    ]
      .map((date) => format(date, "PPP"))
      .join(" and ")}. ${
      !responsibility.quota
        ? ""
        : `(Quota: ${formatRevenue(responsibility.quota)})`
    }`}
    <Button
      variant="ghost"
      size="icon"
      asChild
      onClick={() => deleteResponsibility(responsibility.id)}
    >
      <Trash2 className="translate-y-0.5 w-5 h-5 text-muted-foreground hover:text-primary" />
    </Button>
  </div>
);

export default ResponsibilityDateRangeRecord;
