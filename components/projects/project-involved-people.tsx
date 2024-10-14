import { Project } from "@/api/ContextProjects";
import usePeople from "@/api/usePeople";
import { FC } from "react";
import PeopleList from "../people/PeopleList";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type ProjectInvolvedPeopleProps = {
  project: Project;
};

const ProjectInvolvedPeople: FC<ProjectInvolvedPeopleProps> = ({ project }) => {
  const { getNamesByIds } = usePeople();
  return (
    <DefaultAccordionItem
      value="involved-people"
      triggerTitle="Involved People"
      triggerSubTitle={getNamesByIds(project.involvedPeopleIds)}
    >
      <PeopleList personIds={project.involvedPeopleIds} showNotes={false} />
    </DefaultAccordionItem>
  );
};

export default ProjectInvolvedPeople;
