import usePersonLearnings from "@/api/usePersonLearnings";
import {
  EditorJsonContent,
  getTextFromEditorJsonContent,
} from "@/helpers/ui-notes-writer";
import { debounce } from "lodash";
import { flow, get, map } from "lodash/fp";
import { PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import LearningComponent from "../learnings/LearningComponent";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Button } from "../ui/button";

type DebouncedUpdateLearningsProps = {
  learningId: string;
  updateLearning: (learningId: string, learning: EditorJsonContent) => void;
  serializer: () => { json: EditorJsonContent };
};

const debouncedUpdateLearnings = debounce(
  async ({
    learningId,
    updateLearning,
    serializer,
  }: DebouncedUpdateLearningsProps) => {
    const { json: learning } = serializer();
    await updateLearning(learningId, learning);
  },
  1500
);

type PersonLearningsProps = {
  personId?: string;
  accordionSelectedValue?: string;
};

const PersonLearnings: FC<PersonLearningsProps> = ({
  personId,
  accordionSelectedValue,
}) => {
  const {
    learnings,
    createLearning,
    deleteLearning,
    updateLearning,
    updatePrayerStatus,
  } = usePersonLearnings(personId);
  const [editId, setEditId] = useState<string | null>(null);

  const handleCreate = async () => {
    const newId = await createLearning();
    if (newId) setEditId(newId);
  };

  const handleLearningUpdate =
    (learningId: string) => (serializer: () => { json: EditorJsonContent }) => {
      debouncedUpdateLearnings({
        learningId,
        updateLearning,
        serializer,
      });
    };
  return (
    <DefaultAccordionItem
      value="learnings"
      triggerTitle="Learnings"
      triggerSubTitle={
        learnings &&
        flow(
          (l) => l.slice(0, 2),
          map(get("learning")),
          map(getTextFromEditorJsonContent)
        )(learnings)
      }
      accordionSelectedValue={accordionSelectedValue}
    >
      <div className="mb-2 space-y-2">
        <Button size="sm" className="gap-1" onClick={handleCreate}>
          <PlusCircle className="w-4 h-4" />
          Learning
        </Button>
      </div>
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
          onStatusChange={(val) => updatePrayerStatus(learning.id, val)}
        />
      ))}
    </DefaultAccordionItem>
  );
};

export default PersonLearnings;
