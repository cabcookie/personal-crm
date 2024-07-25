import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Activity } from "@/api/useActivity";
import {
  getEditorContentAndTaskData,
  getTextFromEditorJsonContent,
  SerializerOutput,
  TWithGetJsonFn,
} from "@/helpers/ui-notes-writer";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { debouncedUpdateNotes } from "./activity-helper";
import ActivityMetaData from "./activity-meta-data";

type ActivityNotesProps = {
  activity?: Activity;
  updateNotes: (
    serializedOutput: SerializerOutput
  ) => Promise<string | undefined>;
  readOnly?: boolean;
};

const ActivityNotes: FC<ActivityNotesProps> = ({
  activity,
  updateNotes,
  readOnly,
}) => {
  const { mutateOpenTasks } = useOpenTasksContext();

  const handleNotesUpdate = (editor: TWithGetJsonFn) => {
    debouncedUpdateNotes({
      updateNotes,
      serializer: getEditorContentAndTaskData(editor, (tasks) =>
        mutateOpenTasks(tasks, activity)
      ),
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
    >
      <NotesWriter
        notes={activity.notes}
        saveNotes={handleNotesUpdate}
        key={activity.id}
        readonly={readOnly}
      />

      <ActivityMetaData activity={activity} />
    </DefaultAccordionItem>
  );
};

export default ActivityNotes;
