import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { uploadFileToS3 } from "@/helpers/s3/upload-filtes";
import { generateClient } from "aws-amplify/data";
import { ChangeEvent } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export const IMPORT_STATUS = ["WIP", "DONE"] as const;

export type TImportStatus = (typeof IMPORT_STATUS)[number];

type CrmProjectsImportData = Schema["CrmProjectImport"]["type"];

type CrmProjectsImport = {
  id: string;
  s3Key: string;
  status: TImportStatus;
  createdAt: Date;
};

const mapCrmProjectImport = ({
  id,
  s3Key,
  status,
  createdAt,
}: CrmProjectsImportData): CrmProjectsImport => ({
  id,
  s3Key,
  status,
  createdAt: new Date(createdAt),
});

const fetchCrmProjectsImport = (status: TImportStatus) => async () => {
  const { data, errors } =
    await client.models.CrmProjectImport.listByImportStatus(
      { status },
      { sortDirection: "DESC", limit: 1 }
    );
  if (errors) {
    handleApiErrors(errors, "Loading CRM Project's imports failed");
    throw errors;
  }
  return data.map(mapCrmProjectImport)[0];
};

const useCrmProjectsImport = (status: TImportStatus) => {
  const {
    data: crmProjectsImport,
    isLoading,
    error,
    mutate,
  } = useSWR(
    `/api/crm-projects-import/${status}`,
    fetchCrmProjectsImport(status)
  );

  const uploadImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;
    const { s3Path } = await uploadFileToS3(
      file,
      "user-files/${identityId}/crm-imports/${filename}"
    );
    const updated: CrmProjectsImport = {
      createdAt: new Date(),
      id: crypto.randomUUID(),
      s3Key: s3Path,
      status: "WIP",
    };
    mutate(updated, false);
    const { data, errors } = await client.models.CrmProjectImport.create({
      s3Key: s3Path,
      status: "WIP",
      createdAt: new Date().toISOString(),
    });
    if (errors) handleApiErrors(errors, "Updating data record failed");
    if (!data) {
      mutate(updated);
      return;
    }
    mutate(mapCrmProjectImport(data), false);
    toast({
      title: "Imports successfully uploaded",
      description: `File “${file.name}” successfully uploaded.`,
    });
    return data.id;
  };

  return { crmProjectsImport, isLoading, error, uploadImportFile };
};

export default useCrmProjectsImport;
