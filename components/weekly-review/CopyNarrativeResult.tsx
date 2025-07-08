import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import { Dispatch, FC, SetStateAction } from "react";
import { CopyResultBase } from "./CopyResultBase";
import { useWeeklyReview } from "@/api/useWeeklyReview";

interface CopyNarrativeResultProps {
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  createWeeklyReview: ReturnType<typeof useWeeklyReview>["createWeeklyReview"];
}

export const CopyNarrativeResult: FC<CopyNarrativeResultProps> = ({
  setProjectNotes,
  createWeeklyReview,
}) => {
  const processNarrativeJson = (
    jsonData: any[],
    setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>
  ) => {
    setProjectNotes((prevNotes) => {
      const newNotes = prevNotes.map((note) => {
        const update = jsonData.find((item) => item.id === note.id);
        if (update && update.wbrText) {
          return { ...note, wbrText: update.wbrText };
        }
        return note;
      });
      createWeeklyReview(newNotes);
      return newNotes;
    });
  };

  return (
    <CopyResultBase
      setProjectNotes={setProjectNotes}
      label="Paste narrative result:"
      placeholder="Paste the Amazon Q narrative result here..."
      inputId="narrative-input"
      onProcessJson={processNarrativeJson}
    />
  );
};
