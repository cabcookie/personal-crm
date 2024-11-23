import useInbox from "@/api/useInbox";
import { JSONContent } from "@tiptap/core";
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
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
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

type CreateInboxItemDialogProps =
  | {
      dialogTrigger: ReactNode;
      open?: never;
      onOpenChange?: never;
    }
  | {
      dialogTrigger?: never;
      open: boolean;
      onOpenChange: Dispatch<SetStateAction<boolean>>;
    };

const CreateInboxItemDialog: FC<CreateInboxItemDialogProps> = ({
  dialogTrigger,
  open,
  onOpenChange,
}) => {
  const { createInboxItem } = useInbox();
  const [isOpen, setIsOpen] = useState(!!open);
  const [editorContent, setEditorContent] =
    useState<JSONContent>(emptyDocument);

  const handleOpenChange = (open: boolean) => {
    const change = onOpenChange ?? setIsOpen;
    change(open);
  };

  const handleCreateInboxItem = async (content: JSONContent) => {
    const result = await createInboxItem(content);
    setEditorContent(emptyDocument);
    handleOpenChange(false);
    return result?.id;
  };

  return (
    <Dialog
      open={open === undefined ? isOpen : open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <div>{dialogTrigger}</div>
      </DialogTrigger>
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
            saveAtCmdEnter={(editor) => {
              handleCreateInboxItem(editor.getJSON());
            }}
            showSaveStatus={false}
            autoFocus
          />
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => handleCreateInboxItem(editorContent)}>
            Save Item
          </Button>
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
