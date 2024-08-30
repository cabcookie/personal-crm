import usePersonLearnings from "@/api/usePersonLearnings";
import { Editor, JSONContent } from "@tiptap/core";
import { debounce } from "lodash";
import { flow, map } from "lodash/fp";
import { PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import LearningComponent from "../learnings/LearningComponent";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import { Button } from "../ui/button";

type DebouncedUpdateLearningsProps = {
  learningId: string;
  updateLearning: (learningId: string, learning: JSONContent) => void;
  editor: Editor;
};

const debouncedUpdateLearnings = debounce(
  async ({
    learningId,
    updateLearning,
    editor,
  }: DebouncedUpdateLearningsProps) => {
    await updateLearning(learningId, editor.getJSON());
  },
  1500
);

type PersonLearningsProps = {
  personId?: string;
};

const PersonLearnings: FC<PersonLearningsProps> = ({ personId }) => {
  const {
    learnings,
    createLearning,
    deleteLearning,
    updateLearning,
    updateDate,
    updatePrayerStatus,
  } = usePersonLearnings(personId);
  const [editId, setEditId] = useState<string | null>(null);

  const handleCreate = async () => {
    const newId = await createLearning();
    if (newId) setEditId(newId);
  };

  const handleLearningUpdate = (learningId: string) => (editor: Editor) => {
    debouncedUpdateLearnings({
      learningId,
      updateLearning,
      editor,
    });
  };

  return !personId ? (
    <LoadingAccordionItem
      value="loading-learnings"
      sizeTitle="sm"
      sizeSubtitle="xl"
    />
  ) : (
    <DefaultAccordionItem
      value="learnings"
      triggerTitle="Learnings"
      triggerSubTitle={
        learnings &&
        flow(
          (l) => l.slice(0, 2),
          map("learning"),
          map(getTextFromJsonContent)
        )(learnings)
      }
    >
      <div className="space-y-4 px-1 md:px-2">
        <Button size="sm" className="gap-1" onClick={handleCreate}>
          <PlusCircle className="w-4 h-4" />
          Learning
        </Button>

        {learnings?.map((learning) => (
          <LearningComponent
            key={learning.id}
            learning={learning}
            editable={learning.id === editId}
            onMakeEditable={() =>
              setEditId(editId === learning.id ? null : learning.id)
            }
            onDelete={() => deleteLearning(learning.id)}
            onChange={handleLearningUpdate(learning.id)}
            onDateChange={(date) => updateDate(learning.id, date)}
            onStatusChange={(val) => updatePrayerStatus(learning.id, val)}
          />
        ))}
      </div>
    </DefaultAccordionItem>
  );
};

export default PersonLearnings;
