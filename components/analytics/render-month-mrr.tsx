import { formatThousands } from "@/helpers/functional";
import { FC } from "react";
import { MonthMrr } from "./analytics-table-column";
import RenderGrowth from "./render-growth";

type RenderMonthMrrProps = {
  monthMrr: MonthMrr;
  noOfMonths: number;
};

const RenderMonthMrr: FC<RenderMonthMrrProps> = ({
  monthMrr: { currentMonth, lastMonth, lastPeriod, lastYear },
  noOfMonths,
}) => (
  <div className="flex flex-col gap-1">
    <div>{formatThousands(currentMonth)}</div>
    <div className="text-xs flex flex-col gap-0.5 justify-end tracking-tight">
      <RenderGrowth
        currentPeriod={currentMonth}
        lastPeriod={lastMonth}
        label="MoM"
      />
      {noOfMonths !== 12 && (
        <RenderGrowth
          currentPeriod={currentMonth}
          lastPeriod={lastPeriod}
          label={`${noOfMonths}M`}
        />
      )}
      <RenderGrowth
        currentPeriod={currentMonth}
        lastPeriod={lastYear}
        label="YoY"
      />
    </div>
  </div>
);

export default RenderMonthMrr;
