import { BibleBook, BibleBookChapter } from "@/api/useBible";
import { debouncedUpdateNotes, getChapter } from "@/helpers/bible/bible";
import { Editor, JSONContent } from "@tiptap/core";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import ChapterNotesEditor from "../ui-elements/editors/chapter-notes-editor/ChapterNotesEditor";
import { emptyDocument } from "../ui-elements/editors/helpers/document";
import MetaData from "../ui-elements/editors/meta-data";
import LinkToBibleCom from "./link-to-bible";

type ChapterNotesProps = {
  book?: BibleBook;
  chapterId?: string;
  updateNotes?: (notes: JSONContent) => Promise<string | undefined>;
};

const ChapterNotes: FC<ChapterNotesProps> = ({
  book,
  chapterId,
  updateNotes,
}) => {
  const [chapter, setChapter] = useState<BibleBookChapter | undefined>(
    undefined
  );

  useEffect(() => {
    flow(getChapter, setChapter)(book, chapterId);
  }, [book, chapterId]);

  const handleNotesUpdate = (editor: Editor) => {
    if (!updateNotes) return;
    debouncedUpdateNotes({ editor, updateNotes });
  };

  return !chapter ? (
    "Loading…"
  ) : (
    <>
      <div className="mb-2 flex">
        <LinkToBibleCom book={book} chapterId={chapterId} />
      </div>

      <ChapterNotesEditor
        notes={chapter.notes ?? emptyDocument}
        saveNotes={handleNotesUpdate}
        readonly={!updateNotes}
      />
      <MetaData created={chapter.createdAt} updated={chapter.updatedAt} />
    </>
  );
};
export default ChapterNotes;
