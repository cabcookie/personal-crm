import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { toISODateTimeString } from "@/helpers/functional";
import {
  downloadDataFromS3,
  percentLoaded,
  uploadFileToS3,
} from "@/helpers/s3/upload-filtes";
import { generateClient } from "aws-amplify/data";
import { addDays, min } from "date-fns";
import { floor, flow } from "lodash/fp";
import { ChangeEvent } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { CrmProject } from "./useCrmProjects";
const client = generateClient<Schema>();

export type DataChanged = {
  new: Omit<CrmProject, "id">[];
  missing: CrmProject[] | undefined;
  changed: Omit<CrmProject, "id">[];
};

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
  try {
    return data.map(mapCrmProjectImport)[0];
  } catch (error) {
    console.error("fetchCrmProjectsImport", { error });
    throw error;
  }
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
      createdAt: toISODateTimeString(new Date()),
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

  const parseHTMLTableToJSON = (
    html: string,
    callback: (result: Omit<CrmProject, "id">[]) => void,
    showProgress?: (progress: number) => void
  ) => {
    // Create a new DOM parser
    const parser = new DOMParser();
    // Parse the HTML string into a Document object
    const doc = parser.parseFromString(html, "text/html");

    // Extract the table rows
    const rows = doc.querySelectorAll("table tr");

    // Extract the headers
    const headers = Array.from(rows[0].querySelectorAll("th")).map((header) =>
      header.textContent?.trim()
    );

    // Define the mapping of header names to JSON keys
    const headerMapping: { [key: string]: string } = {
      "Opportunity Name": "name",
      "18 Character Oppty ID": "crmId",
      "Total Opportunity Amount": "arr",
      "Close Date": "closeDate",
      Stage: "stage",
      "Opportunity Owner": "opportunityOwner",
      "Next Step": "nextStep",
      "Primary Partner Name": "partnerName",
      "Opportunity Record Type": "type",
      "Stage Duration": "stageChangedDate",
      "Account Name": "accountName",
      Territory: "territoryName",
      "Created Date": "createdDate",
      "System Close Date": "systemCloseDate",
    };

    // Iterate through the rows and build the JSON objects
    const jsonResult = Array.from(rows)
      .slice(1)
      .map((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        const rowObject: { [key: string]: any } = {};

        cells.forEach((cell, index) => {
          const header = headers[index];
          if (header && headerMapping[header]) {
            const key = headerMapping[header];
            let value: any = cell.textContent?.trim();

            // Convert 'arr' to a number
            if (key === "arr") {
              value = parseInt(value.replace(/,/g, "")) * 12;
            }
            // make 'closeDate' a date
            if (key === "closeDate") {
              const [month, day, year] = value.split("/");
              value = new Date(year, month - 1, day);
            }
            // make 'systemCloseDate' a date
            if (key === "systemCloseDate") {
              if (value) {
                const [month, day, year] = value.split("/");
                value = new Date(year, month - 1, day);
              }
            }
            // make 'createdDate' a date
            if (key === "createdDate") {
              const [month, day, year] = value.split("/");
              value = new Date(year, month - 1, day);
            }
            // make "Stage Duration" a date
            if (key === "stageChangedDate") {
              const intVal = parseInt(value.replace(/,/g, ""));
              value = addDays(new Date(), -intVal);
            }
            rowObject[key] = value;
          }
          if (showProgress) {
            flow(
              (len: number) => ((index + 1) / len) * 100,
              floor,
              showProgress
            )(cells.length);
          }
        });

        return rowObject;
      });

    const result: Omit<CrmProject, "id">[] = jsonResult
      .map(
        (obj): Omit<CrmProject, "id"> => ({
          name: obj.name,
          crmId: obj.crmId,
          arr: obj.arr,
          tcv: 0,
          isMarketplace: false,
          closeDate: !obj.systemCloseDate
            ? obj.closeDate
            : min([obj.systemCloseDate, obj.closeDate]),
          createdDate: obj.createdDate,
          projectIds: [],
          stage: obj.stage,
          opportunityOwner: obj.opportunityOwner,
          nextStep: obj.nextStep,
          partnerName: obj.partnerName ?? undefined,
          type: obj.type,
          stageChangedDate: obj.stageChangedDate,
          accountName: obj.accountName,
          territoryName: obj.territoryName,
        })
      )
      .sort((a, b) => b.arr - a.arr);

    callback(result);
  };

  const downloadAndProcessImportData = async (
    path: string,
    storeData: (result: Omit<CrmProject, "id">[]) => void,
    showProgress?: (progress: number) => void
  ) => {
    const { result } = await downloadDataFromS3(
      path,
      !showProgress ? undefined : flow(percentLoaded, showProgress)
    );
    const body = await (await (await result).body.blob()).arrayBuffer();
    const decoded = new TextDecoder("iso-8859-1").decode(body);
    parseHTMLTableToJSON(decoded, storeData, showProgress);
  };

  const closeImportFile = async () => {
    if (!crmProjectsImport) return;
    const { data, errors } = await client.models.CrmProjectImport.update({
      id: crmProjectsImport.id,
      status: "DONE",
    });
    if (errors) handleApiErrors(errors, "Closing import file failed");
    if (!data) return;
    mutate();
  };

  return {
    crmProjectsImport,
    isLoading,
    error,
    uploadImportFile,
    downloadAndProcessImportData,
    closeImportFile,
  };
};

export default useCrmProjectsImport;
