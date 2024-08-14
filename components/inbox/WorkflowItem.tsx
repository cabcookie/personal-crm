import { HandleMutationFn, Inbox } from "@/api/useInbox";
import useInboxWorkflow from "@/api/useInboxWorkflow";
import { getEditorContent } from "@/helpers/ui-notes-writer";
import { debouncedOnChangeInboxNote } from "@/pages/inbox";
import { Editor } from "@tiptap/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  getPreviousStatusByStatus,
  getWorkflowStepByStatus,
  workflow,
  WorkflowStepResponse,
} from "./workflow";

type WorkFlowItemProps = {
  inboxItem?: Inbox;
  isLoading?: boolean;
  forwardUrl?: string;
  mutate: HandleMutationFn;
};

const WorkFlowItem: FC<WorkFlowItemProps> = ({
  inboxItem,
  forwardUrl,
  isLoading,
  mutate,
}) => {
  const router = useRouter();
  const [step, setStep] = useState(
    getWorkflowStepByStatus(workflow, inboxItem?.status)
  );
  const [prevStatus, setPrevStatus] = useState(
    getPreviousStatusByStatus(workflow, inboxItem?.status || "new")
  );
  const { updateNote, updateStatus, moveInboxItemToProject } =
    useInboxWorkflow(mutate);

  useEffect(() => {
    if (!inboxItem) return;
    setStep(getWorkflowStepByStatus(workflow, inboxItem.status));
    setPrevStatus(getPreviousStatusByStatus(workflow, inboxItem.status));
  }, [inboxItem]);

  const handleUpdate = (editor: Editor) => {
    if (!inboxItem) return;
    debouncedOnChangeInboxNote(
      inboxItem.id,
      getEditorContent(editor),
      updateNote(inboxItem)
    );
  };

  const goBack = async () => {
    if (!prevStatus) return;
    if (!inboxItem) return;
    await updateStatus(inboxItem, prevStatus);
  };

  const startProcessingItem = async (
    response: WorkflowStepResponse,
    projectId?: string
  ) => {
    if (!inboxItem) return;
    if (!response.nextStep) return;
    if (projectId) {
      const result = await moveInboxItemToProject(inboxItem, projectId);
      if (!result) return;
    } else {
      const result = await updateStatus(inboxItem, response.nextStep.status);
      if (!result) return;
    }

    if (forwardUrl) router.replace(forwardUrl);
    if (response.nextStep.toHome) router.replace("/inbox");
  };

  return isLoading ? (
    <Skeleton className="w-full h-8" />
  ) : !step ? (
    "Loading workflow…"
  ) : (
    inboxItem && (
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
    )
  );
};

export default WorkFlowItem;
