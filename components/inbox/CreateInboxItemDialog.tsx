import useInbox from "@/api/useInbox";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import NotesWriter, {
  EditorJsonContent,
} from "../ui-elements/notes-writer/NotesWriter";
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
  inboxItemText: EditorJsonContent | undefined;
  setInboxItemText: (val: { json: EditorJsonContent } | undefined) => void;
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
  const [inboxItemText, setInboxItemText] = useState<
    EditorJsonContent | undefined
  >();

  const handleUpdate = (val: { json: EditorJsonContent } | undefined) =>
    val && setInboxItemText(val.json);

  const handleCreateInboxItem = async () => {
    if (!inboxItemText) return;
    const result = await createInboxItem(inboxItemText);
    setInboxItemText(undefined);
    setIsOpen(false);
    return result;
  };

  return (
    <CreateInboxItemContext.Provider
      value={{
        state: isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        inboxItemText,
        setInboxItemText: handleUpdate,
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
    inboxItemText,
    setInboxItemText,
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
          notes={inboxItemText || ""}
          placeholder="What's on your mind?"
          saveNotes={(serializer) => setInboxItemText(serializer())}
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
