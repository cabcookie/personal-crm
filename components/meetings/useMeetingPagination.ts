import { defaultStartDate } from "@/api/useMeetings";
import { addDaysToDate, toISODateString } from "@/helpers/functional";
import { parseISO } from "date-fns";
import { flow } from "lodash/fp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getFirstItemIfArray = <T>(item: T[] | T | undefined) =>
  Array.isArray(item) ? item[0] : item;

const ifUndefined =
  <T>(trueVal: T) =>
  (item: T | undefined) =>
    item ?? trueVal;

const getCleanStartDate = (startDate: string[] | string | undefined) =>
  flow(getFirstItemIfArray<string>, ifUndefined(defaultStartDate))(startDate);

const useMeetingPagination = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState(() =>
    getCleanStartDate(router.query.startDate)
  );

  useEffect(() => {
    if (startDate === router.query.startDate) return;
    router.replace({ query: { startDate } });
  }, [router, startDate]);

  const handlePaginationClick = (direction: "BACKW" | "FORW") => () => {
    const newDate = flow(
      parseISO,
      addDaysToDate((4 * 7 + 1) * (direction === "BACKW" ? -1 : 1)),
      toISODateString
    )(startDate);
    setStartDate(newDate);
    router.push({ query: { startDate: newDate } });
  };

  return {
    fromDate: startDate,
    toDate: flow(parseISO, addDaysToDate(4 * 7), toISODateString)(startDate),
    handlePrevClick: handlePaginationClick("BACKW"),
    handleNextClick: handlePaginationClick("FORW"),
  };
};

export default useMeetingPagination;
