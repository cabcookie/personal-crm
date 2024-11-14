import { Mrr } from "@/api/useMrr";
import { useMrrFilter } from "@/components/analytics/useMrrFilter";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { byAccount, byMonth } from "@/helpers/analytics/analytics";
import {
  addMonthsFp,
  formatDateYyyyMm,
  invertSign,
  substract,
} from "@/helpers/functional";
import {
  filter,
  flatMap,
  flow,
  identity,
  keys,
  map,
  reduce,
  sum,
  times,
  uniq,
} from "lodash/fp";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type CustomerMrr = {
  [companyName: string]: number;
} & {
  month?: never;
};

type ChartData = {
  month: string;
} & CustomerMrr;

const getMonthName = (mrr: Mrr[], noOfMonths: number) => (id: number) =>
  flow(
    identity<number>,
    substract(id),
    substract(1),
    invertSign,
    addMonthsFp(new Date()),
    formatDateYyyyMm
  )(noOfMonths);

const getMonths = (mrr: Mrr[]) => (noOfMonths: number) =>
  flow(
    identity<number>,
    times(identity),
    map(getMonthName(mrr, noOfMonths))
  )(noOfMonths);

const getMonthCompanyMrr = (mrr: Mrr[], month: string, company: string) =>
  flow(
    identity<Mrr[]>,
    filter(byMonth(month)),
    filter(byAccount(company)),
    map("mrr"),
    sum
  )(mrr);

const mapMonthData = (mrr: Mrr[]) => (month: string) =>
  ({
    month,
    ...flow(
      identity<Mrr[]>,
      filter(byMonth(month)),
      map("companyName"),
      uniq,
      reduce<string, CustomerMrr>(
        (acc, company) =>
          ({
            ...acc,
            [company]: getMonthCompanyMrr(mrr, month, company),
          }) as CustomerMrr,
        {} as CustomerMrr
      )
    )(mrr),
  }) as ChartData;

const AnalyticsMrrChart = () => {
  const { mrrFilter, mrr } = useMrrFilter();
  const [noOfMonths, setNoOfMonths] = useState(0);
  const [chartData, setChartData] = useState<ChartData[] | undefined>();
  const [chartConfig, setChartConfig] = useState<ChartConfig | undefined>();

  useEffect(() => {
    flow(parseInt, setNoOfMonths)(mrrFilter);
  }, [mrrFilter]);

  useEffect(() => {
    if (!mrr) return;
    flow(getMonths(mrr), map(mapMonthData(mrr)), setChartData)(noOfMonths);
  }, [mrr, noOfMonths]);

  useEffect(() => {
    if (!chartData) return;
    flow(
      identity<ChartData[]>,
      flatMap(keys),
      uniq,
      filter((key) => key !== "month"),
      reduce(
        (acc: ChartConfig, key: string) => ({
          ...acc,
          [key]: {
            label: key,
            color: `#2563eb`,
          },
        }),
        {} as ChartConfig
      ),
      setChartConfig
    )(chartData);
  }, [chartData]);

  return (
    <div>
      {chartData && chartConfig && (
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {flow(
              identity<ChartConfig | undefined>,
              keys,
              filter((key) => key !== "month"),
              map((key) => <Bar key={key} dataKey={key} radius={4} />)
            )(chartConfig)}
            {/* <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AnalyticsMrrChart;
