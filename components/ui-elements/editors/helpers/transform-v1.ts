import { EditorJsonContent } from "../../notes-writer/useExtensions";

const stringToEditorJsonContent = (
  notes?: string | null
): EditorJsonContent => ({
  type: "doc",
  content:
    notes?.split("\n").map((text) => ({
      type: "paragraph",
      content: !text
        ? []
        : [
            {
              type: "text",
              text,
            },
          ],
    })) ?? [],
});

export const transformNotesVersion1 = (notes?: string | null) =>
  stringToEditorJsonContent(notes);
