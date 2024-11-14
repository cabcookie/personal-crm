import { formatThousands } from "@/helpers/functional";
import { FC } from "react";
import { MonthMrr } from "./analytics-table-column";
import RenderGrowth from "./render-growth";

type RenderMonthMrrProps = {
  monthMrr: MonthMrr | undefined;
  noOfMonths: number;
};

const RenderMonthMrr: FC<RenderMonthMrrProps> = ({ monthMrr, noOfMonths }) =>
  !monthMrr ? (
    <RenderNoData />
  ) : (
    <RenderData {...{ ...monthMrr, noOfMonths }} />
  );

const RenderNoData = () => (
  <div className="min-w-20 text-xs text-muted-foreground">-</div>
);

type RenderDataProps = MonthMrr & {
  noOfMonths: number;
};

const RenderData: FC<RenderDataProps> = ({
  currentMonth,
  lastMonth,
  lastPeriod,
  lastYear,
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
