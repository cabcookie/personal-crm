import { type Schema } from "@/amplify/data/resource";
import { createUploadRecord } from "@/helpers/analytics/api-actions";
import {
  downloadAndProcessMrrImportData,
  UpdateProgressBarFn,
  uploadFile,
} from "@/helpers/analytics/process-upload";
import { flow, get, map } from "lodash/fp";
import { ChangeEvent } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Mrr, MrrMutator } from "./useMrr";
import { client } from "@/lib/amplify";

export type MrrImportData = Schema["MrrDataUpload"]["type"];

type MrrImport = {
  id: string;
  s3Key: string;
  status: MrrImportData["status"];
  createdAt: Date;
};

const mapMrrImport = ({
  id,
  s3Key,
  status,
  createdAt,
}: MrrImportData): MrrImport => ({
  id: id,
  s3Key: s3Key,
  status: status,
  createdAt: new Date(createdAt),
});

const fetchMrrImport = async () => {
  const { data, errors } =
    await client.models.MrrDataUpload.listMrrDataUploadByStatusAndCreatedAt(
      { status: "WIP" },
      { sortDirection: "DESC", limit: 1 }
    );
  if (errors) {
    handleApiErrors(errors, "Loading MRR import failed");
    throw errors;
  }
  try {
    return flow(map(mapMrrImport), get(0))(data);
  } catch (error) {
    console.error("fetchMrrImport", error);
    throw error;
  }
};

const useMrrImport = (mrr: Mrr[] | undefined, mutateMrr: MrrMutator) => {
  const {
    data: mrrImport,
    isLoading,
    error,
    mutate,
  } = useSWR("/api/mrr-import", fetchMrrImport);

  const uploadAndProcessImportFile =
    (updateProgress: UpdateProgressBarFn) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const upload = await uploadFile(event);
      if (!upload) return;
      const updated: MrrImport = {
        createdAt: new Date(),
        id: crypto.randomUUID(),
        s3Key: upload.s3Path,
        status: "WIP",
      };
      mutate(updated, false);
      const uploadRecord = await createUploadRecord(upload.s3Path);
      if (!uploadRecord) {
        mutate(updated);
        return;
      }
      flow(mapMrrImport, mutate)(uploadRecord);
      await downloadAndProcessMrrImportData(
        uploadRecord.id,
        upload.s3Path,
        updateProgress
      );
      mutateMrr(mrr);
      await closeImportFile(uploadRecord.id);
      return uploadRecord.id;
    };

  const closeImportFile = async (uploadRecordId: string) => {
    const { data, errors } = await client.models.MrrDataUpload.update({
      id: uploadRecordId,
      status: "DONE",
    });
    if (errors) handleApiErrors(errors, "Closing import file failed");
    if (!data) return;
    mutate(undefined);
  };

  return {
    mrrImport,
    isLoading,
    error,
    uploadAndProcessImportFile,
  };
};

export default useMrrImport;
