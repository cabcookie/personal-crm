import { BibleBook } from "@/api/useBible";
import useBibleBookChapter from "@/api/useBibleBookChapter";
import ChapterNotes from "@/components/bible/chapter-notes";
import MainLayout from "@/components/layouts/MainLayout";
import { getChapter } from "@/helpers/bible/bible";
import { first, flow, get } from "lodash/fp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getBookChapterTitle = (book: BibleBook | undefined) =>
  !book
    ? "Loading…"
    : `${book.book} ${flow(first, get("chapter"))(book.chapters)}`;

const BibleBookChapterPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const chapterId = Array.isArray(id) ? id[0] : id;
  const { book, updateNotes } = useBibleBookChapter(chapterId);
  const [bookChapterTitle, setBookChapterTitle] = useState("");

  useEffect(() => {
    flow(getBookChapterTitle, setBookChapterTitle)(book);
  }, [book]);

  const handleBackBtnClick = () => {
    if (!book) {
      router.push("/bible/books");
      return;
    }
    router.push(`/bible/books/${book.id}`);
  };

  return (
    <MainLayout
      title={bookChapterTitle}
      recordName={bookChapterTitle}
      sectionName="Bible"
      onBackBtnClick={handleBackBtnClick}
    >
      <ChapterNotes
        chapter={getChapter(book, chapterId)}
        bookAlias={book?.alias}
        updateNotes={updateNotes}
      />
    </MainLayout>
  );
};

export default BibleBookChapterPage;
