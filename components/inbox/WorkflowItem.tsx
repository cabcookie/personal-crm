import useInboxItem from "@/api/useInboxItem";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { debouncedOnChangeInboxNote } from "@/pages/inbox";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { Button } from "../ui/button";
import {
  WorkflowStepResponse,
  getPreviousStatusByStatus,
  getWorkflowStepByStatus,
  workflow,
} from "./workflow";

type WorkFlowItemProps = {
  inboxItemId: string;
  forwardUrl?: string;
};

const WorkFlowItem: FC<WorkFlowItemProps> = ({ inboxItemId, forwardUrl }) => {
  const router = useRouter();
  const { inboxItem, updateNote, updateStatus, moveInboxItemToProject } =
    useInboxItem(inboxItemId);
  const [step, setStep] = useState(
    getWorkflowStepByStatus(workflow, inboxItem?.status)
  );
  const [prevStatus, setPrevStatus] = useState(
    getPreviousStatusByStatus(workflow, inboxItem?.status || "new")
  );

  useEffect(() => {
    if (!inboxItem) return;
    setStep(getWorkflowStepByStatus(workflow, inboxItem.status));
    setPrevStatus(getPreviousStatusByStatus(workflow, inboxItem.status));
  }, [inboxItem]);

  const handleUpdate = (serializer: () => SerializerOutput) => {
    debouncedOnChangeInboxNote(inboxItemId, serializer, updateNote);
  };

  const goBack = async () => {
    if (!prevStatus) return;
    await updateStatus(inboxItemId, prevStatus);
  };

  const startProcessingItem = async (
    response: WorkflowStepResponse,
    projectId?: string
  ) => {
    if (!inboxItem) return;
    if (!response.nextStep) return;
    if (projectId) {
      const result = await moveInboxItemToProject(projectId);
      if (!result) return;
    } else {
      const result = await updateStatus(inboxItemId, response.nextStep.status);
      if (!result) return;
    }

    if (forwardUrl) router.replace(forwardUrl);
    if (response.nextStep.toHome) router.replace("/inbox");
  };

  return !inboxItem ? (
    "Loading inbox item…"
  ) : !step ? (
    "Loading workflow…"
  ) : (
    <div>
      {inboxItem.status !== "new" && (
        <Button size="sm" onClick={goBack}>
          Return to previous step
        </Button>
      )}
      {step.component && (
        <step.component
          question={step.question}
          responses={step.responses}
          action={startProcessingItem}
        />
      )}
      <NotesWriter notes={inboxItem?.note} saveNotes={handleUpdate} />
    </div>
  );
};

export default WorkFlowItem;
