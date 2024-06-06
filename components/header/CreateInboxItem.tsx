import { Plus } from "lucide-react";
import { useCreateInboxItemContext } from "../inbox/CreateInboxItemDialog";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const CreateInboxItem = () => {
  const { open } = useCreateInboxItemContext();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={open}>
            <Plus className="text-[--context-color]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a new inbox item</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreateInboxItem;
