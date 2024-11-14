import { Account } from "@/api/ContextAccounts";
import { Mrr } from "@/api/useMrr";
import { ChartConfig } from "@/components/ui/chart";
import { byAccount, byMonth } from "@/helpers/analytics/analytics";
import {
  addMonthsFp,
  formatDate,
  formatDateYyyyMm,
  invertSign,
  substract,
} from "@/helpers/functional";
import {
  compact,
  concat,
  filter,
  find,
  flatMap,
  flow,
  get,
  identity,
  keys,
  last,
  map,
  omit,
  reduce,
  sortBy,
  sum,
  times,
  uniq,
  values,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";

type CustomerMrr = {
  [companyName: string]: number;
} & {
  month?: never;
};

export type ChartData = {
  month: string;
} & CustomerMrr;

type ChartConfigItem = {
  label: string;
  color: string;
};

export const getSortedChartConfig = (
  selectedCompany: string | undefined,
  chartConfig: ChartConfig,
  chartData: ChartData[]
) =>
  selectedCompany
    ? getSelectedLabel(chartConfig, selectedCompany)
    : flow(
        identity<ChartConfig>,
        values,
        sortBy<ChartConfigItem>(customerMrr(chartData))
      )(chartConfig);

export const formatMonth = (month: string) =>
  flow(
    identity<string>,
    (val) => new Date(`${val}-01`),
    formatDate("MMM yyyy")
  )(month);

export const setChartDataFromNoOfMonths = (
  noOfMonths: number,
  mrr: Mrr[] | undefined,
  accounts: Account[] | undefined,
  setChartData: Dispatch<SetStateAction<ChartData[] | undefined>>
) =>
  mrr &&
  accounts &&
  flow(
    identity<number>,
    getMonths(mrr),
    map(mapMonthData(mrr, accounts)),
    setChartData
  )(noOfMonths);

export const getTotal = flow(identity<ChartData>, omit("month"), values, sum);

export const formatRevenue = (value: number, chartData?: ChartData) =>
  (!chartData ? value : getTotal(chartData)) < 5000
    ? Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    : `${Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value / 1000)}k`;

export const setChartConfigFromChartData = (
  chartData: ChartData[] | undefined,
  accounts: Account[] | undefined,
  setChartConfig: Dispatch<SetStateAction<ChartConfig | undefined>>
) =>
  chartData &&
  accounts &&
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
          color:
            flow(
              identity<Account[]>,
              find(["shortName", key]),
              get("mainColor")
            )(accounts) ?? "#2563eb",
        },
      }),
      {} as ChartConfig
    ),
    setChartConfig
  )(chartData);

export const getSelectedLabel = (chartConfig: ChartConfig, label: string) =>
  flow(
    identity<ChartConfig>,
    get(label),
    concat([]),
    compact
  )(chartConfig) as ChartConfigItem[];

const customerMrr =
  (chartData: ChartData[]) =>
  ({ label }: ChartConfigItem) =>
    flow(identity<ChartData[]>, last, get(label), invertSign)(chartData) ?? 0;

const getMonths = (mrr: Mrr[]) => (noOfMonths: number) =>
  flow(
    identity<number>,
    times(identity),
    map(getMonthName(mrr, noOfMonths))
  )(noOfMonths);

const getMonthName = (mrr: Mrr[], noOfMonths: number) => (id: number) =>
  flow(
    identity<number>,
    substract(id),
    substract(1),
    invertSign,
    addMonthsFp(new Date()),
    formatDateYyyyMm
  )(noOfMonths);

const mapMonthData = (mrr: Mrr[], accounts: Account[]) => (month: string) =>
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
            [getAccountName(accounts, company)]: getMonthCompanyMrr(
              mrr,
              month,
              company
            ),
          }) as CustomerMrr,
        {} as CustomerMrr
      )
    )(mrr),
  }) as ChartData;

const getAccountName = (accounts: Account[], companyName: string): string =>
  flow(
    identity<Account[]>,
    find(["name", companyName]),
    get("shortName")
  )(accounts) ?? companyName;

const getMonthCompanyMrr = (mrr: Mrr[], month: string, company: string) =>
  flow(
    identity<Mrr[]>,
    filter(byMonth(month)),
    filter(byAccount(company)),
    map("mrr"),
    sum
  )(mrr);
