import { useAccountsContext } from "@/api/ContextAccounts";
import { useMrrFilter } from "@/components/analytics/useMrrFilter";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ChartData,
  formatMonth,
  getSortedChartConfig,
  setChartConfigFromChartData,
  setChartDataFromNoOfMonths,
} from "@/helpers/charts/charts";
import { formatDate, formatRevenue } from "@/helpers/functional";
import { flow, keys, size } from "lodash/fp";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import mrrChartTooltip from "./mrr-tooltip";

const AnalyticsMrrChart = () => {
  const { mrrFilter, mrr } = useMrrFilter();
  const { accounts } = useAccountsContext();
  const [noOfMonths, setNoOfMonths] = useState(0);
  const [chartData, setChartData] = useState<ChartData[] | undefined>();
  const [chartConfig, setChartConfig] = useState<ChartConfig | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();

  useEffect(() => {
    flow(parseInt, setNoOfMonths)(mrrFilter);
  }, [mrrFilter]);

  useEffect(() => {
    setChartDataFromNoOfMonths(noOfMonths, mrr, accounts, setChartData);
  }, [mrr, noOfMonths, accounts]);

  useEffect(() => {
    setChartConfigFromChartData(chartData, accounts, setChartConfig);
  }, [chartData, accounts]);

  return (
    <div>
      {chartData && chartConfig && (
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatMonth}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={formatDate("MMM yyyy")}
                  formatter={mrrChartTooltip(chartConfig)}
                />
              }
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  highlightLabel={selectedCompany}
                  setHighlightLabel={setSelectedCompany}
                />
              }
            />
            {getSortedChartConfig(selectedCompany, chartConfig, chartData).map(
              ({ label, color }, idx) => (
                <Bar
                  key={label}
                  stackId="a"
                  dataKey={label}
                  fill={color}
                  radius={
                    selectedCompany
                      ? 6
                      : idx === 0
                        ? [0, 0, 6, 6]
                        : idx === flow(keys, size)(chartConfig) - 1
                          ? [6, 6, 0, 0]
                          : undefined
                  }
                >
                  {(selectedCompany ||
                    idx === flow(keys, size)(chartConfig) - 1) && (
                    <LabelList
                      position="top"
                      offset={8}
                      formatter={formatRevenue}
                    />
                  )}
                </Bar>
              )
            )}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AnalyticsMrrChart;
