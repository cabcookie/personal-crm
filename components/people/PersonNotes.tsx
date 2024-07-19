import { useProjectsContext } from "@/api/ContextProjects";
import usePersonActivities, { PersonActivity } from "@/api/usePersonActivities";
import { flatMap, flow } from "lodash/fp";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
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
      widthTitleRem={3}
      widthSubTitleRem={28}
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
      {activities?.map((a) => (
        <ActivityComponent
          key={a.id}
          activityId={a.id}
          showDates
          showMeeting
          showProjects
        />
      ))}
    </DefaultAccordionItem>
  );
};

export default PersonNotes;
