import { BibleBook, BibleBookChapter } from "@/api/useBible";
import { toLocaleDateString } from "@/helpers/functional";
import { flow, get, identity, last, sortBy } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import BibleBookChapters from "./chapters";

type BibleBookAccordionItemProps = {
  book: BibleBook;
};

const BibleBookAccordionItem: FC<BibleBookAccordionItemProps> = ({ book }) =>
  book && (
    <DefaultAccordionItem
      className="tracking-tight"
      value={book.id}
      link={`/bible/books/${book.id}`}
      triggerTitle={book.book}
      triggerSubTitle={[
        book.section === "NEW" ? "New Testament" : "Old Testament",
        book.lastReadChapter &&
        book.lastReadChapter < (book.noOfChapters ?? 200)
          ? `Last read chapter: ${book.lastReadChapter} (${flow(
              identity<BibleBookChapter[]>,
              sortBy("createdAt"),
              last,
              get("createdAt"),
              toLocaleDateString
            )(book.chapters)})`
          : undefined,
      ]}
    >
      <BibleBookChapters book={book} />
    </DefaultAccordionItem>
  );

export default BibleBookAccordionItem;
