import { map } from "lodash/fp";
import { FC } from "react";
import PeopleList from "../people/PeopleList";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import useInvolvedPeople from "./useInvolvedPeople";

type ProjectInvolvedPeopleProps = {
  projectId: string;
};

const ProjectInvolvedPeople: FC<ProjectInvolvedPeopleProps> = ({
  projectId,
}) => {
  const { involvedPeople } = useInvolvedPeople(projectId);
  return (
    <DefaultAccordionItem
      value="involved-people"
      triggerTitle="Involved People"
      triggerSubTitle={involvedPeople?.map(
        ({ name, accountNames }) =>
          `${name}${!accountNames ? "" : ` (${accountNames})`}`
      )}
    >
      <PeopleList personIds={map("id")(involvedPeople)} showNotes={false} />
    </DefaultAccordionItem>
  );
};

export default ProjectInvolvedPeople;
