import { useProjectsContext } from "@/api/ContextProjects";
import { Activity } from "@/api/useActivity";
import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { format } from "date-fns";
import { flatMap, flow, get, map } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromEditorJsonContent } from "../ui-elements/notes-writer/NotesWriter";
import MeetingRecord from "./meeting";

type MeetingAccordionItemProps = {
  meeting: Meeting;
  accordionSelectedValue?: string;
};

const MeetingAccordionItem: FC<MeetingAccordionItemProps> = ({
  meeting,
  accordionSelectedValue,
}) => {
  const { getNamesByIds } = usePeople();
  const { getProjectNamesByIds } = useProjectsContext();

  return (
    <DefaultAccordionItem
      value={meeting.id}
      triggerTitle={`${meeting.topic} (${format(meeting.meetingOn, "Pp")})`}
      className="tracking-tight"
      accordionSelectedValue={accordionSelectedValue}
      link={`/meetings/${meeting.id}`}
      triggerSubTitle={[
        meeting.participantIds.length > 0 &&
          `Participants: ${getNamesByIds(meeting.participantIds)}`,
        meeting.activities.flatMap((a) => a.projectIds).length > 0 &&
          `Projects: ${flow(
            flatMap((a: Activity) => a.projectIds),
            getProjectNamesByIds
          )(meeting.activities)}`,
        meeting.activities.length > 0 &&
          `Notes: ${flow(
            map(get("notes")),
            map(getTextFromEditorJsonContent)
          )(meeting.activities)}`,
      ]}
    >
      <MeetingRecord meeting={meeting} />
    </DefaultAccordionItem>
  );
};

export default MeetingAccordionItem;