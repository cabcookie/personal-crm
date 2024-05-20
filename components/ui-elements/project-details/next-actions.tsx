import { FC, ReactNode, useState } from "react";
import NotesWriter, { EditorJsonContent } from "../notes-writer/NotesWriter";
import styles from "./ProjectDetails.module.css";
import { debouncedUpdateActions } from "./project-updates-helpers";

type NextActionsProps = {
  own: EditorJsonContent;
  others: EditorJsonContent;
  saveFn: (
    own: EditorJsonContent,
    others: EditorJsonContent
  ) => Promise<string | undefined>;
};

type NextActionHelperProps = {
  title: ReactNode;
  actions: EditorJsonContent;
  saveFn: (actions: EditorJsonContent) => Promise<string | undefined>;
};

const NextActionHelper: FC<NextActionHelperProps> = ({
  actions,
  saveFn,
  title,
}) => {
  const [saved, setSaved] = useState(true);

  const handleNextActionsUpdate = (serializer: () => EditorJsonContent) => {
    setSaved(false);
    debouncedUpdateActions({
      serializer,
      setSaveStatus: setSaved,
      updateActions: saveFn,
    });
  };

  return (
    <div className={styles.wrapper}>
      <NotesWriter
        notes={actions}
        unsaved={!saved}
        saveNotes={handleNextActionsUpdate}
        placeholder="Define next actions..."
        title={title}
      />
    </div>
  );
};

const NextActions: FC<NextActionsProps> = ({ own, others, saveFn }) => {
  return (
    <div className={styles.oneRow}>
      <NextActionHelper
        title="My next actions"
        actions={own}
        saveFn={(actions) => saveFn(actions, others)}
      />
      <NextActionHelper
        title="Other's next actions"
        actions={others}
        saveFn={(actions) => saveFn(own, actions)}
      />
    </div>
  );
};

export default NextActions;
