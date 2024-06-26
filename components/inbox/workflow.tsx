import { InboxStatus } from "@/api/useInbox";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";
import ClarifyAction from "./ClarifyAction";
import Question from "./Question";

export type WorkflowStepComponentProps = {
  question?: string;
  responses?: WorkflowStepResponse[];
  action: (response: WorkflowStepResponse, projectId?: string) => void;
};

export type WorkflowStepResponse = {
  response: string;
  btnVariant?: VariantProps<typeof buttonVariants>;
  nextStep?: WorkflowStep;
};

type WorkflowStep = {
  status: InboxStatus;
  question?: string;
  toHome?: boolean;
  action?: (id: string, setting?: any) => void;
  component?: React.FC<WorkflowStepComponentProps>;
  responses?: WorkflowStepResponse[];
};

export const workflow: WorkflowStep = {
  status: "new",
  question: "Is it actionable?",
  component: Question,
  responses: [
    {
      response: "Yes",
      btnVariant: { variant: "constructive" },
      nextStep: {
        status: "actionable",
        question: "Doable in 2 minutes?",
        component: Question,
        responses: [
          {
            response: "Yes",
            btnVariant: { variant: "constructive" },
            nextStep: {
              status: "doNow",
              question: "Done?",
              component: Question,
              responses: [
                {
                  response: "Yes",
                  btnVariant: { variant: "constructive" },
                  nextStep: {
                    status: "done",
                    toHome: true,
                  },
                },
              ],
            },
          },
          {
            response: "No",
            btnVariant: { variant: "destructive" },
            nextStep: {
              status: "clarifyAction",
              component: ClarifyAction,
              responses: [
                {
                  response: "next",
                  nextStep: { status: "done", toHome: true },
                },
              ],
            },
          },
        ],
      },
    },
    {
      response: "No",
      btnVariant: { variant: "destructive" },
      nextStep: {
        status: "notActionable",
        question: "Move to a project?",
        component: Question,
        responses: [
          {
            response: "Yes",
            btnVariant: { variant: "constructive" },
            nextStep: {
              status: "moveToProject",
              component: ClarifyAction,
              responses: [
                {
                  response: "next",
                  nextStep: { status: "done", toHome: true },
                },
              ],
            },
          },
          {
            response: "No",
            btnVariant: { variant: "destructive" },
            nextStep: {
              status: "clarifyDeletion",
              question: "Confirm deletion:",
              component: Question,
              responses: [
                {
                  response: "Yes",
                  btnVariant: { variant: "destructive" },
                  nextStep: { status: "done", toHome: true },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const getWorkflowStepByStatus = (
  workflowStep: WorkflowStep,
  desiredStatus?: InboxStatus
): WorkflowStep | null => {
  if (!desiredStatus) {
    return workflowStep;
  }

  if (workflowStep.status === desiredStatus) {
    return workflowStep;
  }

  // If there are responses, iterate over them to find the next steps
  if (workflowStep.responses) {
    for (const response of workflowStep.responses) {
      if (response.nextStep) {
        // Recursively search in the next steps
        const foundStep = getWorkflowStepByStatus(
          response.nextStep,
          desiredStatus
        );
        if (foundStep) {
          return foundStep;
        }
      }
    }
  }

  // Return null if the step is not found
  return null;
};

// Function to find the previous status by a given status
export const getPreviousStatusByStatus = (
  workflowStep: WorkflowStep,
  currentStatus: InboxStatus,
  parentStatus: InboxStatus | null = null
): InboxStatus | null => {
  // Check if the current step matches the desired status
  if (workflowStep.status === currentStatus) {
    return parentStatus;
  }

  // If there are responses, iterate over them to find the next steps
  if (workflowStep.responses) {
    for (const response of workflowStep.responses) {
      if (response.nextStep) {
        // Recursively search in the next steps, passing the current status as parentStatus
        const foundStatus = getPreviousStatusByStatus(
          response.nextStep,
          currentStatus,
          workflowStep.status
        );
        if (foundStatus) {
          return foundStatus;
        }
      }
    }
  }

  // Return null if the status is not found
  return null;
};
