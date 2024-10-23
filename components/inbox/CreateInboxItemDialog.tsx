import { createInboxItemApi } from "@/api/useInboxWorkflow";
import { JSONContent } from "@tiptap/core";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { emptyDocument } from "../ui-elements/editors/helpers/document";
import InboxEditor from "../ui-elements/editors/inbox-editor/InboxEditor";
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
import { ScrollArea } from "../ui/scroll-area";

interface CreateInboxItemContextType {
  state: boolean;
  open: () => void;
  close: () => void;
  editorContent: JSONContent;
  setEditorContent: (val: JSONContent) => void;
  createInboxItem: () => Promise<string | undefined>;
}

interface CreateInobxItemProviderProps {
  children: ReactNode;
}

export const CreateInboxItemProvider: FC<CreateInobxItemProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editorContent, setEditorContent] =
    useState<JSONContent>(emptyDocument);

  const handleCreateInboxItem = async () => {
    if (!editorContent) return;
    const result = await createInboxItemApi(editorContent);
    setEditorContent(emptyDocument);
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
        setEditorContent,
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
        <ScrollArea className="max-h-80 md:max-h-[30rem] w-full">
          <InboxEditor
            notes={editorContent}
            saveNotes={(editor) => {
              setEditorContent(editor.getJSON());
            }}
            showSaveStatus={false}
            autoFocus
          />
        </ScrollArea>
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
