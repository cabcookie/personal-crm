import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { flow } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { BibleBook, mapBible, selectionSet } from "./useBible";
import { client } from "@/lib/amplify";

const fetchBibleBook =
  (bookId: string | undefined) => async (): Promise<BibleBook | undefined> => {
    if (!bookId) return;
    const { data, errors } = await client.models.BookOfBible.get(
      { id: bookId },
      { selectionSet }
    );
    if (errors) {
      handleApiErrors(errors, "Error loading book of the bible");
      throw errors;
    }
    if (!data) throw new Error("fetchBibleBook didn't return data");
    return flow(mapBible)(data);
  };

const useBibleBook = (bookId: string | undefined) => {
  const {
    data: book,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/bible/${bookId}`, fetchBibleBook(bookId));

  const addChapter = async (bookId: string | undefined, chapterNo: number) => {
    if (!bookId) return;
    if (!book) return;
    if (book.noOfChapters && chapterNo > book.noOfChapters) return;

    const updated: BibleBook | undefined = !book
      ? undefined
      : {
          ...book,
          chapters: [
            ...book.chapters,
            {
              id: crypto.randomUUID(),
              chapter: chapterNo,
              notes: emptyDocument,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.NotesBibleChapter.create({
      bookId,
      chapter: chapterNo,
    });
    if (errors) handleApiErrors(errors, "Creating chapter failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  return {
    book,
    isLoading,
    error,
    addChapter,
  };
};

export default useBibleBook;
