import { type Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/data";
import { differenceInCalendarDays } from "date-fns";
import { first, flow, get, identity } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { client } from "@/lib/amplify";

const selectionSet = ["createdAt"] as const;

type MrrLatestUploadData = SelectionSet<
  Schema["MrrDataUpload"]["type"],
  typeof selectionSet
>;

type SfdcLatestUploadData = SelectionSet<
  Schema["CrmProjectImport"]["type"],
  typeof selectionSet
>;

const isTooOld = (dateStr: string | undefined) =>
  !dateStr || differenceInCalendarDays(new Date(), dateStr) >= 7;

const fetchSfdcLatestUpload = async () => {
  const { data, errors } =
    await client.models.CrmProjectImport.listByImportStatus(
      {
        status: "DONE",
      },
      {
        sortDirection: "DESC",
        limit: 1,
        selectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Loading SfdcLatestUpload failed");
    throw errors;
  }
  try {
    return flow(
      identity<SfdcLatestUploadData[] | undefined>,
      first,
      get("createdAt"),
      isTooOld
    )(data);
  } catch (error) {
    console.error("fetchSfdcLatestUpload", error);
    throw error;
  }
};

const fetchMrrLatestUpload = async () => {
  const { data, errors } =
    await client.models.MrrDataUpload.listMrrDataUploadByStatusAndCreatedAt(
      { status: "DONE" },
      { sortDirection: "DESC", limit: 1, selectionSet }
    );
  if (errors) {
    handleApiErrors(errors, "Loading MrrLatestUpload failed");
    throw errors;
  }
  try {
    return flow(
      identity<MrrLatestUploadData[] | undefined>,
      first,
      get("createdAt"),
      isTooOld
    )(data);
  } catch (error) {
    console.error("fetchMrrLatestUpload", error);
    throw error;
  }
};

const useLatestUploadsWork = () => {
  const { data: mrrUploadTooOld, mutate: mutateMrr } = useSWR(
    "/api/mrr-latest",
    fetchMrrLatestUpload
  );

  const { data: sfdcUploadTooOld, mutate: mutateSfdc } = useSWR(
    "/api/sfdc-latest",
    fetchSfdcLatestUpload
  );

  return { mrrUploadTooOld, mutateMrr, sfdcUploadTooOld, mutateSfdc };
};

export default useLatestUploadsWork;
