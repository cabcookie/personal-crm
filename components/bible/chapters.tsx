import { BibleBook } from "@/api/useBible";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import BibleChapterAccordionItem from "./chapter";

type BibleBookChaptersProps = {
  book: BibleBook;
};

const BibleBookChapters: FC<BibleBookChaptersProps> = ({ book }) =>
  book.chapters.length > 0 && (
    <Accordion type="single" collapsible>
      {book.chapters.map((chapter) => (
        <BibleChapterAccordionItem
          key={chapter.id}
          book={book}
          chapterId={chapter.id}
        />
      ))}
    </Accordion>
  );

export default BibleBookChapters;
