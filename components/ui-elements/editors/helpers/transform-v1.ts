import { ActivityData } from "@/api/useActivity";
import { JSONContent } from "@tiptap/core";

export const transformNotesVersion1 = (
  notes: ActivityData["notes"]
): JSONContent => ({
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
