import { WeeklyReview, useWeeklyReview } from "@/api/useWeeklyReview";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { ButtonInAccordion } from "./ButtonInAccordion";
import { useProjectsContext } from "@/api/ContextProjects";
import {
  getIgnoredEntryCount,
  getIgnoredEntries,
} from "@/helpers/weeklyReviewHelpers";

interface IgnoredProjectsListProps {
  weeklyReview: WeeklyReview;
}

export const IgnoredProjectsList: FC<IgnoredProjectsListProps> = ({
  weeklyReview,
}) => {
  const { projects } = useProjectsContext();
  const { deleteWeeklyReviewEntry } = useWeeklyReview();
  const [showIgnored, setShowIgnored] = useState(false);

  const ignoredCount = getIgnoredEntryCount(weeklyReview);
  const ignoredEntries = getIgnoredEntries(weeklyReview);

  const handleDeleteIgnoredEntry = (entryId: string) => async () => {
    await deleteWeeklyReviewEntry(entryId);
  };

  const getProjectName = (projectId: string) => {
    return (
      projects?.find((p) => p.id === projectId)?.project || "Unknown Project"
    );
  };

  if (ignoredCount === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowIgnored(!showIgnored)}
        >
          {showIgnored ? (
            <>
              <EyeOff className="size-4 mr-2" />
              Hide Ignored Projects ({ignoredCount})
            </>
          ) : (
            <>
              <Eye className="size-4 mr-2" />
              Show Ignored Projects ({ignoredCount})
            </>
          )}
        </Button>
      </div>

      {showIgnored && (
        <div className="space-y-2">
          {ignoredEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-2 bg-muted rounded"
            >
              <span className="text-sm">{getProjectName(entry.projectId)}</span>
              <ButtonInAccordion
                onClick={handleDeleteIgnoredEntry(entry.id)}
                label="Delete"
                Icon={Trash2}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
