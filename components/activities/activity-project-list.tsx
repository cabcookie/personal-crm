import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { filter, flow, map } from "lodash/fp";
import { FC } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import { Accordion } from "../ui/accordion";

type ActivityProjectListProps = {
  projectIds?: string[];
  addProjectToActivity?: (
    projectId: string | null
  ) => Promise<string | undefined>;
  showProjects?: boolean;
};

const ActivityProjectList: FC<ActivityProjectListProps> = ({
  projectIds,
  addProjectToActivity,
  showProjects,
}) => {
  const { projects } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();

  return !projectIds || !projects ? (
    "Loading…"
  ) : (
    <DefaultAccordionItem
      value="projects"
      triggerTitle="For projects"
      triggerSubTitle={flow(
        filter((p: Project) => projectIds.includes(p.id)),
        map(
          (p) =>
            `${p.project}${
              !p.accountIds ? "" : ` (${getAccountNamesByIds(p.accountIds)})`
            }`
        )
      )(projects)}
      className="tracking-tight"
      isVisible={showProjects}
    >
      {addProjectToActivity && (
        <ProjectSelector
          value=""
          onChange={addProjectToActivity}
          placeholder="Add project to activity…"
        />
      )}

      <Accordion type="single" collapsible>
        {flow(
          filter((p: Project) => projectIds.includes(p.id)),
          map((project) => (
            <ProjectAccordionItem
              key={project.id}
              project={project}
              showNotes={false}
            />
          ))
        )(projects)}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default ActivityProjectList;
