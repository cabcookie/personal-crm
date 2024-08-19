import { ActivityData } from "@/api/useActivity";
import { EditorJsonContent } from "../notes-editor/useExtensions";

export const transformNotesVersion1 = (
  notes: ActivityData["notes"]
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
