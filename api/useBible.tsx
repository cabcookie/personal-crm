import { type Schema } from "@/amplify/data/resource";
import {
  checkReadingDue,
  getLastReadChapterNo,
  getSortVal,
} from "@/helpers/bible/bible";
import { transformNotesVersion } from "@/helpers/bible/transformers";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { flow, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type BibleBookChapter = {
  id: string;
  chapter: number;
  notes: JSONContent;
  createdAt: Date;
  updatedAt: Date;
};

export type BibleBook = {
  id: string;
  book: string;
  section: BibleSection;
  alias: string;
  noOfChapters?: number;
  chapters: BibleBookChapter[];
  lastReadChapter?: number;
  readingDue: boolean;
};

export const selectionSet = [
  "id",
  "book",
  "section",
  "alias",
  "noOfChapters",
  "chapters.id",
  "chapters.chapter",
  "chapters.note",
  "chapters.noteJson",
  "chapters.formatVersion",
  "chapters.createdAt",
  "chapters.updatedAt",
] as const;

export type BibleBookData = SelectionSet<
  Schema["BookOfBible"]["type"],
  typeof selectionSet
>;

export type BibleSection = BibleBookData["section"];

export const mapBibleChapter = ({
  id,
  chapter,
  note,
  noteJson,
  formatVersion,
  createdAt,
  updatedAt,
}: BibleBookData["chapters"][number]): BibleBookChapter => ({
  id,
  chapter,
  notes: transformNotesVersion({ note, noteJson, formatVersion }),
  createdAt: new Date(createdAt),
  updatedAt: new Date(updatedAt),
});

export const mapBible = ({
  id,
  book,
  alias,
  noOfChapters,
  chapters,
  section,
}: BibleBookData): BibleBook => {
  const lastReadChapter = getLastReadChapterNo(chapters, section);

  return {
    id,
    book,
    section,
    alias,
    noOfChapters: noOfChapters ?? undefined,
    chapters: flow(
      map(mapBibleChapter),
      sortBy(({ createdAt }) => -createdAt.getTime())
    )(chapters),
    lastReadChapter,
    readingDue: checkReadingDue(chapters, noOfChapters, section),
  };
};

const fetchBible = async (): Promise<BibleBook[] | undefined> => {
  const { data, errors } = await client.models.BookOfBible.list({
    limit: 100,
    selectionSet,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading books of the bible");
    throw errors;
  }
  if (!data) throw new Error("fetchBible didn't return data");
  return flow(map(mapBible), sortBy(getSortVal))(data);
};

const useBible = () => {
  const { data: bible, isLoading, error } = useSWR("/api/bible", fetchBible);

  return { bible, isLoading, error };
};

export default useBible;
