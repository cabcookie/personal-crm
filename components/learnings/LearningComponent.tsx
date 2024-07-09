import { PersonLearning } from "@/api/usePersonLearnings";
import { FC } from "react";
import { format } from "date-fns";
import NotesWriter, {
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";
import { Button } from "../ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LearningComponentProps = {
  learning: PersonLearning;
  editable?: boolean;
  onMakeEditable?: () => void;
  onDelete?: () => void;
  onChange: (serializer: () => SerializerOutput) => void;
};

const LearningComponent: FC<LearningComponentProps> = ({
  learning,
  editable,
  onMakeEditable,
  onDelete,
  onChange,
}) => (
  <div className="py-2 space-y-1">
    <h3 className="text-base md:text-lg font-bold tracking-tight flex items-center gap-2">
      {format(learning.learnedOn, "PPP")}
      {onMakeEditable && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={onMakeEditable}
        >
          {editable ? (
            <Check className="w-5 h-5" />
          ) : (
            <Edit className="w-5 h-5" />
          )}
        </Button>
      )}
      {editable && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={onDelete}
          asChild
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
    </h3>
    <div className={cn(!editable && "-mx-2")}>
      <NotesWriter
        readonly={!editable}
        placeholder="Document what you've learned about the person…"
        notes={learning.learning}
        saveNotes={onChange}
      />
    </div>
  </div>
);

export default LearningComponent;