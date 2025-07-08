import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import { Dispatch, FC, SetStateAction } from "react";
import { CopyResultBase } from "./CopyResultBase";

interface CopyCategorizationResultProps {
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
}

export const CopyCategorizationResult: FC<CopyCategorizationResultProps> = ({
  setProjectNotes,
}) => {
  const processCategorizationJson = (
    jsonData: any[],
    setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>
  ) => {
    setProjectNotes((prevNotes) => {
      return prevNotes
        .map((note) => {
          const update = jsonData.find((item) => item.id === note.id);
          if (update) {
            return { ...note, category: update.category };
          }
          return note;
        })
        .filter((note) => note.category !== "none");
    });
  };

  return (
    <CopyResultBase
      setProjectNotes={setProjectNotes}
      label="Paste categorization result:"
      placeholder="Paste the Amazon Q categorization result here..."
      inputId="categorization-input"
      onProcessJson={processCategorizationJson}
    />
  );
};
