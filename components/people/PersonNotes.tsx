import { useProjectsContext } from "@/api/ContextProjects";
import usePersonActivities, { PersonActivity } from "@/api/usePersonActivities";
import { flatMap, flow } from "lodash/fp";
import { FC } from "react";
import LeanActivitiy from "../activities/activity-lean";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";

type PersonNotesProps = {
  personId?: string;
  showNotes?: boolean;
};

const PersonNotes: FC<PersonNotesProps> = ({ showNotes, personId }) => {
  const { activities } = usePersonActivities(personId);
  const { getProjectNamesByIds } = useProjectsContext();

  return !personId ? (
    <LoadingAccordionItem
      value="loading-notes"
      sizeTitle="xs"
      sizeSubtitle="lg"
    />
  ) : (
    <DefaultAccordionItem
      value="notes"
      triggerTitle="Notes"
      triggerSubTitle={[
        flow(
          flatMap((a: PersonActivity) => a.projectIds),
          getProjectNamesByIds
        )(activities),
      ]}
      isVisible={!!showNotes}
    >
      <div className="space-y-6">
        {activities?.map((a) => (
          <LeanActivitiy key={a.id} activity={a} readonly />
        ))}
      </div>
    </DefaultAccordionItem>
  );
};

export default PersonNotes;
