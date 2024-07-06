import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { filter, flow, map } from "lodash/fp";
import { FC, useState } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import { Accordion } from "../ui/accordion";

type ActivityProjectListProps = {
  projectIds?: string[];
  addProjectToActivity?: (
    projectId: string | null
  ) => Promise<string | undefined>;
  accordionSelectedValue?: string;
  showProjects?: boolean;
};

const ActivityProjectList: FC<ActivityProjectListProps> = ({
  projectIds,
  addProjectToActivity,
  accordionSelectedValue,
  showProjects,
}) => {
  const { projects } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

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
      accordionSelectedValue={accordionSelectedValue}
      isVisible={showProjects}
    >
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
    </DefaultAccordionItem>
  );
};

export default ActivityProjectList;
