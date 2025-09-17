import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { ProjectForReview, validProject } from "@/helpers/weeklyReviewHelpers";
import { ShowProjectNote } from "./ShowProjectNote";
import { TrendingDown, TrendingUp, Eye, Sparkles } from "lucide-react";

interface ShowProjectNotesProps {
  projectNotes: ProjectForReview[];
  isProcessing: boolean;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
}

export const ShowProjectNotes: FC<ShowProjectNotesProps> = ({
  projectNotes,
  setProjectNotes,
}) => {
  const validProjects = useMemo(
    () => projectNotes.filter(validProject),
    [projectNotes]
  );

  return (
    projectNotes.length > 0 && (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">
          Projects Ready for Analysis ({validProjects.length})
        </h2>

        <div className="space-y-3">
          {validProjects.map((project) => (
            <ShowProjectNote
              key={project.projectId}
              {...{ project, setProjectNotes }}
            />
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
