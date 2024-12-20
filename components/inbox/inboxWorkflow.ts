import {
  BookOpenCheck,
  Building,
  Check,
  CloudLightning,
  HandHelping,
  Stars,
  StepForward,
  Trash2,
  User,
  X,
} from "lucide-react";

export type WorkflowStatus =
  | "new"
  | "actionable"
  | "notActionable"
  | "doNow"
  | "addToProject"
  | "addToPerson"
  | "addToPersonWithPrayer"
  | "addToAccount"
  | "confirmDeletion"
  | "done";
export type WorkflowStepIcon = typeof Stars;

export type WorkflowStatusWithActions =
  | "addToProject"
  | "addToPerson"
  | "addToPersonWithPrayer"
  | "addToAccount"
  | "done";

export const statusWithAction = [
  "addToProject",
  "addToPerson",
  "addToPersonWithPrayer",
  "addToAccount",
  "done",
] as const;

type WorkflowStart = {
  status: WorkflowStatus;
  statusName: string;
  question: string;
  StepIcon: WorkflowStepIcon;
  responses?: WorkflowResponse[];
};
export type WorkflowResponse = WorkflowStart & {
  decisionName: string;
  takeAction?: true;
};

export type WorkflowStep = WorkflowStart | WorkflowResponse;

const makeAddToProjectDecision = (decisionName: string): WorkflowResponse => ({
  decisionName,
  status: "addToProject",
  statusName: "Add to project",
  StepIcon: BookOpenCheck,
  question: "Select Project:",
  responses: [
    {
      decisionName: "Done",
      status: "addToProject",
      statusName: "Done",
      StepIcon: Check,
      question: "Done!",
      takeAction: true,
    },
  ],
});

export const workflow: WorkflowStart = {
  status: "new",
  statusName: "New Item",
  question: "Is it actionable?",
  StepIcon: Stars,
  responses: [
    {
      decisionName: "Yes",
      status: "actionable",
      statusName: "Actionable",
      StepIcon: StepForward,
      question: "Doable in 2 minutes?",
      responses: [
        {
          decisionName: "Yes",
          status: "doNow",
          statusName: "Do Now",
          StepIcon: CloudLightning,
          question: "Done?",
          responses: [
            {
              decisionName: "Yes",
              status: "done",
              statusName: "Done",
              StepIcon: Check,
              question: "Done!",
              takeAction: true,
            },
          ],
        },
        makeAddToProjectDecision("No"),
      ],
    },
    {
      decisionName: "No",
      status: "notActionable",
      statusName: "Not Actionable",
      StepIcon: X,
      question: "Where does it belong to?",
      responses: [
        makeAddToProjectDecision("Project"),
        {
          decisionName: "Person",
          status: "addToPerson",
          statusName: "Add to person",
          StepIcon: User,
          question: "Relevant for prayer?",
          responses: [
            {
              decisionName: "Yes",
              status: "addToPersonWithPrayer",
              statusName: "Done",
              StepIcon: HandHelping,
              question: "Done!",
              takeAction: true,
            },
            {
              decisionName: "No",
              status: "addToPerson",
              statusName: "Done",
              StepIcon: X,
              question: "Done!",
              takeAction: true,
            },
          ],
        },
        {
          decisionName: "Account",
          status: "addToAccount",
          statusName: "Add to account",
          StepIcon: Building,
          question: "Select Account:",
          responses: [
            {
              decisionName: "Done",
              status: "addToAccount",
              statusName: "Done",
              StepIcon: Check,
              question: "Done!",
              takeAction: true,
            },
          ],
        },
        {
          decisionName: "Trash",
          status: "confirmDeletion",
          statusName: "Confirm deletion",
          StepIcon: Trash2,
          question: "Are you sure you want to delete the item?",
          responses: [
            {
              decisionName: "Yes",
              status: "done",
              statusName: "Trashed",
              StepIcon: Check,
              question: "Done!",
              takeAction: true,
            },
            {
              decisionName: "No",
              status: "notActionable",
              statusName: "Not Trashed",
              StepIcon: X,
              question: "Done!",
            },
          ],
        },
      ],
    },
  ],
};

export const findStepByStatus =
  (status: WorkflowStatus) =>
  (workflow: WorkflowStep): WorkflowStep | null => {
    if (workflow.status === status) return workflow;

    if (workflow.responses) {
      for (const response of workflow.responses) {
        const foundStep = findStepByStatus(status)(response);
        if (foundStep) return foundStep;
      }
    }

    return null;
  };
