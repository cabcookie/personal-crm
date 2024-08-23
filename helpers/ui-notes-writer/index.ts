import { transformNotesVersion1 } from "@/components/ui-elements/editors/helpers/transform-v1";
import { transformNotesVersion2 } from "@/components/ui-elements/editors/helpers/transform-v2";
import { JSONContent } from "@tiptap/core";

interface TransformNotesVersionType {
  formatVersion?: number | null;
  notes?: string | null;
  notesJson?: any;
}

export const transformNotesVersion = ({
  formatVersion,
  notes,
  notesJson,
}: TransformNotesVersionType): JSONContent =>
  formatVersion === 2
    ? transformNotesVersion2(notesJson)
    : transformNotesVersion1(notes ?? null);

export type TWithGetJsonFn = { getJSON: () => JSONContent };
