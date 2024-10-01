import { BibleBookChapter } from "@/api/useBible";
import { debouncedUpdateNotes } from "@/helpers/bible/bible";
import { Editor, JSONContent } from "@tiptap/core";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ChapterNotesEditor from "../ui-elements/editors/chapter-notes-editor/ChapterNotesEditor";
import { emptyDocument } from "../ui-elements/editors/helpers/document";
import MetaData from "../ui-elements/editors/meta-data";

type ChapterNotesProps = {
  chapter?: BibleBookChapter;
  bookAlias?: string;
  updateNotes?: (notes: JSONContent) => Promise<string | undefined>;
};

const ChapterNotes: FC<ChapterNotesProps> = ({
  chapter,
  updateNotes,
  bookAlias,
}) => {
  const handleNotesUpdate = (editor: Editor) => {
    if (!updateNotes) return;
    debouncedUpdateNotes({ editor, updateNotes });
  };

  return !chapter ? (
    "Loading…"
  ) : (
    <>
      {bookAlias && (
        <div className="mb-2 flex">
          <Link
            href={`https://www.bible.com/bible/73/${bookAlias.toLowerCase()}.${
              chapter.chapter
            }.HFA`}
          >
            <div className="text-sm text-gray-400 hover:text-blue-600 hover:cursor-pointer mx-2">
              Open on bible.com
              <ExternalLink className="w-4 h-4 inline-block ml-1 -mt-0.5" />
            </div>
          </Link>
        </div>
      )}

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
