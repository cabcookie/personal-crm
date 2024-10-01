import { BibleBook } from "@/api/useBible";
import { not } from "@/helpers/functional";
import { flow, isNaN } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type AddChapterFormProps = {
  book: BibleBook;
  addChapter: (chapter: number) => void;
};

const AddChapterForm: FC<AddChapterFormProps> = ({ book, addChapter }) => {
  const [chapter, setChapter] = useState("");
  const [validValue, setValidValue] = useState(false);

  useEffect(() => {
    flow(parseInt, isNaN, not, setValidValue)(chapter);
  }, [chapter]);

  const handleBtnClick = () => {
    flow(parseInt, addChapter)(chapter);
  };

  return (
    <div className="space-y-2">
      <div>
        What chapter are you reading in <strong>{book.book}</strong>?
      </div>
      <div>
        <Input value={chapter} onChange={(e) => setChapter(e.target.value)} />
      </div>
      <div className="h-6 text-sm text-red-500 font-semibold">
        {!validValue && "Please provide numbers only"}
      </div>
      <div>
        <Button onClick={handleBtnClick} disabled={!validValue} size="sm">
          Add chapter
        </Button>
      </div>
    </div>
  );
};

export default AddChapterForm;
