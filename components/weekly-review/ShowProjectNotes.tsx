import { FC } from "react";
import { CopyToClipBoardBtn } from "@/components/CopyToClipBoardBtn";
import {
  hasMissingCategories,
  hasMissingNarratives,
  isValidCategory,
  ProjectForReview,
  validProject,
} from "@/helpers/weeklyReviewHelpers";
import { TrendingUp, TrendingDown, Eye, Sparkles } from "lucide-react";
import {
  createCategorizationPrompt,
  createNarrativePrompt,
} from "@/helpers/weeklyReviewPrompts";

interface ShowProjectNotesProps {
  projectNotes: ProjectForReview[];
  isProcessing: boolean;
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "customer_highlights":
      return <TrendingUp className="size-4 text-green-500" />;
    case "customer_lowlights":
      return <TrendingDown className="size-4 text-red-500" />;
    case "market_observations":
      return <Eye className="size-4 text-blue-500" />;
    case "genai_opportunities":
      return <Sparkles className="size-4 text-purple-500" />;
    default:
      return null;
  }
};

export const ShowProjectNotes: FC<ShowProjectNotesProps> = ({
  projectNotes,
  isProcessing,
}) => {
  return (
    projectNotes.length > 0 &&
    hasMissingNarratives(projectNotes) && (
      <div className="space-y-8">
        <h2 className="text-lg font-semibold mb-4">
          <span className="pr-2">Identified Projects</span>
          {!isProcessing && (
            <>
              {hasMissingCategories(projectNotes) && (
                <CopyToClipBoardBtn
                  content={createCategorizationPrompt(projectNotes)}
                  label="Copy & paste to Amazon Q for categorization"
                />
              )}

              {!hasMissingCategories(projectNotes) && (
                <>
                  {hasMissingNarratives(projectNotes) && (
                    <CopyToClipBoardBtn
                      content={createNarrativePrompt(projectNotes)}
                      label="Copy & paste to Amazon Q for narrative creation"
                    />
                  )}
                </>
              )}
            </>
          )}
        </h2>
        <div className="space-y-2">
          {projectNotes
            .filter(isValidCategory)
            .filter(validProject)
            .map(({ id, name, category }) => (
              <div key={id}>
                <div className="flex items-center gap-2">
                  <span>{name}</span>
                  {category && getCategoryIcon(category)}
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  );
};
