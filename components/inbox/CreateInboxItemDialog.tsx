import { createInboxItemApi } from "@/api/useInbox";
import {
  emptyDocument,
  getEditorContentAndTaskData,
  SerializerOutput,
} from "@/helpers/ui-notes-writer";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import NotesWriter from "../ui-elements/notes-writer/NotesWriter";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CreateInboxItemContextType {
  state: boolean;
  open: () => void;
  close: () => void;
  editorContent: SerializerOutput;
  setEditorContent: (val: SerializerOutput) => void;
  createInboxItem: () => Promise<string | undefined>;
}

interface CreateInobxItemProviderProps {
  children: ReactNode;
}

const emptyEditorContent = {
  json: emptyDocument,
  hasOpenTasks: false,
};

export const CreateInboxItemProvider: FC<CreateInobxItemProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editorContent, setEditorContent] =
    useState<SerializerOutput>(emptyEditorContent);

  const handleUpdate = (val: SerializerOutput) => setEditorContent(val);

  const handleCreateInboxItem = async () => {
    if (!editorContent) return;
    const result = await createInboxItemApi(
      editorContent.json,
      editorContent.hasOpenTasks
    );
    setEditorContent(emptyEditorContent);
    setIsOpen(false);
    return result?.id;
  };

  return (
    <CreateInboxItemContext.Provider
      value={{
        state: isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        editorContent,
        setEditorContent: handleUpdate,
        createInboxItem: handleCreateInboxItem,
      }}
    >
      {children}
    </CreateInboxItemContext.Provider>
  );
};

const CreateInboxItemContext = createContext<
  CreateInboxItemContextType | undefined
>(undefined);

export const useCreateInboxItemContext = () => {
  const context = useContext(CreateInboxItemContext);
  if (!context)
    throw new Error(
      "useCreateInboxItemContext must be used within CreateInboxItemProvider"
    );
  return context;
};

const CreateInboxItemDialog = () => {
  const {
    state,
    open,
    close,
    editorContent,
    setEditorContent,
    createInboxItem,
  } = useCreateInboxItemContext();

  return (
    <Dialog open={state} onOpenChange={() => (state ? close() : open())}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Inbox Item</DialogTitle>
          <DialogDescription>
            Get it out of your head so you can process and organize it later and
            continue to focus on what matters now.
          </DialogDescription>
        </DialogHeader>
        <NotesWriter
          notes={editorContent.json}
          placeholder="What's on your mind?"
          saveNotes={(editor) => {
            setEditorContent(getEditorContentAndTaskData(editor, () => {})());
          }}
          showSaveStatus={false}
          autoFocus
        />
        <DialogFooter>
          <Button onClick={createInboxItem}>Save Item</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInboxItemDialog;
