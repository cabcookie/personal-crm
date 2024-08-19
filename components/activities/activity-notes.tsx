import { Activity } from "@/api/useActivity";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromEditorJsonContent } from "../ui-elements/editors/helpers/text-generation";
import NotesEditor from "../ui-elements/editors/notes-editor/NotesEditor";
import ActivityMetaData from "./activity-meta-data";

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
      triggerSubTitle={getTextFromEditorJsonContent(activity.notes)}
      className="tracking-tight"
    >
      <NotesEditor
        activityId={activity.id}
        readonly={readOnly}
        key={activity.id}
      />

      <ActivityMetaData activity={activity} />
    </DefaultAccordionItem>
  );
};

export default ActivityNotes;
