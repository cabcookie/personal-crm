import { FC, ReactNode, useState } from "react";
import NotesWriter from "../notes-writer/NotesWriter";
import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../notes-writer/notes-writer-helpers";
import styles from "./ProjectDetails.module.css";
import { debouncedUpdateActions } from "./project-updates-helpers";

type NextActionsProps = {
  own: string;
  others: string;
  saveFn: (own: string, others: string) => Promise<string | undefined>;
};

type NextActionHelperProps = {
  title: ReactNode;
  actions: string;
  saveFn: (actions: string) => Promise<string | undefined>;
};

const NextActionHelper: FC<NextActionHelperProps> = ({
  actions,
  saveFn,
  title,
}) => {
  const [saved, setSaved] = useState(true);

  const handleNextActionsUpdate = (
    notes: Descendant[],
    transformerFn: TransformNotesToMdFunction
  ) => {
    setSaved(false);
    debouncedUpdateActions({
      notes,
      transformerFn,
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
