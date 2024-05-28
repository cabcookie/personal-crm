export const getDayOfDate = (date: Date) => date.toISOString().split("T")[0];
export const getCurrentDate = () => new Date();
export const makeDate = (str: string) => new Date(str);
export const addDaysToDate = (days: number) => (date: Date) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
export const toLocaleTimeString = (date?: Date) =>
  !date
    ? ""
    : date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
export const toLocaleDateTimeString = (date?: Date) =>
  !date
    ? ""
    : date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
export const toLocaleDateString = (date?: Date) =>
  !date
    ? ""
    : date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
export const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  // Months are zero-based, so we add 1 to get the correct month
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return year + "-" + month + "-" + day;
};
export const logger =
  (id?: number) =>
  (...args: any[]) => {
    if (id) {
      console.log(new Date().toTimeString(), `[${id}]`, ...args);
      return;
    }
    console.log(new Date().toTimeString(), ...args);
  };
export const makeISOString = (date: string | Date) =>
  typeof date === "string" ? date : date.toISOString();
export const isToday = (date: string | Date): boolean =>
  new Date().toISOString().substring(0, 10) ===
  (typeof date === "string" ? new Date(date) : date)
    .toISOString()
    .substring(0, 10);
export const isTodayOrFuture = (date: string | Date): boolean => {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate.getTime() >= today.getTime();
};
export const isBeforeToday = (date: string | Date): boolean =>
  !isTodayOrFuture(date);
export const sortDates = (desc?: boolean) => (arr: string[]) =>
  arr.sort(
    (a, b) => (new Date(a).getTime() - new Date(b).getTime()) * (!desc ? 1 : -1)
  );
export const makeDateFromStr = (str: string) => new Date(str);
export const sortByDate =
  (desc?: boolean) =>
  (dates: string[]): number => {
    const aDate = new Date(dates[0]).getTime();
    const bDate = new Date(dates[1]).getTime();

    return (aDate - bDate) * (!desc ? 1 : -1);
  };
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const makeRevenueString = (revenue: number) => {
  const inM = revenue > 800000;
  const val = Math.round((revenue / (inM ? 1000000 : 1000)) * 100) / 100;
  const label = inM ? "M" : "k";
  return `$${val}${label}`;
};
