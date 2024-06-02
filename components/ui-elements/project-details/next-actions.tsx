import { FC, ReactNode } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
  getTextFromEditorJsonContent,
} from "../notes-writer/NotesWriter";
import RecordDetails from "../record-details/record-details";
import { debouncedUpdateActions } from "./project-updates-helpers";

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

type NextActionsProps = {
  own?: EditorJsonContent | string;
  others?: EditorJsonContent | string;
  saveFn: (
    own: EditorJsonContent | string,
    others: EditorJsonContent | string
  ) => Promise<string | undefined>;
  accordionSelectedValue?: string;
};

const NextActions: FC<NextActionsProps> = ({
  own,
  others,
  saveFn,
  accordionSelectedValue,
}) => {
  return (
    <DefaultAccordionItem
      value="next-actions"
      title="Next Actions"
      accordionSelectedValue={accordionSelectedValue}
      subTitle={
        <small>
          {own &&
            (typeof own === "string" ? own : getTextFromEditorJsonContent(own))}
        </small>
      }
      isVisible
    >
      <div className="flex flex-col md:flex-row gap-4 w-full p-0 m-0">
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
    </DefaultAccordionItem>
  );
};

export default NextActions;
