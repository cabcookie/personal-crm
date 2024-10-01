import { Activity } from "@/api/useActivity";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import NotesEditor from "../ui-elements/editors/notes-editor/NotesEditor";
import ActivityFormatBadge from "./activity-format-badge";

type ActivityNotesProps = {
  activity?: Activity;
  readOnly?: boolean;
};

const ActivityNotes: FC<ActivityNotesProps> = ({ activity, readOnly }) => {
  return !activity ? (
    "Loading…"
  ) : (
    <DefaultAccordionItem
      value="notes"
      triggerTitle="Notes"
      triggerSubTitle={getTextFromJsonContent(activity.notes)}
      className="tracking-tight"
      badge={activity.oldFormatVersion && <ActivityFormatBadge />}
    >
      <NotesEditor
        activityId={activity.id}
        readonly={readOnly}
        key={activity.id}
      />
    </DefaultAccordionItem>
  );
};

export default ActivityNotes;
