import { transformNotesVersion1 } from "./transform-v1";

export const transformNotesVersion2 = (notesJson: any) =>
  notesJson ? JSON.parse(notesJson) : transformNotesVersion1("");
