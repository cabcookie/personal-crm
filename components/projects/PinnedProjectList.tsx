import { useProjectsContext } from "@/api/ContextProjects";
import { flow, identity, map, times } from "lodash/fp";
import { AlertTriangle, Pin } from "lucide-react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Accordion } from "../ui/accordion";
import ProjectAccordionItem from "./ProjectAccordionItem";

interface PinnedProjectListProps {
  isVisible?: boolean;
  showPin?: boolean;
}

const PinnedProjectList: React.FC<PinnedProjectListProps> = ({
  isVisible = true,
  showPin = false,
}) => {
  const { pinnedProjects, loadingPinnedProjects, errorPinnedProjects } =
    useProjectsContext();

  if (!isVisible) {
    return null;
  }

  const pinnedCount = pinnedProjects?.length || 0;
  const maxPinnedProjects = 3;
  const isOverLimit = pinnedCount > maxPinnedProjects;
  const excessCount = pinnedCount - maxPinnedProjects;

  // Determine the message based on pinned count
  const getPinnedMessage = () => {
    if (isOverLimit) {
      return `Pin only ${maxPinnedProjects} projects, remove ${excessCount} ${excessCount === 1 ? "project" : "projects"}`;
    }
    if (pinnedCount === 0) {
      return `Pin up to ${maxPinnedProjects} projects`;
    }
    if (pinnedCount < maxPinnedProjects) {
      const remaining = maxPinnedProjects - pinnedCount;
      return `Pin ${remaining} more ${remaining === 1 ? "project" : "projects"}`;
    }
    return `${pinnedCount} pinned ${pinnedCount === 1 ? "project" : "projects"}`;
  };

  return (
    <div
      className={`border rounded-lg p-3 mb-6 ${
        isOverLimit
          ? "border-destructive/50 bg-destructive/10"
          : "border-border bg-muted/30"
      }`}
    >
      <ApiLoadingError
        title="Loading pinned projects failed"
        error={errorPinnedProjects}
      />

      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        {isOverLimit ? (
          <AlertTriangle size={16} className="text-destructive" />
        ) : (
          <Pin size={16} className="text-primary" />
        )}
        <span
          className={`text-sm font-semibold ${isOverLimit ? "text-destructive" : ""}`}
        >
          {getPinnedMessage()}
        </span>
      </div>

      {loadingPinnedProjects ? (
        <Accordion type="single" collapsible>
          {flow(
            times(identity),
            map((id: number) => (
              <LoadingAccordionItem
                key={id}
                value={`loading-pinned-${id}`}
                sizeTitle="lg"
                sizeSubtitle="base"
              />
            ))
          )(3)}
        </Accordion>
      ) : pinnedProjects && pinnedProjects.length > 0 ? (
        <Accordion type="single" collapsible>
          {pinnedProjects.map((project) => (
            <ProjectAccordionItem
              key={project.id}
              project={project}
              onMoveUp={() => Promise.resolve(undefined)}
              onMoveDown={() => Promise.resolve(undefined)}
              showPin={showPin}
            />
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground">
          {pinnedCount === 0
            ? "Pin your most important projects here for quick access"
            : isOverLimit
              ? "Too many projects pinned. Please unpin some projects."
              : "No projects to display"}
        </div>
      )}
    </div>
  );
};

export default PinnedProjectList;
