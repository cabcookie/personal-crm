import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import { Dispatch, FC, SetStateAction } from "react";
import { PasteResultBase } from "./PasteResultBase";
import { useWeeklyReview } from "@/api/useWeeklyReview";

interface PasteNarrativeResultProps {
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  createWeeklyReview: ReturnType<typeof useWeeklyReview>["createWeeklyReview"];
}

export const PasteNarrativeResult: FC<PasteNarrativeResultProps> = ({
  setProjectNotes,
  createWeeklyReview,
}) => {
  const processNarrativeJson = async (
    jsonData: any[],
    setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>
  ) => {
    let newNotes: ProjectForReview[] = [];
    setProjectNotes((prevNotes) => {
      newNotes = prevNotes.map((note) => {
        const update = jsonData.find((item) => item.entryId === note.id);
        if (update && update.wbrText) {
          return { ...note, wbrText: update.wbrText };
        }
        return note;
      });
      return newNotes;
    });
    await createWeeklyReview(newNotes);
    setProjectNotes([]);
  };

  return (
    <PasteResultBase
      setProjectNotes={setProjectNotes}
      label="Paste narrative result:"
      placeholder="Paste the Amazon Q narrative result here..."
      inputId="narrative-input"
      onProcessJson={processNarrativeJson}
    />
  );
};
