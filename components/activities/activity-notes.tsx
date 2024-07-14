import { Activity } from "@/api/useActivity";
import {
  EditorJsonContent,
  getTextFromEditorJsonContent,
  SerializerOutput,
} from "@/helpers/ui-notes-writer";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { debouncedUpdateNotes } from "./activity-helper";
import ActivityMetaData from "./activity-meta-data";

type ActivityNotesProps = {
  activity?: Activity;
  accordionSelectedValue?: string;
  updateNotes: (notes: EditorJsonContent) => Promise<string | undefined>;
};

const ActivityNotes: FC<ActivityNotesProps> = ({
  activity,
  accordionSelectedValue,
  updateNotes,
}) => {
  const handleNotesUpdate = (serializer: () => SerializerOutput) => {
    debouncedUpdateNotes({
      updateNotes,
      serializer,
    });
  };

  return !activity ? (
    "Loading…"
  ) : (
    <DefaultAccordionItem
      value="notes"
      triggerTitle="Notes"
      triggerSubTitle={getTextFromEditorJsonContent(activity.notes)}
      className="tracking-tight"
      accordionSelectedValue={accordionSelectedValue}
    >
      <NotesWriter
        notes={activity.notes}
        saveNotes={handleNotesUpdate}
        key={activity.id}
      />

      <ActivityMetaData activity={activity} />
    </DefaultAccordionItem>
  );
};

export default ActivityNotes;
