import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import {
  Month,
  MonthMrr,
  UpdateProgressBarFn,
} from "@/helpers/analytics/process-upload";
import { newDateTimeString } from "@/helpers/functional";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { map } from "lodash/fp";
const client = generateClient<Schema>();

type MonthData = Schema["Month"]["type"];

export const createUploadRecord = async (s3Path: string) => {
  const { data, errors } = await client.models.MrrDataUpload.create({
    s3Key: s3Path,
    status: "WIP",
    createdAt: newDateTimeString(),
  });
  if (errors) handleApiErrors(errors, "Updating data record failed");
  return data;
};

export const createMonth = async (month: string, uploadId: string) => {
  const { data, errors } = await client.models.Month.create({
    month,
    latestUploadId: uploadId,
  });
  if (errors) {
    handleApiErrors(errors, "Creating month failed");
    throw errors;
  }
  if (!data) return;
  return mapMonth(data);
};

export const updateMonth = async (monthId: string, uploadId: string) => {
  const { data, errors } = await client.models.Month.update({
    id: monthId,
    latestUploadId: uploadId,
  });
  if (errors) {
    handleApiErrors(errors, "Updating month failed");
    throw errors;
  }
  if (!data) return;
  return mapMonth(data);
};

const mapMonth = ({ id, month, latestUploadId }: MonthData): Month => ({
  id,
  month,
  latestUploadId,
});

export const fetchMonths = async () => {
  const { data, errors } = await client.models.Month.list({ limit: 200 });
  if (errors) {
    handleApiErrors(errors, "Fetching months failed");
    throw errors;
  }
  return map(mapMonth)(data);
};

export const createMrrRecord =
  (
    updateProgress: UpdateProgressBarFn,
    totalRecords: number,
    uploadId: string
  ) =>
  async ({
    account,
    payerId,
    monthId,
    isEstimated,
    isReseller,
    value,
  }: MonthMrr) => {
    const { data, errors } = await client.models.PayerAccountMrr.create({
      uploadId,
      monthId,
      companyName: account,
      awsAccountNumber: payerId,
      isEstimated,
      isReseller,
      mrr: value,
    });
    if (errors) {
      handleApiErrors(
        errors,
        `Creating MRR record failed (PayerId: ${payerId}, MonthId: ${monthId})`
      );
      throw errors;
    }
    updateProgress((current) => current + (1 / totalRecords) * 100);
    return data;
  };

const monthSelectionSet = ["id", "month", "latestUploadId"] as const;

type LeanMonth = SelectionSet<
  Schema["Month"]["type"],
  typeof monthSelectionSet
>;

export const getMonths = async (
  startMonth: string
): Promise<LeanMonth[] | undefined> => {
  const { data, errors } = await client.models.Month.list({
    filter: { month: { gt: startMonth } },
    limit: 100,
    selectionSet: monthSelectionSet,
  });
  if (errors) {
    handleApiErrors(errors, "Loading months failed");
    throw errors;
  }
  return data;
};

export type DoneMonthMrrData = SelectionSet<
  Schema["PayerAccountMrr"]["type"],
  typeof monthMrrSelectionSet
>;

const monthMrrSelectionSet = [
  "id",
  "companyName",
  "awsAccountNumber",
  "payerAccount.accountId",
  "isEstimated",
  "isReseller",
  "mrr",
] as const;

export const getMonthMrr = async ({ id, month, latestUploadId }: LeanMonth) => {
  const { data, errors } =
    await client.models.PayerAccountMrr.listPayerAccountMrrByUploadId(
      { uploadId: latestUploadId },
      {
        filter: { monthId: { eq: id } },
        limit: 500,
        selectionSet: monthMrrSelectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Loading month's MRR failed");
    throw errors;
  }
  return { month, payerMrrs: data };
};
