import useInbox, {
  Inbox,
  InboxStatus,
  STATUS_LIST,
  isValidInboxStatus,
} from "@/api/useInbox";
import MainLayout from "@/components/layouts/MainLayout";
import SubmitButton from "@/components/ui-elements/buttons/submit-button";
import listStyles from "@/components/ui-elements/list-items/ListItem.module.css";
import ToProcessItem from "@/components/ui-elements/list-items/to-process-item";
import NotesWriter, {
  EditorJsonContent,
  SerializerOutput,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import ProjectSelector from "@/components/ui-elements/project-selector";
import StatusSelector from "@/components/ui-elements/status-selector/status-selector";
import ProjectName from "@/components/ui-elements/tokens/project-name";
import { debounce } from "lodash";
import { FC, FormEvent, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { MdDoneOutline } from "react-icons/md";
import styles from "./Inbox.module.css";

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, note: EditorJsonContent) => ApiResponse;

const debouncedOnChange = debounce(
  async (
    id: string,
    serializer: () => SerializerOutput,
    updateNote: UpdateInboxFn,
    setSaved: (status: boolean) => void
  ) => {
    const { json: note } = serializer();
    const data = await updateNote(id, note);
    if (!data) return;
    setSaved(true);
  },
  1500
);

type QuestionProps = {
  question: string;
  action: (response: boolean) => () => void;
};

const Question: FC<QuestionProps> = ({ question, action }) => {
  return (
    <div className={styles.question}>
      {question}
      <div className={styles.decisionBtns}>
        <SubmitButton onClick={action(true)} btnClassName={styles.positive}>
          Yes
        </SubmitButton>
        <SubmitButton onClick={action(false)} btnClassName={styles.negative}>
          No
        </SubmitButton>
      </div>
    </div>
  );
};

type InputFieldProps = {
  inboxItem: Inbox;
};

const InboxPage = () => {
  const [newItem, setNewItem] = useState<EditorJsonContent>({});
  const [statusFilter, setStatusFilter] = useState<InboxStatus>("new");
  const {
    inbox,
    createInbox,
    updateNote,
    makeActionable,
    makeNonActionable,
    doNow,
    clarifyAction,
    isDone,
    moveToProject,
    clarifyDeletion,
    moveInboxItemToProject,
  } = useInbox(statusFilter);

  const InputField: FC<InputFieldProps> = ({
    inboxItem: { id, note, createdAt },
  }) => {
    const [saved, setSaved] = useState(true);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const handleUpdate = (serializer: () => SerializerOutput) => {
      setSaved(false);
      debouncedOnChange(id, serializer, updateNote, setSaved);
    };

    type ResponderActionAndStatus = {
      action: (id: string) => any;
      newStatus: InboxStatus;
    };
    const createResponder =
      (options: {
        true: ResponderActionAndStatus;
        false: ResponderActionAndStatus;
      }) =>
      (response: boolean) =>
      async () => {
        const { action, newStatus } = options[`${response}`];
        const result = await action(id);
        if (!result) return;
        setStatusFilter(newStatus);
      };

    const respondDone = (done: boolean) => async () => {
      if (!done) return;
      const result = await isDone(id);
      if (!result) return;
      setStatusFilter("new");
    };

    const respondProjectSelected = async (projectId: string | null) => {
      if (!projectId) return;
      const result = await moveInboxItemToProject(
        id,
        createdAt,
        note,
        projectId
      );
      if (!result) return;
      setStatusFilter("new");
    };

    return (
      <ToProcessItem
        title={
          <>
            {statusFilter === "moveToProject" && (
              <ProjectSelector
                onChange={respondProjectSelected}
                placeholder="Select project…"
              />
            )}
            {statusFilter === "clarifyAction" && (
              <div>
                <ProjectSelector
                  placeholder="Select project…"
                  onChange={setSelectedProject}
                  allowCreateProjects
                />
                {selectedProject && (
                  <div>
                    <ProjectName projectId={selectedProject} />
                    <ProjectDetails projectId={selectedProject} />
                    <SubmitButton
                      onClick={() => respondProjectSelected(selectedProject)}
                    >
                      Confirm Changes
                    </SubmitButton>
                  </div>
                )}
                <div>
                  <strong>
                    Inbox Notes (will be moved to selected project):
                  </strong>
                </div>
              </div>
            )}
            <NotesWriter
              notes={note}
              unsaved={!saved}
              saveNotes={handleUpdate}
            />
          </>
        }
        actionStep={(() => {
          switch (statusFilter) {
            case "new":
              return (
                <Question
                  question="Is it actionable?"
                  action={createResponder({
                    true: { action: makeActionable, newStatus: "actionable" },
                    false: {
                      action: makeNonActionable,
                      newStatus: "notActionable",
                    },
                  })}
                />
              );
            case "actionable":
              return (
                <Question
                  question="Doable in 2 minutes?"
                  action={createResponder({
                    true: { action: doNow, newStatus: "doNow" },
                    false: {
                      action: clarifyAction,
                      newStatus: "clarifyAction",
                    },
                  })}
                />
              );
            case "notActionable":
              return (
                <Question
                  question="Move to a project?"
                  action={createResponder({
                    true: { action: moveToProject, newStatus: "moveToProject" },
                    false: {
                      action: clarifyDeletion,
                      newStatus: "clarifyDeletion",
                    },
                  })}
                />
              );
            case "doNow":
              return <Question question="Done?" action={respondDone} />;
            case "done":
              return <MdDoneOutline className={listStyles.listItemIcon} />;
            case "moveToProject":
              return <FaArrowRight className={listStyles.listItemIcon} />;
            case "clarifyDeletion":
              return (
                <Question question="Confirm deletion:" action={respondDone} />
              );
            case "clarifyAction":
              return <FaArrowRight className={listStyles.listItemIcon} />;
            default:
              return "Unknown Status";
          }
        })()}
      />
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await createInbox(newItem);
    if (!data) return;
    setNewItem({});
  };

  return (
    <MainLayout title="Inbox" sectionName="Inbox">
      <StatusSelector
        options={STATUS_LIST}
        value={statusFilter}
        onChange={(val) => isValidInboxStatus(val) && setStatusFilter(val)}
      />
      {inbox?.map((item) => (
        <InputField key={item.id} inboxItem={item} />
      ))}
      {statusFilter === "new" && (
        <form onSubmit={handleSubmit}>
          <ToProcessItem
            title={
              <NotesWriter
                notes={newItem}
                saveNotes={(s) => setNewItem(s().json)}
                unsaved={newItem.length > 3}
                placeholder="What's on your mind?"
              />
            }
          />
          <SubmitButton type="submit">Confirm</SubmitButton>
        </form>
      )}
    </MainLayout>
  );
};

export default InboxPage;
