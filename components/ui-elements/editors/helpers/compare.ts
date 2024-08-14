import { logFp } from "@/helpers/functional";
import { flow, isEqual } from "lodash/fp";
import { EditorJsonContent } from "../../notes-writer/useExtensions";
import { getBlockIds } from "./document";

export const isUpToDate = (
  notes: EditorJsonContent,
  editorJson: EditorJsonContent | undefined
) => (!editorJson ? false : isEqual(notes)(editorJson));

export const documentIsUpToDate = (
  notes: EditorJsonContent,
  editorJson: EditorJsonContent | undefined
) =>
  !editorJson
    ? false
    : flow(
        getBlockIds,
        logFp("compare blocks", "editorJson", getBlockIds(editorJson), "notes"),
        isEqual(getBlockIds(editorJson)),
        logFp("compare blocks", "result")
      )(notes);
