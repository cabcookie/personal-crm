import { ExportTask, getAccountMd, getProjectMd } from "../helpers";

export const processExport = async (task: ExportTask): Promise<string> => {
  console.log("Processing export", task);

  // TODO: export of person data

  switch (task.dataSource) {
    case "account":
      return await getAccountMd(task);
    case "project":
      return await getProjectMd(task);
    default:
      throw new Error(`Unknown data source: ${task.dataSource}`);
  }
};
