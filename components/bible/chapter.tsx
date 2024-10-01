import { BibleBookChapter } from "@/api/useBible";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import ChapterNotes from "./chapter-notes";

type BibleChapterAccordionItemProps = {
  chapter: BibleBookChapter;
  bookAlias?: string;
};

const BibleChapterAccordionItem: FC<BibleChapterAccordionItemProps> = ({
  chapter,
  bookAlias,
}) =>
  chapter && (
    <DefaultAccordionItem
      value={chapter.id}
      triggerTitle={`Chapter ${chapter.chapter}`}
      className="tracking-tight"
      triggerSubTitle={getTextFromJsonContent(chapter.notes)}
      link={`/bible/chapters/${chapter.id}`}
    >
      <ChapterNotes chapter={chapter} bookAlias={bookAlias} />
    </DefaultAccordionItem>
  );

export default BibleChapterAccordionItem;
