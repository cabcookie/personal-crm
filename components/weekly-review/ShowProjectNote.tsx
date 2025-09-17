import { Dispatch, FC, SetStateAction, useState } from "react";
import { Copy, ExternalLink, Loader2, Play, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  getCategory,
  getWeeklyNarrative,
  ProjectForReview,
} from "@/helpers/weeklyReviewHelpers";
import { useWeeklyReview, WeeklyReviewEntry } from "@/api/useWeeklyReview";
import Link from "next/link";

interface ShowProjectNoteProps {
  project: ProjectForReview;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
}

export const ShowProjectNote: FC<ShowProjectNoteProps> = ({
  project,
  setProjectNotes,
}) => {
  const { id, name, notes, accountNames, projectId } = project;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createWeeklyReview } = useWeeklyReview();

  const shouldTruncate = notes.length > 200 && !isExpanded;

  const removeFromReview = (id: string) => () => {
    setProjectNotes((projects) =>
      projects.map(
        (p): ProjectForReview => (p.id !== id ? p : { ...p, category: "none" })
      )
    );
  };

  const handleAnalyze = (project: ProjectForReview) => async () => {
    setIsProcessing(true);
    const categories = await getCategory(project);
    if (!categories || categories.length === 0) return;
    const narratives = await Promise.all(
      categories.map((category) =>
        getWeeklyNarrative({
          ...project,
          category: category as WeeklyReviewEntry["category"],
        })
      )
    );
    await createWeeklyReview(narratives.filter((n) => !!n));
    setProjectNotes((projects) =>
      projects.filter(
        (p) => !narratives.some((n) => n?.projectId === p.projectId)
      )
    );
    setIsProcessing(false);
  };

  const copyToClipboard = (notes: string) => async () => {
    try {
      await navigator.clipboard.writeText(notes);
    } catch (err) {
      console.error("Failed to copy notes:", err);
    }
  };

  const toggleNotesExpansion = () => {
    setIsExpanded((current) => !current);
  };

  return (
    <div key={id} className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium">{name}</h3>
          {accountNames && accountNames.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {accountNames.join(", ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAnalyze(project)}
            size="sm"
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            {!isProcessing ? (
              <>
                <Play className="size-3" />
                Analyze
              </>
            ) : (
              <>
                <Loader2 className="size-3 animate-spin" />
                Generating…
              </>
            )}
          </Button>
          <div className="flex items-center gap-0">
            <Link href={`/projects/${projectId}`} target="_blank">
              <Button
                variant="ghost"
                size="icon"
                title="Open project in new window"
              >
                <ExternalLink className="size-4 text-muted-foreground hover:text-blue-600" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFromReview(id)}
              title="Remove from analysis"
            >
              <Trash2 className="size-4 text-muted-foreground hover:text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className="text-sm text-muted-foreground bg-muted/50 rounded p-3 cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={toggleNotesExpansion}
        title="Click to expand/collapse notes"
      >
        {shouldTruncate ? (
          `${notes.substring(0, 200)}...`
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm">{notes}</pre>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted-foreground">
          {notes.length} characters
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard(notes)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            title="Copy notes to clipboard"
          >
            <Copy className="size-3" />
            Copy
          </button>
          {notes.length > 200 && (
            <button
              onClick={toggleNotesExpansion}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
