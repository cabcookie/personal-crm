import { type Schema } from "@/amplify/data/resource";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { first, flow, get, identity } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { BibleBook, BibleBookData, mapBible } from "./useBible";
const client = generateClient<Schema>();

const selectionSet = [
  "id",
  "chapter",
  "note",
  "noteJson",
  "formatVersion",
  "createdAt",
  "updatedAt",
  "book.id",
  "book.book",
  "book.section",
  "book.alias",
  "book.noOfChapters",
] as const;

export type BibleBookChapterData = SelectionSet<
  Schema["NotesBibleChapter"]["type"],
  typeof selectionSet
>;

const mapRawChapter: (chapter: BibleBookChapterData) => BibleBookData = (
  chapter
) => ({
  ...chapter.book,
  chapters: [chapter],
});

const fetchBibleBookChapter =
  (chapterId: string | undefined) =>
  async (): Promise<BibleBook | undefined> => {
    if (!chapterId) return;
    const { data, errors } = await client.models.NotesBibleChapter.get(
      { id: chapterId },
      { selectionSet }
    );
    if (errors) {
      handleApiErrors(errors, "Error loading chapter of book of the bible");
      throw errors;
    }
    if (!data) throw new Error("fetchBibleBookChapter didn't return data");
    return flow(mapRawChapter, mapBible)(data);
  };

const useBibleBookChapter = (chapterId: string | undefined) => {
  const {
    data: book,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/chapter/${chapterId}`, fetchBibleBookChapter(chapterId));

  const updateNotes = async (notes: JSONContent) => {
    if (!book) return;
    const theChapter = flow(identity<BibleBook>, get("chapters"), first)(book);
    if (!theChapter) return;
    const updated: BibleBook = {
      ...book,
      chapters: [
        {
          ...theChapter,
          notes,
        },
      ],
    };
    mutate(updated, false);
    const { data, errors } = await client.models.NotesBibleChapter.update({
      id: theChapter.id,
      note: null,
      noteJson: JSON.stringify(notes),
      formatVersion: 2,
    });
    if (errors) handleApiErrors(errors, "Updating chapter notes failed");
    mutate(updated);
    return data?.id;
  };

  return {
    book,
    isLoading,
    error,
    updateNotes,
  };
};

export default useBibleBookChapter;
