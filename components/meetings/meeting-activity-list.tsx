import { Project, useProjectsContext } from "@/api/ContextProjects";
import { Meeting } from "@/api/useMeetings";
import { filter, flow, get, map } from "lodash/fp";
import { FC, useState } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromEditorJsonContent } from "../ui-elements/notes-writer/NotesWriter";
import { Accordion } from "../ui/accordion";

type MeetingActivityListProps = {
  meeting: Meeting;
  accordionSelectedValue?: string;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({
  accordionSelectedValue,
  meeting,
}) => {
  const { projects } = useProjectsContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return (
    meeting.activities.length > 0 && (
      <DefaultAccordionItem
        value="notes"
        triggerTitle="Notes"
        triggerSubTitle={[
          ...flow(
            filter((p: Project) =>
              meeting.activities.some((a) => a.projectIds.includes(p.id))
            ),
            map(get("project"))
          )(projects),
          ...flow(
            map(get("notes")),
            map(getTextFromEditorJsonContent)
          )(meeting.activities),
        ]}
        className="tracking-tight"
        accordionSelectedValue={accordionSelectedValue}
      >
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          {meeting.activities.map((a) => (
            <ActivityComponent
              key={a.id}
              activityId={a.id}
              showMeeting={false}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default MeetingActivityList;
