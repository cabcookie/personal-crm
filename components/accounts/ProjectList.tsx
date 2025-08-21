import { flow, identity, map, times } from "lodash/fp";
import ApiLoadingError from "../layouts/ApiLoadingError";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import { useProjectFilter } from "../projects/useProjectFilter";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Accordion } from "../ui/accordion";

interface ProjectListProps {
  showPin?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ showPin = false }) => {
  const {
    projects,
    loadingProjects,
    errorProjects,
    moveProjectUp,
    moveProjectDown,
  } = useProjectFilter();

  return (
    <div className="space-y-4">
      <ApiLoadingError title="Loading projects failed" error={errorProjects} />

      {!loadingProjects && projects.length === 0 && (
        <div className="text-muted-foreground text-sm font-semibold">
          No projects
        </div>
      )}

      <Accordion type="single" collapsible>
        <div className="px-1 md:px-2 text-muted-foreground text-sm font-semibold">
          {projects.length} projects
        </div>

        {loadingProjects &&
          flow(
            times(identity),
            map((id: number) => (
              <LoadingAccordionItem
                key={id}
                value={`loading-${id}`}
                sizeTitle="lg"
                sizeSubtitle="base"
              />
            ))
          )(10)}

        {projects.map((project) => (
          <ProjectAccordionItem
            key={project.id}
            project={project}
            showPin={showPin}
            onMoveUp={moveProjectUp}
            onMoveDown={moveProjectDown}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ProjectList;
