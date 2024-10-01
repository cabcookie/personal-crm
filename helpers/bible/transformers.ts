import { BibleBookChapterData } from "@/api/useBibleBookChapter";
import { JSONContent } from "@tiptap/core";
import { flow, identity, map, split } from "lodash/fp";

interface TransformNotesVersionType {
  formatVersion: BibleBookChapterData["formatVersion"];
  note: BibleBookChapterData["note"];
  noteJson: BibleBookChapterData["noteJson"];
}

const transformNotesVersion2 = (
  noteJson: BibleBookChapterData["noteJson"]
): JSONContent =>
  noteJson ? JSON.parse(noteJson as any) : transformNotesVersion1("");

const transformNotesVersion1 = (
  note: BibleBookChapterData["note"]
): JSONContent => ({
  type: "doc",
  content: flow(
    split("\n"),
    map((text) => ({
      type: "paragraph",
      content: !text ? [] : [{ type: "text", text }],
    })) ?? []
  )(note),
});

const createDocument = ({
  formatVersion,
  note,
  noteJson,
}: TransformNotesVersionType): JSONContent =>
  formatVersion === 2
    ? transformNotesVersion2(noteJson)
    : transformNotesVersion1(note);

export const transformNotesVersion = flow(
  identity<TransformNotesVersionType>,
  createDocument
);
