import { PersonLearning } from "@/api/usePersonLearnings";
import { EditorJsonContent, getEditorContent } from "@/helpers/ui-notes-writer";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, Edit, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import PrayerStatus, { TPrayerStatus } from "../prayer/PrayerStatus";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import DateSelector from "../ui-elements/selectors/date-selector";
import { Button } from "../ui/button";

type LearningComponentProps = {
  learning: PersonLearning;
  editable?: boolean;
  onMakeEditable?: () => void;
  onDelete?: () => void;
  onChange: (serializer: () => { json: EditorJsonContent }) => void;
  onStatusChange: (val: TPrayerStatus) => void;
  onDateChange: (newDate: Date) => Promise<string | undefined>;
};

const LearningComponent: FC<LearningComponentProps> = ({
  learning,
  editable,
  onMakeEditable,
  onDelete,
  onChange,
  onDateChange,
  onStatusChange,
}) => {
  const [savingDate, setSavingDate] = useState(false);

  const handleDateChange = async (newDate: Date) => {
    setSavingDate(true);
    console.log({ newDate });
    await onDateChange(newDate);
    setSavingDate(false);
  };

  return (
    <div className="py-2 space-y-1">
      <h3 className="text-base md:text-lg font-bold tracking-tight flex items-center gap-2">
        {editable && (
          <DateSelector
            date={learning.learnedOn}
            setDate={handleDateChange}
            bold
            isLoading={savingDate}
          />
        )}
        {!editable && format(learning.learnedOn, "PPP")}
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
      <PrayerStatus
        status={learning.prayerStatus}
        onChange={onStatusChange}
        editable={!!editable}
      />
      <div className={cn(!editable && "-mx-2")}>
        <NotesWriter
          readonly={!editable}
          placeholder="Document what you've learned about the person…"
          notes={learning.learning}
          saveNotes={(editor) => onChange(getEditorContent(editor))}
        />
      </div>
    </div>
  );
};

export default LearningComponent;
