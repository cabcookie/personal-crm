import { transformNotesVersion1 } from "@/components/ui-elements/editors/helpers/transform-v1";
import { transformNotesVersion2 } from "@/components/ui-elements/editors/helpers/transform-v2";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/useExtensions";
import { Editor } from "@tiptap/core";

export type SerializerOutput = {
  json: EditorJsonContent;
};

interface TransformNotesVersionType {
  formatVersion?: number | null;
  notes?: string | null;
  notesJson?: any;
}

export const transformNotesVersion = ({
  formatVersion,
  notes,
  notesJson,
}: TransformNotesVersionType): EditorJsonContent =>
  formatVersion === 2
    ? transformNotesVersion2(notesJson)
    : transformNotesVersion1(notes ?? null);

export type TWithGetJsonFn = { getJSON: () => EditorJsonContent };

export const getEditorContent = (editor: Editor) => () => ({
  json: editor.getJSON(),
});
