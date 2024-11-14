import { ChartConfig } from "@/components/ui/chart";
import { formatRevenue, getTotal } from "@/helpers/charts/charts";
import { flow, get, keys, size } from "lodash/fp";
import { CSSProperties } from "react";
import {
  Formatter,
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const mrrChartTooltip = (chartConfig: ChartConfig) => {
  const MrrFormatter: Formatter<ValueType, NameType> = (
    value,
    name,
    item,
    index
  ) => {
    return (
      <>
        <div
          className="h-2.5 w-1 shrink-0 rounded-[2px] bg-[--color-bg]"
          style={
            {
              "--color-bg": chartConfig[name].color,
            } as CSSProperties
          }
        />
        {name}
        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
          {formatRevenue(value as number, item.payload)}
        </div>
        {index === flow(get("payload"), keys, size)(item) - 2 && (
          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
            Total
            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
              {formatRevenue(getTotal(item.payload))}
            </div>
          </div>
        )}
      </>
    );
  };
  // MrrFormatter.displayName = "MrrChartTooltip";

  return MrrFormatter;
};

export default mrrChartTooltip;
