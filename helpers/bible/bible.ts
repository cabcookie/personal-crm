import {
  BibleBook,
  BibleBookChapter,
  BibleBookData,
  BibleSection,
  mapBibleChapter,
} from "@/api/useBible";
import { Editor, JSONContent } from "@tiptap/core";
import { differenceInCalendarMonths } from "date-fns";
import { debounce } from "lodash";
import {
  filter,
  find,
  flow,
  get,
  identity,
  last,
  map,
  reverse,
  sortBy,
  sum,
} from "lodash/fp";

const calcVal = (vals: number[]) =>
  vals.map((val, idx) => Math.pow(10, idx) * val);

const isCurrentlyReading = (
  lastReadChapter: number | undefined,
  noOfChapters: number | undefined | null
) => (!noOfChapters || !lastReadChapter ? 0 : lastReadChapter < noOfChapters);

const isNotReadYet = (chapters: BibleBookChapter[]) =>
  !chapters || chapters.length === 0;

const isNt = (section: BibleBookData["section"]) => section === "NEW";

const evaluateLastTimeRead = (
  chapters: BibleBookChapter[],
  section: BibleBookData["section"]
) =>
  differenceInCalendarMonths(
    new Date(),
    flow(
      identity<BibleBookChapter[]>,
      getLastReadChapter(section),
      get("createdAt")
    )(chapters) ?? new Date()
  ) / (isNt(section) ? 2 : 1);

export const getSortVal = ({
  lastReadChapter,
  noOfChapters,
  chapters,
  section,
}: BibleBook) =>
  -flow(
    identity<number[]>,
    reverse,
    calcVal,
    sum
  )([
    isCurrentlyReading(lastReadChapter, noOfChapters) ? 1 : 0,
    isNotReadYet(chapters) ? (isNt(section) ? 2 : 1) : 0,
    0,
    evaluateLastTimeRead(chapters, section),
  ]);

const getLastReadChapter: (
  section: BibleSection
) => (chapters: BibleBookData["chapters"]) => BibleBookChapter | undefined = (
  section
) =>
  flow(
    identity<BibleBookData["chapters"]>,
    map(mapBibleChapter),
    filter(
      ({ createdAt }) =>
        differenceInCalendarMonths(new Date(), createdAt) <
        (isNt(section) ? 12 : 24)
    ),
    sortBy(({ createdAt }) => createdAt.getTime()),
    last
  );

export const getLastReadChapterNo: (
  chapters: BibleBookData["chapters"],
  section: BibleSection
) => number | undefined = (chapters, section) =>
  flow(
    identity<BibleBookData["chapters"]>,
    getLastReadChapter(section),
    get("chapter")
  )(chapters);

export const checkReadingDue = (
  chapters: BibleBookData["chapters"],
  noOfChapters: BibleBookData["noOfChapters"],
  section: BibleSection
): boolean =>
  !noOfChapters ||
  !chapters ||
  chapters.length === 0 ||
  (getLastReadChapterNo(chapters, section) ?? 0) < noOfChapters;

export const getChapter = (
  book: BibleBook | undefined,
  chapterId: string | undefined
) =>
  flow(
    identity<BibleBook | undefined>,
    get("chapters"),
    find((chapter) => chapter.id === chapterId)
  )(book);

type DebouncedUpdateNotesProps = {
  updateNotes: (notes: JSONContent) => Promise<string | undefined>;
  editor: Editor;
};

export const debouncedUpdateNotes = debounce(
  async ({ updateNotes, editor }: DebouncedUpdateNotesProps) => {
    await updateNotes(editor.getJSON());
  },
  1500
);
