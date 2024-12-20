import { flow, identity } from "lodash/fp";
import { Undo2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import AccountSelector from "../ui-elements/selectors/account-selector";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import ConfirmContent from "./ConfirmContent";
import InboxDecisionBtn from "./InboxDecisionBtn";
import InboxDecisionHeader from "./InboxDecisionHeader";
import {
  findStepByStatus,
  statusWithAction,
  workflow,
  WorkflowResponse,
  WorkflowStatus,
  WorkflowStatusWithActions,
  WorkflowStep,
} from "./inboxWorkflow";

type InboxDecisionMenuProps = {
  setInboxItemDone: () => void;
  addToProject: (projectId: string) => void;
  addToPerson: (personId: string, withPrayer?: boolean) => void;
  addToAccount: (accountId: string) => void;
};

const InboxDecisionMenu: FC<InboxDecisionMenuProps> = ({
  setInboxItemDone,
  addToProject,
  addToPerson,
  addToAccount,
}) => {
  const [status, setStatus] = useState<WorkflowStatus>("new");
  const [step, setStep] = useState<WorkflowStep | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    flow(identity<WorkflowStep>, findStepByStatus(status), setStep)(workflow);
  }, [status]);

  const takeAction = (response: WorkflowResponse) => () => {
    if (!response.takeAction) {
      setStatus(response.status);
      return;
    }
    const actionStatus = response.status as WorkflowStatusWithActions;
    if (!statusWithAction.includes(actionStatus)) return;
    const actions: Record<WorkflowStatusWithActions, () => void> = {
      done: setInboxItemDone,
      addToProject: () => {
        if (!selectedProject) return;
        addToProject(selectedProject);
      },
      addToPerson: () => {
        if (!selectedPerson) return;
        addToPerson(selectedPerson);
      },
      addToPersonWithPrayer: () => {
        if (!selectedPerson) return;
        addToPerson(selectedPerson, true);
      },
      addToAccount: () => {
        if (!selectedAccount) return;
        addToAccount(selectedAccount);
      },
    };
    actions[actionStatus]();
  };

  return (
    step && (
      <div className="space-y-2">
        <InboxDecisionHeader step={step} />

        {step.status === "addToProject" && (
          <ProjectSelector
            value={selectedProject ?? ""}
            onChange={setSelectedProject}
            allowCreateProjects
          />
        )}

        {step.status === "addToPerson" && (
          <PeopleSelector
            value={selectedPerson ?? ""}
            onChange={setSelectedPerson}
            allowNewPerson
          />
        )}

        {step.status === "addToAccount" && (
          <AccountSelector
            value={selectedAccount ?? ""}
            onChange={setSelectedAccount}
            allowCreateAccounts
          />
        )}

        <div className="flex flex-row gap-2">
          {step.responses?.map((response) => (
            <InboxDecisionBtn
              key={response.decisionName}
              Icon={response.StepIcon}
              label={response.decisionName}
              onClick={takeAction(response)}
            />
          ))}

          {step.status !== "new" && (
            <InboxDecisionBtn
              onClick={() => setStatus("new")}
              Icon={Undo2}
              label="Resume"
            />
          )}
        </div>

        <ConfirmContent status={status} className="translate-y-4" />
      </div>
    )
  );
};

export default InboxDecisionMenu;
