import { Dispatch, FC, SetStateAction } from "react";
import { CopyToClipBoardBtn } from "@/components/CopyToClipBoardBtn";
import {
  hasMissingCategories,
  hasMissingNarratives,
  isValidCategory,
  ProjectForReview,
  validProject,
} from "@/helpers/weeklyReviewHelpers";
import { TrendingUp, TrendingDown, Eye, Sparkles, Trash2 } from "lucide-react";
import {
  createCategorizationPrompt,
  createNarrativePrompt,
} from "@/helpers/weeklyReviewPrompts";
import { Button } from "../ui/button";
import { useWeeklyReview } from "@/api/useWeeklyReview";

interface ShowProjectNotesProps {
  projectNotes: ProjectForReview[];
  isProcessing: boolean;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  createWeeklyReview: ReturnType<typeof useWeeklyReview>["createWeeklyReview"];
}

export const ShowProjectNotes: FC<ShowProjectNotesProps> = ({
  projectNotes,
  isProcessing,
  setProjectNotes,
  createWeeklyReview,
}) => {
  const removeFromReview = (id: string) => async () => {
    const updatedProjects: ProjectForReview[] = createUpdatedProjects(
      projectNotes,
      id
    );
    setProjectNotes(updatedProjects);
    // Check if all projects now have category "none" then add to weekly review
    const allProjectsNone = updatedProjects.every((p) => p.category === "none");
    if (allProjectsNone && updatedProjects.length > 0) {
      await createWeeklyReview(updatedProjects);
      setProjectNotes([]);
    }
  };

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
                  <span>{name} </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFromReview(id)}
                  >
                    <Trash2 className="size-4 text-muted-foreground hover:text-black" />
                  </Button>
                  {category && getCategoryIcon(category)}
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  );
};

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

const createUpdatedProjects = (
  projectNotes: ProjectForReview[],
  entryId: string
): ProjectForReview[] => {
  const projectId = projectNotes.find((n) => n.id === entryId)?.projectId;
  if (!projectId) return projectNotes;
  const countProjectEntries = projectNotes.filter(
    (n) => n.projectId === projectId
  ).length;
  if (countProjectEntries > 1)
    return projectNotes.filter((n) => n.id !== entryId);
  return projectNotes.map((e) =>
    e.id !== entryId ? e : { ...e, category: "none" }
  );
};
