import { BibleBookChapter } from "@/api/useBible";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import BibleChapterAccordionItem from "./chapter";

type BibleBookChaptersProps = {
  chapters: BibleBookChapter[];
  bookAlias?: string;
};

const BibleBookChapters: FC<BibleBookChaptersProps> = ({
  chapters,
  bookAlias,
}) =>
  chapters.length > 0 && (
    <Accordion type="single" collapsible>
      {chapters.map((chapter) => (
        <BibleChapterAccordionItem
          key={chapter.id}
          chapter={chapter}
          bookAlias={bookAlias}
        />
      ))}
    </Accordion>
  );

export default BibleBookChapters;
