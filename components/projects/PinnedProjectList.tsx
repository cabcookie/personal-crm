import { useProjectsContext } from "@/api/ContextProjects";
import { flow, identity, map, times } from "lodash/fp";
import { Pin } from "lucide-react";
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

  if (!isVisible || !pinnedProjects || pinnedProjects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <ApiLoadingError
        title="Loading pinned projects failed"
        error={errorPinnedProjects}
      />

      <Accordion type="single" collapsible>
        <div className="px-1 md:px-2 text-muted-foreground text-sm font-semibold flex items-center gap-2">
          <Pin size={16} />
          {pinnedProjects.length} pinned projects
        </div>

        {loadingPinnedProjects &&
          flow(
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
    </div>
  );
};

export default PinnedProjectList;
