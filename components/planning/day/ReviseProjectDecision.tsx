import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import ReviseDecisionBtn from "./ReviseDecisionBtn";

type ReviseProjectDecisionProps = {
  maybe: boolean;
  onChange: (maybe: boolean) => void;
};

const ReviseProjectDecision: FC<ReviseProjectDecisionProps> = ({
  maybe,
  onChange,
}) => {
  const [savingDecision, setSavingDecision] = useState(false);

  const addProject = (maybe: boolean) => async () => {
    setSavingDecision(true);
    onChange(maybe);
  };

  return (
    <div className="flex flex-row items-baseline text-sm text-muted-foreground">
      <div>Will you work on this?</div>
      <ReviseDecisionBtn
        label="Yes"
        savingDecision={savingDecision}
        selected={maybe === false}
        makeDecision={addProject(false)}
      />
      <ReviseDecisionBtn
        label="Maybe"
        savingDecision={savingDecision}
        selected={maybe === true}
        makeDecision={addProject(true)}
      />
      {savingDecision && (
        <Loader2 className="mt-2 w-5 h-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};

export default ReviseProjectDecision;
