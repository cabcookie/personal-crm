import { Project, useProjectsContext } from "@/api/ContextProjects";
import { filter, flow, map } from "lodash/fp";
import { FC, useState } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import { Accordion } from "../ui/accordion";

type ActivityProjectListProps = {
  projectIds?: string[];
  addProjectToActivity?: (
    projectId: string | null
  ) => Promise<string | undefined>;
};

const ActivityProjectList: FC<ActivityProjectListProps> = ({
  projectIds,
  addProjectToActivity,
}) => {
  const { projects } = useProjectsContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return !projectIds || !projects ? (
    "Loading…"
  ) : (
    <div>
      {addProjectToActivity && (
        <ProjectSelector
          value=""
          onChange={addProjectToActivity}
          placeholder="Add project to activity…"
        />
      )}

      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {flow(
          filter((p: Project) => projectIds.includes(p.id)),
          map((project) => (
            <ProjectAccordionItem
              key={project.id}
              project={project}
              accordionSelectedValue={accordionValue}
              showNotes={false}
            />
          ))
        )(projects)}
      </Accordion>
    </div>
  );
};

export default ActivityProjectList;
