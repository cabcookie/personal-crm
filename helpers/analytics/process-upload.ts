import {
  createMonth,
  createMrrRecord,
  fetchMonths,
  updateMonth,
} from "@/helpers/analytics/api-actions";
import { formatDateYyyyMm, parseDate } from "@/helpers/functional";
import {
  downloadDataFromS3,
  percentLoaded,
  uploadFileToS3,
} from "@/helpers/s3/upload-files";
import { de, enUS } from "date-fns/locale";
import {
  drop,
  filter,
  flatMap,
  flow,
  get,
  identity,
  map,
  replace,
  split,
} from "lodash/fp";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export type Month = {
  id: string;
  month: string;
  latestUploadId: string;
};

export type MonthMrr = {
  monthId: string;
  value: number;
  isEstimated: boolean;
  isReseller: boolean;
  account: string;
  payerId: string;
};

export type UpdateProgressBarFn = Dispatch<SetStateAction<number>>;

export const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files) return;
  const file = event.target.files[0];
  if (!file) return;
  const { s3Path } = await uploadFileToS3(
    file,
    "user-files/${identityId}/mrr-imports/${filename}"
  );
  return { s3Path, fileName: file.name };
};

const convertMonth = (date: string) => {
  try {
    return flow(parseDate("MMM yyyy", de), formatDateYyyyMm)(date);
  } catch (error) {
    console.warn("Date not in format 'MMM yyyy' and with 'de' locale", error);
    try {
      return flow(parseDate("MMM yyyy", enUS), formatDateYyyyMm)(date);
    } catch (error) {
      console.warn(
        "Date not in format 'MMM yyyy' and with 'enUS' locale",
        error
      );
      try {
        return flow(parseDate("MMMM yyyy", de), formatDateYyyyMm)(date);
      } catch (error) {
        console.warn(
          "Date not in format 'MMMM yyyy' and with 'de' locale",
          error
        );
        try {
          return flow(parseDate("MMMM yyyy", enUS), formatDateYyyyMm)(date);
        } catch (error) {
          console.warn(
            "Date not in format 'MMMM yyyy' and with 'enUS' locale",
            error
          );
          return null;
        }
      }
    }
  }
};

const getMonthsFromHeader = flow(
  identity<string>,
  split("\r\n"),
  get(0),
  split("\t"),
  drop(6),
  map(replace("Sept.", "Sep")),
  map(convertMonth)
);

const parseNumber = flow(identity<string>, replace(".", ""), (num: string) => {
  const result = parseInt(num);
  if (isNaN(result)) return 0;
  return result;
});

type MapMrrValuesProps = {
  account: string;
  payerId: string;
  isReseller: boolean;
  isEstimated: boolean;
  months: (Month | undefined)[];
};

const mapMrrValues =
  ({ account, payerId, isReseller, isEstimated, months }: MapMrrValuesProps) =>
  (line: string[]) =>
    line.map(
      (val, idx): MonthMrr => ({
        monthId: months[idx]?.id ?? "",
        value: parseNumber(val),
        isReseller,
        isEstimated,
        account,
        payerId,
      })
    );

const nonZeroMrr = (mrr: MonthMrr) => mrr.value !== 0;
const validMonth = (mrrData: MonthMrr) => mrrData.monthId !== "";

const processPayerIdLine =
  (months: (Month | undefined)[]) => (line: string) => {
    const lineArray = line.split("\t");
    return flow(
      identity<string[]>,
      drop(6),
      mapMrrValues({
        months,
        account: lineArray[0],
        payerId: lineArray[1],
        isReseller: lineArray[2] === "Y",
        isEstimated: lineArray[5] === "N",
      }),
      filter(nonZeroMrr),
      filter(validMonth)
    )(lineArray);
  };

const getOrCreateMonths = async (
  uploadId: string,
  dbMonths: Month[],
  data: string
) => {
  const monthsStr = getMonthsFromHeader(data);
  const months: (Month | undefined)[] = await Promise.all(
    monthsStr.map(async (month) => {
      if (!month) throw new Error("getOrCreateMonths: month is null");
      const existing = dbMonths.find((m) => m.month === month);
      if (!existing) return await createMonth(month, uploadId);
      return await updateMonth(existing.id, uploadId);
    })
  );
  return months;
};

const createMrrRecords = (
  updateProgress: UpdateProgressBarFn,
  uploadId: string,
  mrrData: MonthMrr[]
) =>
  Promise.all(
    map(createMrrRecord(updateProgress, mrrData.length, uploadId))(mrrData)
  );

const validPayer = (mrrRecord: MonthMrr) =>
  !!mrrRecord.payerId && mrrRecord.payerId !== "000000000000";

const parseCsvToJson = async (
  updateProgress: UpdateProgressBarFn,
  uploadId: string,
  data: string
) => {
  const dbMonths = await fetchMonths();
  const months = await getOrCreateMonths(uploadId, dbMonths, data);
  const mrrData = flow(
    identity<string>,
    split("\r\n"),
    drop(2),
    flatMap(processPayerIdLine(months)),
    filter(validPayer)
  )(data);
  await createMrrRecords(updateProgress, uploadId, mrrData);
};

export const downloadAndProcessMrrImportData = async (
  uploadId: string,
  s3Key: string,
  updateProgress: UpdateProgressBarFn
) => {
  const path = s3Key;
  const { result } = await downloadDataFromS3(
    path,
    flow(percentLoaded, updateProgress)
  );
  const csvData = await (await result).body.text();
  updateProgress(0);
  await parseCsvToJson(updateProgress, uploadId, csvData);
};
