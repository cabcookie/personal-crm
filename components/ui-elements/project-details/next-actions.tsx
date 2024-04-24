import { FC, useState } from "react";
import NotesWriter from "../notes-writer/NotesWriter";
import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../notes-writer/notes-writer-helpers";
import { debounce } from "lodash";
import styles from "./ProjectDetails.module.css";

type DebouncedUpdateActionsProps = {
  notes: Descendant[];
  transformerFn: TransformNotesToMdFunction;
  setSaveStatus: (status: boolean) => void;
  updateActions: (actions: string) => Promise<string | undefined>;
};

const debouncedUpdateActions = debounce(
  async ({
    notes,
    transformerFn,
    setSaveStatus,
    updateActions,
  }: DebouncedUpdateActionsProps) => {
    const actions = transformerFn(notes);
    const data = await updateActions(actions);
    if (data) setSaveStatus(true);
  },
  1000
);

type NextActionsProps = {
  own: string;
  others: string;
  saveFn: (own: string, others: string) => Promise<string | undefined>;
};

type NextActionHelperProps = {
  title: string;
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
      <h3 className={styles.title}>{title}</h3>
      <NotesWriter
        notes={actions}
        unsaved={!saved}
        saveNotes={handleNextActionsUpdate}
        placeholder="Define next actions..."
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
