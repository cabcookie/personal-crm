import { flow, identity, map, times } from "lodash/fp";
import ApiLoadingError from "../layouts/ApiLoadingError";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import { useProjectFilter } from "../projects/useProjectFilter";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Accordion } from "../ui/accordion";

const ProjectList = () => {
  const { projects, loadingProjects, errorProjects } = useProjectFilter();

  return (
    <div className="space-y-4">
      <ApiLoadingError title="Loading projects failed" error={errorProjects} />

      {!loadingProjects && projects.length === 0 && (
        <div className="text-muted-foreground text-sm font-semibold">
          No projects
        </div>
      )}

      <Accordion type="single" collapsible>
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
          <ProjectAccordionItem key={project.id} project={project} />
        ))}
      </Accordion>
    </div>
  );
};

export default ProjectList;
