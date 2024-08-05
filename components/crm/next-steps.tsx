import useCrmProject from "@/api/useCrmProject";
import { CrmProject } from "@/api/useCrmProjects";
import { format } from "date-fns";
import { Edit, LinkIcon, Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";

type NextStepProps = {
  crmProject: CrmProject;
};

const NextStep: FC<NextStepProps> = ({ crmProject }) => {
  const { updateCrmProject } = useCrmProject(crmProject.id);
  const [editing, setEditing] = useState(false);
  const [nextStepVal, setNextStepVal] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditing(false);
    setIsSaving(false);
    setNextStepVal("");
  }, [crmProject]);

  const handleSaveClick = () => {
    setIsSaving(true);
    updateCrmProject({
      nextStep: `${format(new Date(), "MM/dd/yyyy")}: ${nextStepVal}`,
    });
  };

  const handleCopyToClipBoard = async () => {
    if (!crmProject.nextStep) return;
    try {
      await navigator.clipboard.writeText(crmProject.nextStep);
      toast({ title: "Next step copied to clipboard" });
    } catch (error) {
      toast({
        title: "Error copying next step to clipboard",
        variant: "destructive",
        description: JSON.stringify(error),
      });
    }
  };

  return !editing ? (
    <div>
      <span className="font-semibold">Next step: </span>
      {crmProject.nextStep ?? "-"}{" "}
      <div className="flex flex-row gap-2">
        <Edit
          className="w-4 h-4 text-muted-foreground hover:text-primary inline"
          onClick={() => setEditing(true)}
        />
        {crmProject.nextStep && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <LinkIcon
                  className="w-4 h-4 text-muted-foreground hover:text-primary"
                  onClick={handleCopyToClipBoard}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy next step to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  ) : (
    <div className="space-y-1">
      <div className="font-semibold">
        Next step{" "}
        <span className="font-normal text-muted-foreground">
          Date will be added automatically
        </span>
        :
      </div>
      <div className="text-sm text-muted-foreground">
        Previous value: {crmProject.nextStep ?? "-"}
      </div>
      <Textarea
        value={nextStepVal}
        onChange={(event) => setNextStepVal(event.target.value)}
        disabled={isSaving}
      />
      <div className="flex flex-row gap-1">
        <Button disabled={isSaving} onClick={handleSaveClick} size="sm">
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </Button>
        <Button
          variant="outline"
          disabled={isSaving}
          onClick={() => setEditing(false)}
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NextStep;
