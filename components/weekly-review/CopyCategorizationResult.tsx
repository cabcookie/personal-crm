import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import { Dispatch, FC, SetStateAction } from "react";
import { CopyResultBase } from "./CopyResultBase";
import { flow, identity, map } from "lodash/fp";

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
    setProjectNotes(
      flow(
        identity<ProjectForReview[]>,
        map((note) => {
          const update = jsonData.find((item) => item.id === note.id);
          if (update) {
            return { ...note, category: update.category };
          }
          return note;
        })
      )
    );
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
