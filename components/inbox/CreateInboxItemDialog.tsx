import useInbox from "@/api/useInbox";
import { emptyDocument, SerializerOutput } from "@/helpers/ui-notes-writer";
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
  editorContent: SerializerOutput | undefined;
  setEditorContent: (val: SerializerOutput | undefined) => void;
  createInboxItem: () => Promise<string | undefined>;
}

interface CreateInobxItemProviderProps {
  children: ReactNode;
}

export const CreateInboxItemProvider: FC<CreateInobxItemProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createInboxItem } = useInbox();
  const [editorContent, setEditorContent] = useState<
    SerializerOutput | undefined
  >();

  const handleUpdate = (val: SerializerOutput | undefined) =>
    val && setEditorContent(val);

  const handleCreateInboxItem = async () => {
    if (!editorContent) return;
    const result = await createInboxItem(editorContent);
    setEditorContent(undefined);
    setIsOpen(false);
    return result;
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
          notes={editorContent?.json || emptyDocument}
          placeholder="What's on your mind?"
          saveNotes={(serializer) => setEditorContent(serializer())}
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
