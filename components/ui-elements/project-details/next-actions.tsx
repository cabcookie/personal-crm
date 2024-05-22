import { FC, ReactNode } from "react";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "../notes-writer/NotesWriter";
import RecordDetails from "../record-details/record-details";
import styles from "./ProjectDetails.module.css";
import { debouncedUpdateActions } from "./project-updates-helpers";

type NextActionsProps = {
  own?: EditorJsonContent | string;
  others?: EditorJsonContent | string;
  saveFn: (
    own: EditorJsonContent | string,
    others: EditorJsonContent | string
  ) => Promise<string | undefined>;
};

type NextActionHelperProps = {
  title: ReactNode;
  actions?: EditorJsonContent | string;
  saveFn: (actions: EditorJsonContent) => Promise<string | undefined>;
};

const NextActionHelper: FC<NextActionHelperProps> = ({
  actions,
  saveFn,
  title,
}) => {
  const handleNextActionsUpdate = (serializer: () => SerializerOutput) => {
    debouncedUpdateActions({
      serializer,
      updateActions: saveFn,
    });
  };

  return (
    <RecordDetails title={title}>
      <NotesWriter
        notes={actions}
        saveNotes={handleNextActionsUpdate}
        placeholder="Define next actions..."
      />
    </RecordDetails>
  );
};

const NextActions: FC<NextActionsProps> = ({ own, others, saveFn }) => {
  return (
    <div className={styles.oneRow}>
      <NextActionHelper
        title="My next actions"
        actions={own}
        saveFn={(actions) => saveFn(actions, others || "")}
      />
      <NextActionHelper
        title="Other's next actions"
        actions={others}
        saveFn={(actions) => saveFn(own || "", actions)}
      />
    </div>
  );
};

export default NextActions;
