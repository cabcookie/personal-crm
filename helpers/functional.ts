import { format } from "date-fns";

export const getDayOfDate = (date: Date) => date.toISOString().split("T")[0];
export const addDaysToDate = (days: number) => (date: Date) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
export const toLocaleTimeString = (date?: Date) =>
  !date
    ? ""
    : date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
export const toLocaleDateString = (date?: Date) =>
  !date ? "" : format(date, "PPP");
export const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  // Months are zero-based, so we add 1 to get the correct month
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return year + "-" + month + "-" + day;
};
export const isTodayOrFuture = (date: string | Date): boolean => {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate.getTime() >= today.getTime();
};
export const usdCurrency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  maximumFractionDigits: 0,
});
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
