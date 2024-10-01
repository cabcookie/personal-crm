import { BibleBook, BibleBookChapter } from "@/api/useBible";
import { getChapter } from "@/helpers/bible/bible";
import { flow } from "lodash/fp";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

type LinkToBibleComProps = {
  book?: BibleBook;
  chapterId?: string;
};

const LinkToBibleCom: FC<LinkToBibleComProps> = ({ book, chapterId }) => {
  const [chapter, setChapter] = useState<BibleBookChapter | undefined>(
    undefined
  );

  useEffect(() => {
    flow(getChapter, setChapter)(book, chapterId);
  }, [book, chapterId]);

  return (
    book &&
    chapter && (
      <Link
        href={`https://www.bible.com/bible/73/${book.alias.toLowerCase()}.${
          chapter.chapter
        }.HFA`}
      >
        <div className="text-sm text-gray-400 hover:text-blue-600 hover:cursor-pointer mx-2">
          Open on bible.com
          <ExternalLink className="w-4 h-4 inline-block ml-1 -mt-0.5" />
        </div>
      </Link>
    )
  );
};

export default LinkToBibleCom;
