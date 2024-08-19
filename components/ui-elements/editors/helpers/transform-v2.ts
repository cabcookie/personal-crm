import { ActivityData } from "@/api/useActivity";
import { transformNotesVersion1 } from "./transform-v1";

export const transformNotesVersion2 = (notesJson: ActivityData["notesJson"]) =>
  notesJson ? JSON.parse(notesJson as any) : transformNotesVersion1("");
