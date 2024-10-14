import {
  addDays,
  addMinutes,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { flow, isNil } from "lodash/fp";

export const addMinutesToDate = (mins: number) => (date: Date) =>
  addMinutes(date, mins);
export const addDaysToDate = (days: number) => (date: Date) =>
  addDays(date, days);
export const toLocaleTimeString = (date?: Date) =>
  !date
    ? ""
    : date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
export const toLocaleDateString = (date?: Date) =>
  !date ? "" : format(date, "PPP");
export const makeDate = (str: string) => new Date(str);
export const toISODateTimeString = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
export const toISODateString = (date: Date) => format(date, "yyyy-MM-dd");
export const not = (val: boolean) => !val;
export const isNotNil = flow(isNil, not);
export const usdCurrency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  maximumFractionDigits: 0,
});
export const uniqArraySorted = (ids: string[]): string[] => {
  const idMap: Record<string, number> = ids.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedIds = Object.keys(idMap).sort((a, b) => idMap[b] - idMap[a]);
  return sortedIds;
};
export const formatUsdCurrency = (val: number) => usdCurrency.format(val);
export const formatRevenue = (revenue: number) =>
  revenue < 5000
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(revenue)
    : revenue < 500000
    ? `$${(revenue / 1000).toFixed(0)}k`
    : `$${(revenue / 1000000).toFixed(1)}M`;
export const logFp =
  <T>(...msg: any[]) =>
  (data: T) => {
    console.log(`[${newDateTimeString()}]`, ...msg, data);
    return data;
  };
export const newDateTimeString = (): string => toISODateTimeString(new Date());
export const newDateString = (): string => toISODateString(new Date());
export const getDateOrUndefined = (date?: string | null) =>
  !date ? undefined : new Date(date);
export const getDateOrNull = (date?: string | null) =>
  !date ? null : new Date(date);
export const truncateMiddle = (text: string, length = 20): string => {
  if (text.length <= length) return text;
  const half = Math.floor(length / 2);
  return `${text.slice(0, half).trim()}…${text.slice(-half).trim()}`;
};
export const diffCalDays = (date1: Date) => (date2: Date) =>
  differenceInCalendarDays(date2, date1);
export const invertSign = (value: number) => -value;
