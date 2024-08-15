import { NoteBlockData } from "@/api/useActivity";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { transformNotesVersion1 } from "./transform-v1";
import { transformNotesVersion2 } from "./transform-v2";
import { transformNotesVersion3 } from "./transform-v3";

interface TransformNotesVersionType {
  formatVersion?: number | null;
  notes?: string | null;
  notesJson?: any;
  noteBlockIds?: string[] | null;
  noteBlocks: NoteBlockData[];
}

export const transformNotesVersion = ({
  formatVersion,
  notes,
  notesJson,
  noteBlockIds,
  noteBlocks,
}: TransformNotesVersionType): EditorJsonContent =>
  formatVersion === 3
    ? transformNotesVersion3(noteBlocks, noteBlockIds)
    : formatVersion === 2
    ? transformNotesVersion2(notesJson)
    : transformNotesVersion1(notes);
