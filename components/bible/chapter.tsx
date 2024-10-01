import { BibleBook, BibleBookChapter } from "@/api/useBible";
import { getChapter } from "@/helpers/bible/bible";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import ChapterNotes from "./chapter-notes";

type BibleChapterAccordionItemProps = {
  book?: BibleBook;
  chapterId?: string;
};

const BibleChapterAccordionItem: FC<BibleChapterAccordionItemProps> = ({
  book,
  chapterId,
}) => {
  const [chapter, setChapter] = useState<BibleBookChapter | undefined>(
    undefined
  );

  useEffect(() => {
    flow(getChapter, setChapter)(book, chapterId);
  }, [book, chapterId]);

  return (
    chapter && (
      <DefaultAccordionItem
        value={chapter.id}
        triggerTitle={`Chapter ${chapter.chapter}`}
        className="tracking-tight"
        triggerSubTitle={getTextFromJsonContent(chapter.notes)}
        link={`/bible/chapters/${chapter.id}`}
      >
        <ChapterNotes book={book} chapterId={chapterId} />
      </DefaultAccordionItem>
    )
  );
};

export default BibleChapterAccordionItem;
