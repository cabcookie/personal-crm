import useBibleBook from "@/api/useBibleBook";
import AddChapterForm from "@/components/bible/add-chapter-form";
import BibleBookChapters from "@/components/bible/chapters";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";
import { useState } from "react";

const BibleBookPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const bookId = Array.isArray(id) ? id[0] : id;
  const { book, error, addChapter } = useBibleBook(bookId);
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);

  const handleBackBtnClick = () => {
    router.push("/bible/books");
  };

  const handleAddChapterClick = async (chapter: number) => {
    if (!bookId) return;
    const chapterId = await addChapter(bookId, chapter);
    if (!chapterId) return;
    router.push(`/bible/chapters/${chapterId}`);
  };

  return (
    <MainLayout
      title={book?.book}
      recordName={book?.book}
      sectionName="Bible"
      onBackBtnClick={handleBackBtnClick}
      addButton={
        showAddChapterForm
          ? undefined
          : {
              label: "Add chapter",
              onClick: () => setShowAddChapterForm(true),
            }
      }
    >
      <ApiLoadingError error={error} title="Error loading book of bible" />

      {!book ? (
        "Loading book…"
      ) : (
        <div className="space-y-6">
          {showAddChapterForm && (
            <AddChapterForm book={book} addChapter={handleAddChapterClick} />
          )}

          <BibleBookChapters chapters={book.chapters} bookAlias={book.alias} />
        </div>
      )}
    </MainLayout>
  );
};

export default BibleBookPage;
